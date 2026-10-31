import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Car, Ticket, Building2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const tabs = [
  { to: "/", label: "Driver", icon: Car, match: (p) => p === "/" },
  { to: "/bookings", label: "Bookings", icon: Ticket, match: (p) => p.startsWith("/bookings") },
  { to: "/owner", label: "Owner", icon: Building2, match: (p) => p.startsWith("/owner"), adminOnly: true },
];

export default function MobileTabBar() {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const visibleTabs = tabs.filter((t) => !t.adminOnly || isAdmin);
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-[1000] bg-card/95 backdrop-blur-md border-t border-border safe-bottom">
      <div className="flex items-stretch justify-around h-16">
        {visibleTabs.map(({ to, label, icon: Icon, match }) => {
          const active = match(location.pathname);
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}