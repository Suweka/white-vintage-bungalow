const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
const FROM     = 'White Vintage Bungalow <onboarding@resend.dev>';

async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[EMAIL not sent — add RESEND_API_KEY to .env]\nTo: ${to}\nSubject: ${subject}`);
    return;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });
  if (!res.ok) console.error('[EMAIL] Resend error:', await res.text());
}

export async function sendBankTransferPendingEmail({
  to,
  guestName,
  bookingNumber,
  rooms,
  checkIn,
  checkOut,
  totalAmount,
}: {
  to: string;
  guestName: string;
  bookingNumber: string;
  rooms: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
}) {
  const uploadLink = `${BASE_URL}/booking/upload-receipt?ref=${bookingNumber}`;

  await sendEmail({
    to,
    subject: `Booking Pending Payment — ${bookingNumber} | White Vintage Bungalow`,
    html: `
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333">
  <div style="background:#2d6a4f;padding:24px;border-radius:8px 8px 0 0;text-align:center">
    <h1 style="color:#fff;margin:0;font-size:24px">White Vintage Bungalow</h1>
    <p style="color:#b7e4c7;margin:4px 0 0">Nuwara Eliya, Sri Lanka</p>
  </div>

  <div style="background:#f9f9f9;padding:28px;border:1px solid #e0e0e0">
    <h2 style="color:#2d6a4f;margin-top:0">Booking Received — Payment Pending</h2>
    <p>Dear <strong>${guestName}</strong>,</p>
    <p>Thank you for choosing White Vintage Bungalow. Your reservation is pending bank transfer payment confirmation.</p>

    <div style="background:#fff;border:1px solid #ddd;border-radius:8px;padding:20px;margin:20px 0">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:8px 0;color:#666;width:140px">Booking Reference</td>
            <td style="padding:8px 0;font-weight:bold;color:#2d6a4f">${bookingNumber}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Room(s)</td>
            <td style="padding:8px 0">${rooms}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Check-in</td>
            <td style="padding:8px 0">${checkIn}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Check-out</td>
            <td style="padding:8px 0">${checkOut}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Total Amount</td>
            <td style="padding:8px 0;font-weight:bold">LKR ${totalAmount.toLocaleString()}</td></tr>
      </table>
    </div>

    <h3 style="color:#2d6a4f">Bank Transfer Details</h3>
    <div style="background:#e8f5e9;border-left:4px solid #2d6a4f;padding:16px;border-radius:4px;font-size:14px">
      <p style="margin:4px 0"><strong>Bank:</strong> Commercial Bank of Ceylon</p>
      <p style="margin:4px 0"><strong>Account Name:</strong> White Vintage Bungalow</p>
      <p style="margin:4px 0"><strong>Account No.:</strong> 8000123456</p>
      <p style="margin:4px 0"><strong>Branch:</strong> Nuwara Eliya</p>
      <p style="margin:8px 0 4px"><strong>Payment Reference:</strong> <span style="color:#2d6a4f;font-weight:bold">${bookingNumber}</span></p>
    </div>

    <p style="margin-top:24px">Once you have completed the transfer, please <strong>upload your receipt</strong> using the button below so we can verify and confirm your booking:</p>

    <div style="text-align:center;margin:28px 0">
      <a href="${uploadLink}"
         style="background:#2d6a4f;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:bold;display:inline-block">
        Upload Payment Receipt
      </a>
    </div>

    <p style="font-size:13px;color:#888">Or copy this link into your browser:<br>
      <a href="${uploadLink}" style="color:#2d6a4f">${uploadLink}</a></p>

    <p>Your booking will be confirmed within <strong>2–4 hours</strong> on business days after receipt verification.</p>

    <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
    <p style="font-size:13px;color:#888;text-align:center">
      Questions? Contact us at
      <a href="mailto:info@whitevintage.com" style="color:#2d6a4f">info@whitevintage.com</a>
      or call <a href="tel:+94123456789" style="color:#2d6a4f">+94 (12) 345 6789</a>
    </p>
  </div>
</body>
</html>`,
  });
}

export async function sendBookingConfirmedEmail({
  to,
  guestName,
  bookingNumber,
  rooms,
  checkIn,
  checkOut,
}: {
  to: string;
  guestName: string;
  bookingNumber: string;
  rooms: string;
  checkIn: string;
  checkOut: string;
}) {
  await sendEmail({
    to,
    subject: `Booking Confirmed — ${bookingNumber} | White Vintage Bungalow`,
    html: `
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333">
  <div style="background:#2d6a4f;padding:24px;border-radius:8px 8px 0 0;text-align:center">
    <h1 style="color:#fff;margin:0;font-size:24px">White Vintage Bungalow</h1>
    <p style="color:#b7e4c7;margin:4px 0 0">Nuwara Eliya, Sri Lanka</p>
  </div>
  <div style="background:#f9f9f9;padding:28px;border:1px solid #e0e0e0">
    <h2 style="color:#2d6a4f;margin-top:0">✅ Booking Confirmed!</h2>
    <p>Dear <strong>${guestName}</strong>,</p>
    <p>Great news! Your payment has been verified and your booking is <strong>confirmed</strong>.</p>
    <div style="background:#fff;border:1px solid #ddd;border-radius:8px;padding:20px;margin:20px 0">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:8px 0;color:#666;width:140px">Booking Reference</td>
            <td style="padding:8px 0;font-weight:bold;color:#2d6a4f">${bookingNumber}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Room(s)</td>
            <td style="padding:8px 0">${rooms}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Check-in</td>
            <td style="padding:8px 0">${checkIn}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Check-out</td>
            <td style="padding:8px 0">${checkOut}</td></tr>
      </table>
    </div>
    <p>Check-in is from <strong>2:00 PM</strong>. Please bring a valid photo ID.</p>
    <p>We look forward to welcoming you!</p>
    <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
    <p style="font-size:13px;color:#888;text-align:center">
      Questions? <a href="mailto:info@whitevintage.com" style="color:#2d6a4f">info@whitevintage.com</a>
      | <a href="tel:+94123456789" style="color:#2d6a4f">+94 (12) 345 6789</a>
    </p>
  </div>
</body>
</html>`,
  });
}
