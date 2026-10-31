import React from "react";
import { Link } from "react-router-dom";
import { CreditCard, Ticket, ShieldCheck } from "lucide-react";

export default function PaymentSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-extrabold text-xl text-foreground">Payment</h2>
        <p className="text-sm text-muted-foreground mt-1">Your payment methods and billing</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <CreditCard className="w-4 h-4 text-primary" /> Saved methods
        </div>
        <div className="flex items-center justify-center py-8 text-center">
          <div>
            <CreditCard className="w-10 h-10 text-muted-foreground/40 mx-auto" />
            <p className="text-sm text-muted-foreground mt-2">No saved payment methods</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Payments are processed securely via Stripe at checkout
            </p>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground">Test mode</p>
          <p className="text-xs text-muted-foreground mt-1">
            Use card 4242 4242 4242 4242 for testing. Real payments need live Stripe keys.
          </p>
        </div>
      </div>

      <Link
        to="/bookings"
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        <Ticket className="w-4 h-4" /> View your bookings
      </Link>
    </div>
  );
}