import React from "react";
import { MapPin, Circle } from "lucide-react";
import { formatDistance } from "@/lib/parking";

export default function ParkingLotCard({ lot, distance, selected, onSelect }) {
  const low = lot.available_spots <= 2;
  return (
    <button
      onClick={() => onSelect(lot)}
      className={`group w-full text-left bg-card rounded-xl border p-3 transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40 ${
        selected
          ? "border-primary ring-1 ring-primary shadow-md shadow-primary/15 bg-gradient-to-br from-primary/5 via-transparent to-[#8B5CF6]/10"
          : "border-border"
      }`}
    >
      <div className="flex gap-3">
        <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 overflow-hidden flex items-center justify-center ring-1 ring-border group-hover:ring-primary/30 transition-all">
          {lot.image_url ? (
            <img src={lot.image_url} alt={lot.name} className="w-full h-full object-cover" />
          ) : (
            <MapPin className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading font-bold text-foreground text-sm truncate">{lot.name}</h3>
            <span className="font-heading font-extrabold text-foreground text-sm whitespace-nowrap">
              ₹{lot.price_per_hour}
              <span className="font-medium text-muted-foreground text-xs">/hr</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{lot.address}</p>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                low
                  ? "bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400"
                  : "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              }`}
            >
              <Circle className="w-1.5 h-1.5 fill-current" /> {lot.available_spots} left
            </span>
            {distance != null && (
              <span className="text-xs text-muted-foreground">{formatDistance(distance)}</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}