const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';
import { sendBookingReceipt } from '../../shared/sendBookingReceipt.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await db.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { lotId, lotName, lotAddress, startTime, endTime, durationHours, totalPrice, spotNumber, method } = body;

    if (!lotId || !totalPrice || !durationHours || !startTime || !endTime) {
      return Response.json({ error: 'Missing required booking fields' }, { status: 400 });
    }

    const paymentId = `upi_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const booking = await db.entities.Booking.create({
      lot_id: lotId,
      lot_name: lotName,
      lot_address: lotAddress || '',
      start_time: startTime,
      end_time: endTime,
      duration_hours: Number(durationHours),
      total_price: Number(totalPrice),
      status: 'confirmed',
      spot_number: Number(spotNumber) || 1,
      payment_id: paymentId
    });

    // Decrement available spots — lot is owned by an admin, so use service role
    try {
      const lot = await db.asServiceRole.entities.ParkingLot.get(lotId);
      if (lot && lot.available_spots > 0) {
        await db.asServiceRole.entities.ParkingLot.update(lotId, { available_spots: lot.available_spots - 1 });
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
    console.error('confirmUpiBooking error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}