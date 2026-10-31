import React, { useState, useEffect } from "react";
import { Fingerprint, AlertTriangle } from "lucide-react";
import { useBiometric } from "@/hooks/useBiometric";

export default function BiometricGate({ onUnlock, onDisable }) {
  const { verify, disable } = useBiometric();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const unlock = async () => {
    setBusy(true);
    setError("");
    try {
      await verify();
      onUnlock();
    } catch {
      setError("Verification failed. Try again.");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    unlock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-[1300] bg-background flex flex-col items-center justify-center p-6">
      <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
        <Fingerprint className={`w-10 h-10 text-primary ${busy ? "animate-pulse" : ""}`} />
      </div>
      <h2 className="font-heading font-extrabold text-xl text-foreground">
        Biometric lock
      </h2>
      <p className="text-sm text-muted-foreground mt-2 text-center max-w-xs">
        Verify your identity to unlock CityPark
      </p>
      {error && (
        <p className="text-xs text-red-600 mt-4 flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
      <button
        onClick={unlock}
        disabled={busy}
        className="mt-6 inline-flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition"
      >
        <Fingerprint className="w-4 h-4" />
        {busy ? "Verifying…" : "Use fingerprint"}
      </button>
      <button
        onClick={() => {
          disable();
          onDisable();
        }}
        className="mt-4 text-xs text-muted-foreground hover:text-foreground transition"
      >
        Turn off biometric lock
      </button>
    </div>
  );
}