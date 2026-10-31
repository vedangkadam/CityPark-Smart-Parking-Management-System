import React from "react";
import { Navigation, X, ShieldCheck, MapPin } from "lucide-react";

export default function LocationPrompt({ onAllow, onDismiss, requesting }) {
  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onDismiss} />
      <div className="relative bg-card w-full max-w-sm rounded-2xl p-6 shadow-xl border border-border">
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <Navigation className="w-7 h-7 text-primary" />
        </div>

        <h2 className="font-heading font-extrabold text-xl text-foreground text-center mt-4">
          Find spots near you
        </h2>
        <p className="text-sm text-muted-foreground text-center mt-2 leading-relaxed">
          Let CityPark use your location to center the map on you and sort parking spots by distance, so you can navigate faster.
        </p>

        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-4">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Only used to show nearby spots — never shared</span>
        </div>

        <button
          onClick={onAllow}
          disabled={requesting}
          className="w-full mt-5 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-heading font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition"
        >
          <MapPin className="w-4 h-4" />
          {requesting ? "Locating…" : "Allow location"}
        </button>
        <button
          onClick={onDismiss}
          className="w-full mt-2 text-sm font-medium text-muted-foreground hover:text-foreground py-2.5 transition"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}