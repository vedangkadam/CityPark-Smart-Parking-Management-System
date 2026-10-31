const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';
import { secrets } from 'base44:runtime';
import { sendBookingReceipt } from '../../shared/sendBookingReceipt.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await db.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { sessionId } = body;
    if (!sessionId) return Response.json({ error: 'Missing session id' }, { status: 400 });

    const stripeKey = secrets.get('STRIPE_SECRET_KEY');
    if (!stripeKey) return Response.json({ error: 'Stripe not configured' }, { status: 500 });

    const resp = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Stripe-Version': '2025-10-29.clover'
      }
    });
    const session = await resp.json();
    if (!resp.ok) {
      console.error('Stripe retrieve error:', session);
      return Response.json({ error: session.error?.message || 'Stripe error' }, { status: 400 });
    }

    if (session.payment_status !== 'paid') {
      return Response.json({ error: 'Payment not completed', status: session.payment_status }, { status: 400 });
    }

    // Avoid duplicate bookings for the same session
    const existing = await db.entities.Booking.filter({ payment_id: session.id });
    if (existing.length > 0) {
      return Response.json({ booking: existing[0], alreadyExists: true });
    }

    const m = session.metadata || {};
    const booking = await db.entities.Booking.create({
      lot_id: m.lot_id,
      lot_name: m.lot_name,
      lot_address: m.lot_address,
      start_time: m.start_time,
      end_time: m.end_time,
      duration_hours: parseFloat(m.duration_hours),
      total_price: parseFloat(m.total_price),
      status: 'confirmed',
      spot_number: parseInt(m.spot_number) || 1,
      payment_id: session.id
    });

    // Decrement available spots on the lot (non-critical)
    try {
      const lot = await db.entities.ParkingLot.get(m.lot_id);
      if (lot && lot.available_spots > 0) {
        await db.entities.ParkingLot.update(m.lot_id, { available_spots: lot.available_spots - 1 });
      }
    } catch (e) {
      console.error('Spot decrement failed:', e);
    }

    // Email booking receipt (non-critical)
    try {
      await sendBookingReceipt(base44, booking, user.email);
    } catch (e) {
      console.error('Receipt email failed:', e);
    }

    return Response.json({ booking });
  } catch (error) {
    console.error('verifyPayment error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}