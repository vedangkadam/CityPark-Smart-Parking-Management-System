import React from "react";

const ORBS = [
  "absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary/20 blur-3xl animate-drift",
  "absolute top-1/3 -right-24 w-72 h-72 rounded-full bg-[#8B5CF6]/20 blur-3xl animate-float-slow",
  "absolute -bottom-28 left-1/4 w-80 h-80 rounded-full bg-[#06B6D4]/15 blur-3xl animate-float-slower",
];

const DOTS_MASK = "radial-gradient(ellipse at 50% 0%, black 5%, transparent 70%)";

export default function AmbientGlow({ className = "", dots = false }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {ORBS.map((orb) => (
        <div key={orb} className={orb} />
      ))}
      {dots && (
        <div
          className="cp-dot-grid absolute inset-0 text-foreground/5"
          style={{ WebkitMaskImage: DOTS_MASK, maskImage: DOTS_MASK }}
        />
      )}
    </div>
  );
}