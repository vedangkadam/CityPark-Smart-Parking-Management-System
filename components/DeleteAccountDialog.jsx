const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";
import { X, AlertTriangle, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function DeleteAccountDialog({ onClose }) {
  const { user, logout } = useAuth();
  const [step, setStep] = useState(1);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const finalConfirm = async () => {
    setLoading(true);
    try {
      await db.entities.Booking.deleteMany({ created_by_id: user.id });
      await db.entities.ParkingLot.deleteMany({ created_by_id: user.id });
    } catch (e) {
      // best-effort cleanup
    } finally {
      setLoading(false);
      logout();
    }
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-sm p-5 shadow-xl safe-bottom">
        {step === 1 ? (
          <>
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-[#F8F9FA] flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <h2 className="font-heading font-extrabold text-lg text-[#0F172A] mt-3">Delete account?</h2>
            <p className="text-sm text-[#64748B] mt-1.5 leading-relaxed">
              This will permanently remove your parking lots and booking history. This action cannot be undone.
            </p>
            <div className="flex gap-2 mt-5">
              <button onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold rounded-lg border border-[#E9ECEF] text-[#0F172A] hover:bg-[#F8F9FA]">
                Cancel
              </button>
              <button onClick={() => setStep(2)} className="flex-1 py-2.5 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700">
                Continue
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-[#F8F9FA] flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <h2 className="font-heading font-extrabold text-lg text-[#0F172A] mt-3">Final confirmation</h2>
            <p className="text-sm text-[#64748B] mt-1.5">
              Type <span className="font-semibold text-[#0F172A]">DELETE</span> to permanently erase your account data.
            </p>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full mt-3 px-3 py-2.5 text-sm bg-[#F8F9FA] border border-[#E9ECEF] rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
            <div className="flex gap-2 mt-4">
              <button onClick={() => setStep(1)} className="flex-1 py-2.5 text-sm font-semibold rounded-lg border border-[#E9ECEF] text-[#0F172A] hover:bg-[#F8F9FA]">
                Back
              </button>
              <button
                onClick={finalConfirm}
                disabled={confirmText !== "DELETE" || loading}
                className="flex-1 py-2.5 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-40"
              >
                {loading ? "Deleting…" : "Delete forever"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}