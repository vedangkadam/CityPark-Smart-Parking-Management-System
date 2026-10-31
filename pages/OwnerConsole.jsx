const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from "react";

import { useAuth } from "@/lib/AuthContext";
import { Plus, MapPin, Trash2, Circle, Pencil } from "lucide-react";
import MapView from "@/components/parking/MapView";
import OwnerLotForm from "@/components/parking/OwnerLotForm";

export default function OwnerConsole() {
  const { user } = useAuth();
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [pinMode, setPinMode] = useState(false);
  const [pinPosition, setPinPosition] = useState(null);

  const load = () => {
    setLoading(true);
    db.entities.ParkingLot.list("-created_date", 100)
      .then((all) => setLots(all.filter((l) => l.created_by_id === user.id)))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user?.id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handlePlacePin = () => {
    setPinMode(true);
    setShowForm(true);
  };

  const handleMapClick = (pos) => {
    setPinPosition(pos);
    setPinMode(false);
  };

  const handleCreated = () => {
    setShowForm(false);
    setPinPosition(null);
    setPinMode(false);
    load();
  };

  const handleDelete = async (lot) => {
    if (!confirm(`Delete "${lot.name}"? This removes it from the network.`)) return;
    try {
      await db.entities.ParkingLot.delete(lot.id);
      load();
    } catch (e) {
      alert(e.message || "Failed to delete");
    }
  };

  const mapLots = showForm && pinMode ? [] : lots;

  return (
    <div className="flex flex-col md:flex-row md:h-full flex-1">
      <div className="h-[40vh] md:h-[calc(100vh-4rem)] md:flex-1 md:order-2 relative border-b md:border-b-0 border-border">
        <MapView
          lots={mapLots}
          pinMode={pinMode}
          pinPosition={pinPosition}
          onMapClick={handleMapClick}
          center={pinPosition ? [pinPosition.lat, pinPosition.lng] : [18.95, 73.0]}
          zoom={pinPosition ? 15 : 10}
        />
        {pinMode && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg whitespace-nowrap">
            Tap the map to place your lot
          </div>
        )}
      </div>

      <aside className="md:order-1 md:w-[420px] md:flex-shrink-0 bg-background flex flex-col md:h-[calc(100vh-4rem)]">
        <div className="p-4 border-b border-border flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="font-heading font-extrabold text-lg text-foreground">Owner Console</h1>
            <p className="text-xs text-muted-foreground">Manage your parking locations</p>
          </div>
          <button
            onClick={() => {
              setPinPosition(null);
              setShowForm(true);
              handlePlacePin();
            }}
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-3.5 py-2.5 rounded-lg transition"
          >
            <Plus className="w-4 h-4" /> Add lot
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-16 md:pb-4 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {loading ? "Loading…" : `${lots.length} lots`}
          </p>
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : lots.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto">
                <MapPin className="w-7 h-7 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-semibold text-foreground mt-3">No lots yet</p>
              <p className="text-xs text-muted-foreground mt-1">Add your first parking location to start earning</p>
            </div>
          ) : (
            lots.map((lot) => (
              <div key={lot.id} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-heading font-bold text-foreground text-sm">{lot.name}</h3>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{lot.address}</p>
                  </div>
                  <span className="font-heading font-extrabold text-foreground text-sm whitespace-nowrap">
                    ₹{lot.price_per_hour}
                    <span className="font-medium text-muted-foreground text-xs">/hr</span>
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <Circle className="w-1.5 h-1.5 fill-current" /> {lot.available_spots}/{lot.total_spots} free
                  </span>
                  <button
                    onClick={() => handleDelete(lot)}
                    className="text-xs text-muted-foreground hover:text-red-600 dark:hover:text-red-400 inline-flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {showForm && (
        <OwnerLotForm
          pinPosition={pinPosition}
          onPlacePin={handlePlacePin}
          onCreated={handleCreated}
          onClose={() => {
            setShowForm(false);
            setPinPosition(null);
            setPinMode(false);
          }}
        />
      )}
    </div>
  );
}