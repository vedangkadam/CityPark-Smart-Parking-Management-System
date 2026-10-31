const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { CheckCircle2, Calendar, Clock, MapPin, Loader2 } from "lucide-react";
import { formatDateLabel, formatTimeRange } from "@/lib/parking";

export default function BookingSuccess() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (!sessionId) {
      setError("Missing payment session.");
      setLoading(false);
      return;
    }
    db.functions
      .invoke("verifyPayment", { sessionId })
      .then((res) => {
        if (res.data?.booking) {
          setBooking(res.data.booking);
        } else {
          setError(res.data?.error || "Could not verify payment");
        }
      })
      .catch((e) => setError(e.message || "Verification failed"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground mt-3">Confirming your reservation…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9 text-emerald-500" />
          </div>
          <h1 className="font-heading font-extrabold text-xl text-foreground mt-4">Payment Received</h1>
          <p className="text-sm text-muted-foreground mt-2">Your payment was processed successfully.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition"
          >
            Back to map
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
      <div className="max-w-md w-full">
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-[#4F46E5] to-[#6366F1] p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9 text-white" />
            </div>
            <h1 className="font-heading font-extrabold text-2xl text-white mt-4">Spot reserved!</h1>
            <p className="text-white/80 text-sm mt-1">Your parking is guaranteed</p>
          </div>
          <div className="p-6">
            <div className="text-center mb-5">
              <div className="inline-block bg-white rounded-xl p-3 border border-border">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(booking?.id || "")}`}
                  alt="Pass QR"
                  className="w-32 h-32"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Show this at the lot entrance</p>
            </div>
            {booking && (
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <MapPin className="w-4 h-4 text-primary" /> {booking.lot_name}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" /> {formatDateLabel(booking.start_time)}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" /> {formatTimeRange(booking.start_time, booking.end_time)}
                </div>
                <div className="flex justify-between pt-3 border-t border-border">
                  <span className="text-muted-foreground">Spot #{booking.spot_number}</span>
                  <span className="font-heading font-extrabold text-foreground text-lg">₹{booking.total_price}</span>
                </div>
              </div>
            )}
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => navigate("/bookings")}
                className="flex-1 bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-2.5 rounded-lg transition"
              >
                View my bookings
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 bg-muted hover:bg-muted-foreground/20 text-foreground text-sm font-semibold py-2.5 rounded-lg transition"
              >
                Find more spots
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}