const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';
import { secrets } from 'base44:runtime';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await db.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { lotId, lotName, lotAddress, startTime, endTime, durationHours, totalPrice, spotNumber } = body;

    if (!lotId || !totalPrice || !durationHours || !startTime || !endTime) {
      return Response.json({ error: 'Missing required booking fields' }, { status: 400 });
    }

    const stripeKey = secrets.get('STRIPE_SECRET_KEY');
    if (!stripeKey) return Response.json({ error: 'Stripe not configured' }, { status: 500 });

    const amount = Math.round(Number(totalPrice) * 100);

    const params = new URLSearchParams();
    params.append('mode', 'payment');
    params.append('payment_method_types[0]', 'card');
    params.append('line_items[0][quantity]', '1');
    params.append('line_items[0][price_data][currency]', 'inr');
    params.append('line_items[0][price_data][product_data][name]', `Parking: ${lotName}`);
    params.append('line_items[0][price_data][product_data][description]', `${durationHours} hour(s) at ${lotName}`);
    params.append('line_items[0][price_data][unit_amount]', String(amount));
    params.append('metadata[base44_app_id]', secrets.get('BASE44_APP_ID') || '');
    params.append('metadata[lot_id]', lotId);
    params.append('metadata[lot_name]', lotName);
    params.append('metadata[lot_address]', lotAddress || '');
    params.append('metadata[start_time]', startTime);
    params.append('metadata[end_time]', endTime);
    params.append('metadata[duration_hours]', String(durationHours));
    params.append('metadata[total_price]', String(totalPrice));
    params.append('metadata[spot_number]', String(spotNumber || 1));
    params.append('metadata[user_id]', user.id);
    params.append('metadata[user_email]', user.email || '');

    const origin = new URL(req.url).origin;
    params.append('success_url', `${origin}/booking-success?session_id={CHECKOUT_SESSION_ID}`);
    params.append('cancel_url', `${origin}/`);

    const resp = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Stripe-Version': '2025-10-29.clover',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Idempotency-Key': crypto.randomUUID()
      },
      body: params
    });

    const data = await resp.json();
    if (!resp.ok) {
      console.error('Stripe checkout error:', data);
      return Response.json({ error: data.error?.message || 'Stripe error' }, { status: 400 });
    }

    return Response.json({ url: data.url, sessionId: data.id });
  } catch (error) {
    console.error('createCheckout error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}