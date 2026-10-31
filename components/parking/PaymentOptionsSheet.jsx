const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ChevronRight, ChevronDown, QrCode, User, Check,
  Smartphone, CreditCard, Wallet, Sparkles, ShieldCheck,
} from "lucide-react";

import { useDismissOnBack } from "@/hooks/useDismissOnBack";
import { formatDateLabel, formatTimeRange } from "@/lib/parking";

const UPI_APPS = [
  { id: "gpay", name: "Google Pay", color: "#4285F4", letter: "G" },
  { id: "phonepe", name: "PhonePe", color: "#5F259F", letter: "P" },
  { id: "paytm", name: "Paytm", color: "#00BAF2", letter: "P" },
  { id: "bhim", name: "BHIM UPI", color: "#0F4C81", letter: "B" },
];

const BRAND_BADGES = [
  { c: "#4285F4", l: "G" },
  { c: "#5F259F", l: "P" },
  { c: "#00BAF2", l: "P" },
];

export default function PaymentOptionsSheet({ lot, startTime, endDate, duration, total, onClose }) {
  const dismiss = useDismissOnBack(onClose, "paymentSheet");
  const navigate = useNavigate();
  const [method, setMethod] = useState("gpay");
  const [stage, setStage] = useState("select"); // select | verify
  const [showDetails, setShowDetails] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const upiId = "vedang.kadam.sa@oksbi";
  const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=CityPark&am=${total}&cu=INR&tn=${encodeURIComponent("Parking " + lot.name)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiLink)}`;

  const isUpi = UPI_APPS.some((a) => a.id === method);

  const confirmBooking = async () => {
    setProcessing(true);
    setError(null);
    try {
      const res = await db.functions.invoke("confirmUpiBooking", {
        lotId: lot.id,
        lotName: lot.name,
        lotAddress: lot.address,
        startTime: new Date(startTime).toISOString(),
        endTime: endDate instanceof Date ? endDate.toISOString() : new Date(endDate).toISOString(),
        durationHours: duration,
        totalPrice: parseFloat(total),
        spotNumber: 1,
        method,
      });
      if (res.data?.booking) {
        navigate("/booking-success");
      } else {
        setError(res.data?.error || "Failed to confirm booking");
        setProcessing(false);
      }
    } catch (e) {
      setError(e.message || "Booking failed");
      setProcessing(false);
    }
  };

  const handleContinue = () => {
    setError(null);
    if (method === "qr") {
      setStage("verify");
      return;
    }
    if (isUpi) {
      try { window.location.href = upiLink; } catch (e) {}
      setStage("verify");
      return;
    }
    confirmBooking();
  };

  const endIso = endDate instanceof Date ? endDate : new Date(endDate);

  return (
    <div className="fixed inset-0 z-[1150] bg-background flex flex-col">
      {/* Header */}
      <div className="bg-[#00BFA5] text-white safe-top flex-shrink-0">
        <div className="flex items-center justify-between h-14 px-2">
          <button onClick={dismiss} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/15">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-white text-[#00BFA5] flex items-center justify-center font-heading font-extrabold">C</div>
            <span className="font-heading font-bold text-base">CityPark</span>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/15">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 max-w-md w-full mx-auto">
        <h1 className="font-heading font-extrabold text-xl text-foreground">Payment Options</h1>

        <div className="inline-flex items-center gap-1.5 bg-[#E0F7F4] text-[#00796B] text-xs font-semibold px-3 py-2 rounded-full">
          <Sparkles className="w-3.5 h-3.5" /> Upto 1.5% savings with CityPark UPI txn
        </div>

        {/* Recommended */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">Recommended</p>
          <button
            onClick={() => setMethod("gpay")}
            className={`w-full flex items-center gap-3 bg-card rounded-xl p-3.5 border transition ${
              method === "gpay" ? "border-[#00BFA5] ring-1 ring-[#00BFA5]" : "border-border"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[#4285F4] text-white flex items-center justify-center font-bold text-lg">G</div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-foreground">UPI - Google Pay</p>
              <p className="text-xs text-muted-foreground">Pay using Google Pay</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* All Payment Options */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">All Payment Options</p>
          <div className="bg-card rounded-xl border border-border divide-y divide-border overflow-hidden">
            {/* UPI (expanded) */}
            <div className="p-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-[#00BFA5]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">UPI</p>
                  <div className="flex items-center gap-1 mt-1">
                    {BRAND_BADGES.map((b, i) => (
                      <span key={i} className="w-4 h-4 rounded-full text-white text-[8px] flex items-center justify-center font-bold" style={{ background: b.c }}>{b.l}</span>
                    ))}
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-[#00796B] bg-[#E0F7F4] px-2 py-1 rounded-full whitespace-nowrap">1.5% savings</span>
              </div>
              <div className="mt-2 space-y-1">
                {UPI_APPS.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => setMethod(app.id)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition ${method === app.id ? "bg-[#E0F7F4]" : "hover:bg-muted"}`}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: app.color }}>{app.letter}</div>
                    <span className="flex-1 text-left text-sm font-medium text-foreground">{app.name}</span>
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === app.id ? "border-[#00BFA5] bg-[#00BFA5]" : "border-muted-foreground"}`}>
                      {method === app.id && <Check className="w-3 h-3 text-white" />}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* QR */}
            <button
              onClick={() => setMethod("qr")}
              className={`w-full flex items-center gap-3 p-3.5 transition ${method === "qr" ? "bg-[#E0F7F4]" : ""}`}
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <QrCode className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-foreground">Scan QR & Pay</p>
                <p className="text-xs text-muted-foreground">Use any UPI app to scan</p>
              </div>
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === "qr" ? "border-[#00BFA5] bg-[#00BFA5]" : "border-muted-foreground"}`}>
                {method === "qr" && <Check className="w-3 h-3 text-white" />}
              </span>
            </button>

            {/* Cards (disabled) */}
            <div className="flex items-center gap-3 p-3.5 opacity-50">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Cards</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[9px] font-bold text-[#1A1F71] bg-muted px-1.5 py-0.5 rounded">VISA</span>
                  <span className="text-[9px] font-bold text-[#EB001B] bg-muted px-1.5 py-0.5 rounded">MC</span>
                  <span className="text-[9px] font-bold text-[#09337C] bg-muted px-1.5 py-0.5 rounded">RuPay</span>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-1 rounded">Coming soon</span>
            </div>

            {/* Wallet (disabled) */}
            <div className="flex items-center gap-3 p-3.5 opacity-50">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Wallet className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Wallet</p>
                <p className="text-xs text-muted-foreground">Paytm, Mobikwik, etc.</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground pb-2">
          <ShieldCheck className="w-4 h-4 text-[#00BFA5]" />
          Pay via UPI / QR · Free cancellation up to 30 min before
        </div>
      </div>

      {/* Verify / QR stage */}
      {stage === "verify" && (
        <div className="absolute inset-0 z-[1160] bg-black/50 flex items-end md:items-center justify-center p-4">
          <div className="bg-card rounded-2xl w-full max-w-sm p-6 text-center safe-bottom">
            {method === "qr" ? (
              <>
                <h3 className="font-heading font-extrabold text-lg text-foreground">Scan to Pay ₹{total}</h3>
                <p className="text-xs text-muted-foreground mt-1">Open any UPI app and scan this QR</p>
                <div className="my-4 inline-block p-3 bg-white rounded-xl border border-border">
                  <img src={qrUrl} alt="UPI QR" className="w-56 h-56" />
                </div>
                <p className="text-[11px] text-muted-foreground mb-3 break-all">{upiId}</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-[#E0F7F4] flex items-center justify-center mx-auto">
                  <Smartphone className="w-6 h-6 text-[#00BFA5]" />
                </div>
                <h3 className="font-heading font-extrabold text-lg text-foreground mt-3">Complete your payment</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  We've opened your UPI app. Pay <span className="font-semibold text-foreground">₹{total}</span>, then confirm below.
                </p>
                <button
                  onClick={() => { try { window.location.href = upiLink; } catch (e) {} }}
                  className="mt-4 text-sm font-semibold text-[#00BFA5]"
                >
                  Reopen UPI app
                </button>
              </>
            )}
            {error && <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/15 rounded-lg p-2.5 mt-3">{error}</div>}
            <button
              onClick={confirmBooking}
              disabled={processing}
              className="w-full mt-4 bg-black dark:bg-primary text-white font-bold py-3.5 rounded-xl disabled:opacity-50"
            >
              {processing ? "Confirming…" : "I've Paid — Confirm Booking"}
            </button>
            <button onClick={() => setStage("select")} className="w-full mt-2 text-sm font-semibold text-muted-foreground py-2">
              Back
            </button>
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div className="bg-card border-t border-border safe-bottom flex-shrink-0">
        <div className="max-w-md mx-auto flex items-center gap-3 p-3">
          <button onClick={() => setShowDetails((v) => !v)} className="flex-1 text-left">
            <p className="font-heading font-extrabold text-lg text-foreground">₹{total}</p>
            <p className="text-xs text-[#00BFA5] font-semibold flex items-center gap-1">
              View Details <ChevronDown className={`w-3 h-3 transition ${showDetails ? "rotate-180" : ""}`} />
            </p>
          </button>
          <button
            onClick={handleContinue}
            disabled={processing}
            className="bg-black dark:bg-primary text-white font-bold px-8 py-3.5 rounded-xl disabled:opacity-50"
          >
            {processing ? "Confirming…" : "Continue"}
          </button>
        </div>
        {showDetails && (
          <div className="max-w-md mx-auto px-3 pb-3 text-xs text-muted-foreground space-y-1.5 border-t border-border pt-2">
            <div className="flex justify-between"><span>{lot.name}</span><span className="text-foreground font-medium">{lot.address}</span></div>
            <div className="flex justify-between"><span>Duration</span><span className="text-foreground font-medium">{duration} hr</span></div>
            <div className="flex justify-between"><span>When</span><span className="text-foreground font-medium">{formatDateLabel(startTime)} · {formatTimeRange(startTime, endIso)}</span></div>
            <div className="flex justify-between"><span>Rate</span><span className="text-foreground font-medium">₹{lot.price_per_hour}/hr</span></div>
            <div className="flex justify-between pt-1 border-t border-border"><span className="font-semibold text-foreground">Total</span><span className="font-heading font-extrabold text-foreground">₹{total}</span></div>
          </div>
        )}
      </div>
    </div>
  );
}