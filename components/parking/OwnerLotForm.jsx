const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";
import { X, MapPin, Plus } from "lucide-react";

import { useDismissOnBack } from "@/hooks/useDismissOnBack";

export default function OwnerLotForm({ pinPosition, onPlacePin, onCreated, onClose }) {
  const dismiss = useDismissOnBack(onClose, "ownerForm");
  const [form, setForm] = useState({
    name: "",
    address: "",
    total_spots: 10,
    price_per_hour: 60,
    amenities: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setError(null);
    if (!pinPosition) {
      setError("Tap the map to place a pin at your lot location first.");
      return;
    }
    if (!form.name.trim() || !form.address.trim()) {
      setError("Lot name and address are required.");
      return;
    }
    setLoading(true);
    try {
      await db.entities.ParkingLot.create({
        name: form.name.trim(),
        address: form.address.trim(),
        lat: pinPosition.lat,
        lng: pinPosition.lng,
        total_spots: Number(form.total_spots),
        available_spots: Number(form.total_spots),
        price_per_hour: Number(form.price_per_hour),
        amenities: form.amenities.trim(),
        description: form.description.trim(),
      });
      onCreated();
    } catch (e) {
      setError(e.message || "Failed to create lot");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-end md:items-stretch md:justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={dismiss} />
      <div className="relative bg-card w-full md:max-w-md md:h-full rounded-t-2xl md:rounded-none overflow-y-auto flex flex-col">
        <div className="p-5 border-b border-border flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="font-heading font-extrabold text-xl text-foreground">Add a parking lot</h2>
            <p className="text-sm text-muted-foreground mt-0.5">List your lot on the CityPark network</p>
          </div>
          <button onClick={dismiss} className="w-8 h-8 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition">
            <X className="w-4 h-4 text-foreground" />
          </button>
        </div>

        <div className="p-5 flex-1 space-y-4">
          <button
            onClick={onPlacePin}
            className={`w-full p-4 rounded-xl border-2 border-dashed flex items-center gap-3 transition ${
              pinPosition ? "border-primary bg-primary/5" : "border-border hover:border-primary bg-muted"
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${pinPosition ? "bg-primary" : "bg-card border border-border"}`}>
              <MapPin className={`w-5 h-5 ${pinPosition ? "text-white" : "text-muted-foreground"}`} />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">
                {pinPosition ? "Pin placed" : "Place pin on map"}
              </p>
              <p className="text-xs text-muted-foreground">
                {pinPosition
                  ? `${pinPosition.lat.toFixed(4)}, ${pinPosition.lng.toFixed(4)}`
                  : "Tap to enable map pin placement"}
              </p>
            </div>
          </button>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Lot name</label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Connaught Place Garage"
              className="w-full px-3 py-2.5 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Address</label>
            <input
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="Street address"
              className="w-full px-3 py-2.5 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Total spots</label>
              <input
                type="number"
                min="1"
                value={form.total_spots}
                onChange={(e) => set("total_spots", e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Price / hour (₹)</label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={form.price_per_hour}
                onChange={(e) => set("price_per_hour", e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Amenities (comma separated)</label>
            <input
              value={form.amenities}
              onChange={(e) => set("amenities", e.target.value)}
              placeholder="Covered, EV charging, 24/7 security"
              className="w-full px-3 py-2.5 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              placeholder="Tell drivers about your lot…"
              className="w-full px-3 py-2.5 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/15 border border-red-100 dark:border-red-500/20 rounded-lg p-3">{error}</div>
          )}
        </div>

        <div className="p-5 border-t border-border sticky bottom-0 bg-card safe-bottom">
          <button
            onClick={submit}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-heading font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            {loading ? "Publishing…" : "Publish lot"}
          </button>
        </div>
      </div>
    </div>
  );
}