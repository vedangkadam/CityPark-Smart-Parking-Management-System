const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

import { Ticket, LogOut, Trash2, Sun, Moon, LayoutDashboard } from "lucide-react";
import { Image } from "@/components/ui/image";
import DeleteAccountDialog from "@/components/DeleteAccountDialog";
import { useTheme } from "@/lib/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCount, setActiveCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const isOwner = location.pathname.startsWith("/owner");
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    let mounted = true;
    db.entities.Booking.list("-created_date", 50)
      .then((bookings) => {
        if (!mounted) return;
        const active = bookings.filter(
          (b) => b.status === "confirmed" && new Date(b.end_time).getTime() > Date.now()
        );
        setActiveCount(active.length);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [location.pathname]);

  const initial = (user?.full_name || user?.email || "U")[0]?.toUpperCase();

  return (
    <header className="sticky top-0 z-[1000] bg-white/85 dark:bg-[#0F172A]/85 backdrop-blur-md border-b border-[#E9ECEF] dark:border-white/10 safe-top">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <Image
            src="https://media.db.com/images/public/6ab66ad1ce89ca33ff6eda00/17ce08a44_image.png"
            alt="CityPark"
            fittingType="fit"
            className="w-9 h-9 rounded-xl"
          />
          <span className="font-heading font-extrabold text-xl text-[#0F172A] dark:text-white tracking-tight">
            CityPark
          </span>
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          {isAdmin && (
            <div className="hidden sm:flex items-center bg-[#F8F9FA] dark:bg-white/5 rounded-full p-1 border border-[#E9ECEF] dark:border-white/10">
              <button
                onClick={() => navigate("/")}
                className={`px-3.5 py-1.5 text-sm font-semibold rounded-full transition-all ${
                  !isOwner ? "bg-white dark:bg-white/10 text-[#0F172A] dark:text-white shadow-sm" : "text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white"
                }`}
              >
                Driver
              </button>
              <button
                onClick={() => navigate("/owner")}
                className={`px-3.5 py-1.5 text-sm font-semibold rounded-full transition-all ${
                  isOwner ? "bg-white dark:bg-white/10 text-[#0F172A] dark:text-white shadow-sm" : "text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white"
                }`}
              >
                Owner
              </button>
            </div>
          )}

          <button
            onClick={() => navigate("/bookings")}
            className="relative hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#0F172A] dark:text-white hover:bg-[#F8F9FA] dark:hover:bg-white/10 rounded-lg transition-colors"
          >
            <Ticket className="w-4 h-4" />
            <span className="hidden sm:inline">Bookings</span>
            {activeCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#4F46E5] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>

          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#0F172A] dark:text-white hover:bg-[#F8F9FA] dark:hover:bg-white/10 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-9 h-9 rounded-full bg-[#4F46E5] flex items-center justify-center text-white text-sm font-semibold hover:opacity-90 transition"
            >
              {initial}
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0F172A] rounded-xl border border-[#E9ECEF] dark:border-white/10 shadow-lg py-1 z-20">
                  <div className="px-4 py-2.5 border-b border-[#E9ECEF] dark:border-white/10">
                    <p className="text-sm font-semibold text-[#0F172A] dark:text-white truncate">
                      {user?.full_name || "Account"}
                    </p>
                    <p className="text-xs text-[#64748B] dark:text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/dashboard");
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#0F172A] dark:text-white hover:bg-[#F8F9FA] dark:hover:bg-white/10 flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/bookings");
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#0F172A] dark:text-white hover:bg-[#F8F9FA] dark:hover:bg-white/10 flex items-center gap-2"
                  >
                    <Ticket className="w-4 h-4" /> My Bookings
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setShowDelete(true);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete account
                  </button>
                  <button
                    onClick={() => logout()}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#0F172A] dark:text-white hover:bg-[#F8F9FA] dark:hover:bg-white/10 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {showDelete && <DeleteAccountDialog onClose={() => setShowDelete(false)} />}
    </header>
  );
}