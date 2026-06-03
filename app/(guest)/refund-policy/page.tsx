export const metadata = {
  title: 'Refund Policy | White Vintage Bungalow',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-heading font-bold mb-2">Refund Policy</h1>
          <p className="text-gray-200">Last updated: June 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12 max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">

            <p className="text-gray-700 mb-6">
              At White Vintage Bungalow, we value your satisfaction and want to ensure a transparent and
              fair booking experience. This Refund Policy outlines the conditions under which cancellations
              and refunds are accepted for reservations made through our website.
            </p>

            <h3 className="text-xl font-heading font-semibold mt-8 mb-4">1. Cancellation by Guest</h3>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-light">
                    <th className="text-left p-3 font-semibold border border-gray-200">Cancellation Notice</th>
                    <th className="text-left p-3 font-semibold border border-gray-200">Refund</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border border-gray-200 text-gray-700">More than 24 hours before check-in</td>
                    <td className="p-3 border border-gray-200 text-green-700 font-medium">Full refund</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 border border-gray-200 text-gray-700">Within 24 hours of check-in</td>
                    <td className="p-3 border border-gray-200 text-yellow-700 font-medium">One-night charge applies; remainder refunded</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-gray-200 text-gray-700">No-show (no cancellation)</td>
                    <td className="p-3 border border-gray-200 text-red-700 font-medium">No refund — full booking amount charged</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-heading font-semibold mt-8 mb-4">2. How to Request a Cancellation</h3>
            <p className="text-gray-700 mb-4">
              To cancel your reservation, please contact us as early as possible using one of the following:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Email: <a href="mailto:info@whitevintage.com" className="text-primary hover:underline">info@whitevintage.com</a></li>
              <li>Phone: <a href="tel:+94123456789" className="text-primary hover:underline">+94 (12) 345 6789</a></li>
            </ul>
            <p className="text-gray-700 mb-4">
              Please include your booking reference number in all communications. Cancellation requests
              are acknowledged during business hours (8:00 AM – 6:00 PM, Monday to Sunday, Sri Lanka Time).
            </p>

            <h3 className="text-xl font-heading font-semibold mt-8 mb-4">3. Refund Processing</h3>
            <p className="text-gray-700 mb-4">
              Approved refunds will be processed to the original payment method used at the time of booking:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Online payments (PayHere):</strong> Refunds are processed within 7–14 business days. The exact timing depends on your card issuer or bank.</li>
              <li><strong>Bank transfers:</strong> Refunds are processed within 5–7 business days after verification.</li>
            </ul>
            <p className="text-gray-700 mb-4">
              You will receive an email notification once your refund has been initiated. We are not
              responsible for any additional delays caused by your financial institution.
            </p>

            <h3 className="text-xl font-heading font-semibold mt-8 mb-4">4. Cancellation by White Vintage Bungalow</h3>
            <p className="text-gray-700 mb-4">
              In the unlikely event that we need to cancel your reservation (e.g., due to unforeseen
              circumstances, property maintenance, or force majeure), you will receive:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>A full refund of all amounts paid.</li>
              <li>Prompt notification via email or phone.</li>
              <li>Assistance in finding alternative accommodation where possible.</li>
            </ul>

            <h3 className="text-xl font-heading font-semibold mt-8 mb-4">5. Non-Refundable Bookings</h3>
            <p className="text-gray-700 mb-4">
              Certain promotional rates or special packages may be non-refundable. This will be clearly
              stated at the time of booking before payment is confirmed. Please review your booking
              confirmation carefully.
            </p>

            <h3 className="text-xl font-heading font-semibold mt-8 mb-4">6. Early Departure</h3>
            <p className="text-gray-700 mb-4">
              If you check out before your confirmed check-out date, the unused nights will not be
              refunded unless prior written agreement has been obtained from our management.
            </p>

            <h3 className="text-xl font-heading font-semibold mt-8 mb-4">7. Damaged or Unsatisfactory Stay</h3>
            <p className="text-gray-700 mb-4">
              If you experience any issues during your stay, please report them to our staff immediately.
              We will do our best to resolve the matter promptly. Refund claims based on dissatisfaction
              must be raised during the stay — claims submitted after check-out may not be considered.
            </p>

            <h3 className="text-xl font-heading font-semibold mt-8 mb-4">8. Changes to This Policy</h3>
            <p className="text-gray-700 mb-4">
              We reserve the right to update this Refund Policy at any time. Changes will be published
              on this page with a revised date. Your continued use of our booking services constitutes
              acceptance of the updated policy.
            </p>

            <div className="mt-12 p-6 bg-primary-light rounded-lg">
              <h3 className="text-xl font-heading font-semibold mb-3">Need Help?</h3>
              <p className="text-gray-700 mb-4">
                If you have any questions about our Refund Policy or need to discuss a specific situation,
                please reach out to us — we are always happy to help.
              </p>
              <ul className="text-gray-700 space-y-2">
                <li>Email: <a href="mailto:info@whitevintage.com" className="text-primary hover:underline">info@whitevintage.com</a></li>
                <li>Phone: +94 (12) 345 6789</li>
                <li>Address: 78/5 Bakers Park, 18 Dawson Hills, Nuwara Eliya, Sri Lanka</li>
              </ul>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
