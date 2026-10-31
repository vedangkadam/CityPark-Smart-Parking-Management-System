import React from "react";
import { Star } from "lucide-react";

export default function StarRating({ value = 0, onChange, size = 16, readOnly = false }) {
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(n)}
          className={readOnly ? "cursor-default" : "hover:scale-110 transition"}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <Star
            style={{ width: size, height: size }}
            className={n <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}
          />
        </button>
      ))}
    </div>
  );
}