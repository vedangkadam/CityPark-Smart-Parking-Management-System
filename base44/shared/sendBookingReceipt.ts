const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

function fmt(d) {
  try {
    return new Date(d).toLocaleString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return String(d);
  }
}

export async function sendBookingReceipt(base44, booking, userEmail) {
  if (!userEmail || !booking) return;
  const rows = [
    ["Lot", booking.lot_name || "—"],
    ["Address", booking.lot_address || "—"],
    ["Spot", `#${booking.spot_number || 1}`],
    ["Start", fmt(booking.start_time)],
    ["End", fmt(booking.end_time)],
    ["Duration", `${booking.duration_hours} hour(s)`],
    ["Amount paid", `₹${Number(booking.total_price).toFixed(2)}`],
    ["Payment ref", booking.payment_id || "—"],
    ["Booking ID", booking.id],
  ];
  const html = `<!DOCTYPE html><html><body style="font-family:Inter,Arial,sans-serif;background:#f4f6fb;margin:0;padding:0;">
  <div style="max-width:520px;margin:24px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e6e8ef;">
    <div style="background:linear-gradient(135deg,#4F46E5,#6366F1);padding:24px;">
      <h1 style="color:#fff;margin:0;font-size:20px;">CityPark — Booking Confirmed</h1>
      <p style="color:#e0e3ff;margin:6px 0 0;font-size:13px;">Your parking spot is reserved. Show this receipt at the lot.</p>
    </div>
    <div style="padding:20px 24px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:9px 0;color:#6b7280;border-bottom:1px solid #f0f1f5;">${k}</td><td style="padding:9px 0;color:#111827;font-weight:600;text-align:right;border-bottom:1px solid #f0f1f5;">${v}</td></tr>`
          )
          .join("")}
      </table>
      <p style="margin-top:18px;font-size:12px;color:#9ca3af;">Free cancellation up to 30 min before start time. Need help? Reply to this email.</p>
    </div>
  </div></body></html>`;

  await db.asServiceRole.integrations.Core.SendEmail({
    to: userEmail,
    subject: `CityPark booking confirmed — ${booking.lot_name || "your spot"}`,
    html,
  });
}