const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";
import { useAuth } from "@/lib/AuthContext";

import { useTheme } from "@/lib/ThemeContext";
import { User, Moon, Sun, Check } from "lucide-react";

export default function SettingsSection() {
  const { user } = useAuth();
  const { isDark, toggle } = useTheme();
  const [name, setName] = useState(user?.full_name || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await db.auth.updateMe({ full_name: name });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-extrabold text-xl text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your profile and preferences</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <User className="w-4 h-4 text-primary" /> Profile
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Full name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Email</label>
          <input
            value={user?.email || ""}
            disabled
            className="w-full px-3 py-2.5 text-sm bg-muted border border-border rounded-lg text-muted-foreground"
          />
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" /> Saved
            </>
          ) : saving ? (
            "Saving…"
          ) : (
            "Save changes"
          )}
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
              {isDark ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-primary" />}
              Appearance
            </p>
            <p className="text-xs text-muted-foreground mt-1">Toggle between light and dark mode</p>
          </div>
          <button
            onClick={toggle}
            className="inline-flex items-center gap-2 text-sm font-semibold px-3.5 py-2 rounded-lg border border-border hover:bg-muted transition"
          >
            {isDark ? "Light" : "Dark"}
          </button>
        </div>
      </div>
    </div>
  );
}