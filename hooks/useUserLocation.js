import { useState, useCallback } from "react";

const STORAGE_KEY = "cp_user_location";

function readStored() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Manages browser geolocation permission and persists the last known
 * coordinates so the map can center on the user and sort nearby lots.
 * status: "idle" | "requesting" | "granted" | "denied" | "unavailable"
 */
export function useUserLocation() {
  const [location, setLocation] = useState(readStored);
  const [status, setStatus] = useState(() => (readStored() ? "granted" : "idle"));

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("unavailable");
      return Promise.resolve(null);
    }
    setStatus("requesting");
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            ts: Date.now(),
          };
          setLocation(loc);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
          } catch {}
          setStatus("granted");
          resolve(loc);
        },
        () => {
          setStatus("denied");
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    });
  }, []);

  return { location, status, request };
}