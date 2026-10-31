import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const TILE_URL = "https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}";
const TILE_REF = null;
const TILE_ATTR = "Map data &copy; Google";

function priceIcon(price, selected) {
  const bg = selected ? "hsl(var(--primary))" : "hsl(var(--card))";
  const color = selected ? "#FFFFFF" : "hsl(var(--foreground))";
  const border = selected ? "hsl(var(--primary))" : "hsl(var(--border))";
  const shadow = selected ? "0 4px 14px rgba(79,70,229,0.45)" : "0 2px 8px rgba(15,23,42,0.12)";
  return L.divIcon({
    className: "price-pin",
    html: `<div style="background:${bg};color:${color};border:1.5px solid ${border};box-shadow:${shadow};border-radius:999px;padding:5px 11px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:13px;white-space:nowrap;line-height:1;">₹${price}<span style="font-weight:500;opacity:.65;font-size:11px;">/hr</span></div>`,
    iconSize: [70, 30],
    iconAnchor: [35, 30],
  });
}

function ownerPinIcon() {
  return L.divIcon({
    className: "owner-pin",
    html: `<div style="width:30px;height:30px;background:#4F46E5;border:3.5px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(79,70,229,0.55);"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
}

function MapClickHandler({ onClick, pinMode }) {
  useMapEvents({
    click(e) {
      if (pinMode) onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function FlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 15, { duration: 0.6 });
  }, [position, map]);
  return null;
}

function InvalidateSize() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 250);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

const MAHARASHTRA_BOUNDS = [
  [14.5, 72.6],
  [22.0, 80.9],
];

export default function MapView({
  lots = [],
  selectedLotId,
  onSelectLot,
  pinMode = false,
  pinPosition,
  onMapClick,
  selectedPos,
  center = [18.95, 73.0],
  zoom = 10,
}) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      minZoom={6}
      scrollWheelZoom
      className="w-full h-full z-0"
      zoomControl={false}
      maxBounds={MAHARASHTRA_BOUNDS}
      maxBoundsViscosity={1.0}
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTR} subdomains={["0", "1", "2", "3"]} />
      {TILE_REF && <TileLayer url={TILE_REF} />}
      {lots.map((lot) => (
        <Marker
          key={lot.id}
          position={[lot.lat, lot.lng]}
          icon={priceIcon(lot.price_per_hour, lot.id === selectedLotId)}
          eventHandlers={{ click: () => onSelectLot(lot) }}
        />
      ))}
      {pinPosition && <Marker position={[pinPosition.lat, pinPosition.lng]} icon={ownerPinIcon()} />}
      <MapClickHandler onClick={onMapClick} pinMode={pinMode} />
      <FlyTo position={selectedPos} />
      <InvalidateSize />
    </MapContainer>
  );
}