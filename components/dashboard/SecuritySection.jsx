import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { useBiometric } from "@/hooks/useBiometric";
import DeleteAccountDialog from "@/components/DeleteAccountDialog";
import { Fingerprint, Lock, LogOut, Trash2, ShieldCheck, AlertTriangle } from "lucide-react";

export default function SecuritySection() {
  const { logout } = useAuth();
  const { supported, enabled, register, disable } = useBiometric();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  const toggle = async () => {
    setError("");
    if (enabled) {
      disable();
      return;
    }
    setBusy(true);
    try {
      await register();
    } catch {
      setError("Biometric setup failed. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-extrabold text-xl text-foreground">Security</h2>
        <p className="text-sm text-muted-foreground mt-1">Protect your account with extra verification</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Fingerprint className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Fingerprint / Face unlock</p>
              <p className="text-xs text-muted-foreground mt-1">
                {supported
                  ? "Require biometric verification when opening the app for double security"
                  : "Biometric authentication isn't available on this device"}
              </p>
            </div>
          </div>
          <button
            onClick={toggle}
            disabled={!supported || busy}
            className={`relative w-12 h-7 rounded-full transition flex-shrink-0 disabled:opacity-40 ${
              enabled ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all ${
                enabled ? "left-[22px]" : "left-0.5"
              }`}
            />
          </button>
        </div>
        {error && (
          <p className="text-xs text-red-600 mt-3 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}
        {enabled && (
          <p className="text-xs text-emerald-600 mt-3 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Biometric lock is active
          </p>
        )}
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 space-y-1">
        <Link
          to="/forgot-password"
          className="flex items-center justify-between text-sm font-semibold text-foreground hover:bg-muted rounded-lg p-2 -m-2 transition"
        >
          <span className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" /> Change password
          </span>
        </Link>
        <button
          onClick={() => logout()}
          className="w-full flex items-center justify-between text-sm font-semibold text-foreground hover:bg-muted rounded-lg p-2 -m-2 transition"
        >
          <span className="flex items-center gap-2">
            <LogOut className="w-4 h-4 text-primary" /> Sign out
          </span>
        </button>
        <button
          onClick={() => setShowDelete(true)}
          className="w-full flex items-center justify-between text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg p-2 -m-2 transition"
        >
          <span className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Delete account
          </span>
        </button>
      </div>

      {showDelete && <DeleteAccountDialog onClose={() => setShowDelete(false)} />}
    </div>
  );
}