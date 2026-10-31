import React, { useState } from "react";
import { LayoutDashboard, Settings as SettingsIcon, CreditCard, ShieldCheck } from "lucide-react";
import SettingsSection from "@/components/dashboard/SettingsSection";
import PaymentSection from "@/components/dashboard/PaymentSection";
import SecuritySection from "@/components/dashboard/SecuritySection";

const SECTIONS = [
  { id: "settings", label: "Settings", icon: SettingsIcon, Comp: SettingsSection },
  { id: "payment", label: "Payment", icon: CreditCard, Comp: PaymentSection },
  { id: "security", label: "Security", icon: ShieldCheck, Comp: SecuritySection },
];

export default function Dashboard() {
  const [active, setActive] = useState("settings");
  const Active = SECTIONS.find((s) => s.id === active).Comp;

  return (
    <div className="flex flex-col md:flex-row md:h-[calc(100vh-4rem)] flex-1">
      <aside className="md:w-64 md:flex-shrink-0 border-b md:border-b-0 md:border-r border-border bg-background p-4">
        <div className="flex items-center gap-2 mb-4">
          <LayoutDashboard className="w-5 h-5 text-primary" />
          <h1 className="font-heading font-extrabold text-lg text-foreground">Dashboard</h1>
        </div>
        <nav className="flex md:flex-col gap-1 overflow-x-auto no-scrollbar">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            const on = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition ${
                  on
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" /> {s.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Active />
        </div>
      </div>
    </div>
  );
}