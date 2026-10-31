const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";

import { Search, Calendar, MapPin, LocateFixed } from "lucide-react";
import MapView from "@/components/parking/MapView";
import ParkingLotCard from "@/components/parking/ParkingLotCard";
import LotDetailsSheet from "@/components/parking/LotDetailsSheet";
import PriceFilter from "@/components/parking/PriceFilter";
import DurationPicker from "@/components/parking/DurationPicker";
import AmbientGlow from "@/components/parking/AmbientGlow";
import { useUserLocation } from "@/hooks/useUserLocation";
import { haversineDistance, defaultStartTime } from "@/lib/parking";

const MAP_CENTER = { lat: 18.95, lng: 73.0 };

export default function Home() {
  const { userLocation } = useOutletContext();
  const { request } = useUserLocation();
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [startTime, setStartTime] = useState(defaultStartTime());
  const [duration, setDuration] = useState(2);
  const [selectedLot, setSelectedLot] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [locating, setLocating] = useState(false);

  const center = userLocation
    ? { lat: userLocation.lat, lng: userLocation.lng }
    : MAP_CENTER;

  useEffect(() => {
    db.entities.ParkingLot.list("-created_date", 100)
      .then(setLots)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const priceBounds = useMemo(() => ({ min: 30, max: 80 }), []);

  const effectiveMax = maxPrice ?? priceBounds.max;

  const filtered = useMemo(() => {
    return lots
      .filter(
        (l) =>
          l.available_spots > 0 &&
          (!search ||
            l.name.toLowerCase().includes(search.toLowerCase()) ||
            l.address.toLowerCase().includes(search.toLowerCase())) &&
          l.price_per_hour <= effectiveMax
      )
      .map((l) => ({
        ...l,
        distance: haversineDistance(center.lat, center.lng, l.lat, l.lng),
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [lots, search, effectiveMax, center]);

  const selectedPos = selectedLot ? [selectedLot.lat, selectedLot.lng] : null;

  return (
    <div className="flex flex-col md:flex-row md:h-full flex-1">
      {/* Map — first in DOM so it sits on top for mobile */}
      <div className="h-[45vh] md:h-[calc(100vh-4rem)] md:flex-1 md:order-2 relative border-b md:border-b-0 border-border">
        <MapView
          lots={filtered}
          selectedLotId={selectedLot?.id}
          onSelectLot={setSelectedLot}
          selectedPos={selectedPos}
          center={[center.lat, center.lng]}
          zoom={userLocation ? 13 : 10}
        />
        <button
          onClick={async () => {
            setLocating(true);
            await request();
            setLocating(false);
          }}
          className="group absolute top-3 right-3 w-9 h-9 rounded-full overflow-hidden flex items-center justify-center text-white shadow-lg shadow-primary/30 border-0 bg-gradient-to-br from-[#4F46E5] to-[#8B5CF6] transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40"
          aria-label="Use my location"
        >
          <span
            className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            aria-hidden="true"
          />
          <LocateFixed className={`relative w-4 h-4 ${locating ? "animate-pulse" : ""}`} />
        </button>
        <div className="absolute top-3 left-3 rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-primary/25 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6] bg-[length:200%_100%] animate-gradient-pan hidden md:flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-soft" aria-hidden="true" />
          <MapPin className="w-3.5 h-3.5" /> {filtered.length} lots near you
        </div>
      </div>

      {/* Sidebar */}
      <aside className="relative overflow-hidden md:order-1 md:w-[420px] md:flex-shrink-0 bg-background flex flex-col md:h-[calc(100vh-4rem)]">
        <AmbientGlow dots />
        <div className="relative p-4 border-b border-border space-y-3 flex-shrink-0 bg-card/70 backdrop-blur-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search area or lot name"
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full pl-9 pr-2 py-2.5 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="w-24">
              <DurationPicker value={duration} onChange={setDuration} />
            </div>
          </div>
          <PriceFilter
            min={priceBounds.min}
            max={priceBounds.max}
            value={effectiveMax}
            onChange={setMaxPrice}
          />
        </div>

        <div className="relative flex-1 overflow-y-auto p-4 pb-16 md:pb-4 space-y-3">
          <span className="inline-flex w-fit items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/15 via-[#8B5CF6]/15 to-[#06B6D4]/15 text-primary border border-primary/20">
            <MapPin className="w-3 h-3" />
            {loading ? "Loading…" : `${filtered.length} spots available`}
          </span>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 rounded-xl animate-shimmer bg-gradient-to-r from-muted via-primary/10 to-muted bg-[length:200%_100%]"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <div className="relative w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/15 to-[#8B5CF6]/15 border border-primary/20 flex items-center justify-center">
                <span
                  className="absolute inset-0 rounded-2xl bg-primary/20 animate-pulse-soft"
                  aria-hidden="true"
                />
                <MapPin className="relative w-7 h-7 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mt-3">No lots match your search</p>
            </div>
          ) : (
            filtered.map((lot) => (
              <ParkingLotCard
                key={lot.id}
                lot={lot}
                distance={lot.distance}
                selected={selectedLot?.id === lot.id}
                onSelect={setSelectedLot}
              />
            ))
          )}
        </div>
      </aside>

      {selectedLot && <LotDetailsSheet lot={selectedLot} onClose={() => setSelectedLot(null)} />}
    </div>
  );
}