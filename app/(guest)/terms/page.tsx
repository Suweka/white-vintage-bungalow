export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-heading font-bold mb-2">Terms and Conditions</h1>
          <p className="text-gray-200">Last updated: June 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12 max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
              Welcome to White Vintage Bungalow Terms and Conditions
            </h2>
            <p className="text-gray-700 mb-6">
              These terms and conditions outline the rules and regulations for the use of White Vintage 
              Bungalow's accommodation services and website. By booking a room or using our services, 
              you accept these terms and conditions in full.
            </p>

            <h3 className="text-xl font-heading font-semibold mt-8 mb-4">1. Terms</h3>
            <p className="text-gray-700 mb-4">
              By accessing this website and booking our accommodation, you agree to be bound by these 
              terms and conditions, all applicable laws and regulations. If you do not agree with any 
              of these terms, you are prohibited from using or booking our services.
            </p>

            <h3 className="text-xl font-heading font-semibold mt-8 mb-4">2. Use License</h3>
            <p className="text-gray-700 mb-4">
              Permission is granted to temporarily book and use our accommodation services for personal, 
              non-commercial purposes only. This is the grant of a license, not a transfer of title, and 
              under this license you may not:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Sublease the accommodation without written permission</li>
              <li>Use the premises for any illegal or unauthorized purpose</li>
              <li>Damage or misuse the property and facilities</li>
              <li>Exceed the maximum occupancy limits</li>
            </ul>

            <h3 className="text-xl font-heading font-semibold mt-8 mb-4">3. Disclaimer</h3>
            <p className="text-gray-700 mb-4">
              The materials on White Vintage Bungalow's website and property are provided on an 'as is' 
              basis. We make no warranties, expressed or implied, and hereby disclaim and negate all 
              other warranties including, without limitation, implied warranties of merchantability, 
              fitness for a particular purpose, or non-infringement.
            </p>

            <h3 className="text-xl font-heading font-semibold mt-8 mb-4">4. Limitations</h3>
            <p className="text-gray-700 mb-4">
              In no event shall White Vintage Bungalow or its suppliers be liable for any damages 
              (including, without limitation, damages for loss of data or profit, or due to business 
              interruption) arising out of the use or inability to use our services, even if we or 
              an authorized representative has been notified of the possibility of such damage.
            </p>

            <h3 className="text-xl font-heading font-semibold mt-8 mb-4">5. Accuracy of Materials</h3>
            <p className="text-gray-700 mb-4">
              The materials appearing on White Vintage Bungalow's website could include technical, 
              typographical, or photographic errors. We do not warrant that any of the materials on 
              our website are accurate, complete, or current. We may make changes to the materials 
              contained on our website at any time without notice.
            </p>

            <h3 className="text-xl font-heading font-semibold mt-8 mb-4">6. Links</h3>
            <p className="text-gray-700 mb-4">
              White Vintage Bungalow has not reviewed all of the sites linked to its website and is 
              not responsible for the contents of any such linked site. The inclusion of any link does 
              not imply endorsement by us. Use of any such linked website is at the user's own risk.
            </p>

            <h3 className="text-xl font-heading font-semibold mt-8 mb-4">7. Modifications</h3>
            <p className="text-gray-700 mb-4">
              White Vintage Bungalow may revise these terms of service at any time without notice. 
              By using this website and our services, you are agreeing to be bound by the then-current 
              version of these terms and conditions.
            </p>

            <h3 className="text-xl font-heading font-semibold mt-8 mb-4">8. Governing Law</h3>
            <p className="text-gray-700 mb-4">
              These terms and conditions are governed by and construed in accordance with the laws of 
              Sri Lanka, and you irrevocably submit to the exclusive jurisdiction of the courts in 
              that location.
            </p>

            <h3 className="text-xl font-heading font-semibold mt-8 mb-4">9. Booking and Payment Terms</h3>
            <p className="text-gray-700 mb-4">
              All bookings require a deposit or full payment at the time of reservation as specified during
              checkout. Full payment is due upon check-in or as stated in your booking confirmation.
            </p>
            <p className="text-gray-700 mb-4">
              Online payments are processed securely by <strong>PayHere</strong> (payhere.lk), a licensed
              payment gateway regulated in Sri Lanka. We do not store, access, or process your card or
              banking details directly — all financial data is handled by PayHere in accordance with
              PCI-DSS standards. By making an online payment, you also agree to PayHere's terms of service.
            </p>
            <p className="text-gray-700 mb-4">
              Cancellations made more than 24 hours before check-in are eligible for a full refund.
              Please refer to our <a href="/refund-policy" className="text-primary hover:underline">Refund Policy</a> for complete details on cancellations and refund timelines.
            </p>

            <h3 className="text-xl font-heading font-semibold mt-8 mb-4">10. Guest Conduct</h3>
            <p className="text-gray-700 mb-4">
              Guests are expected to conduct themselves in a respectful manner. We reserve the right 
              to refuse service or ask guests to leave if their behavior is deemed inappropriate, 
              dangerous, or disruptive to other guests.
            </p>

            <div className="mt-12 p-6 bg-primary-light rounded-lg">
              <h3 className="text-xl font-heading font-semibold mb-3">Questions?</h3>
              <p className="text-gray-700">
                If you have any questions about these Terms and Conditions, please contact us at{' '}
                <a href="mailto:info@whitevintage.com" className="text-primary hover:underline">
                  info@whitevintage.com
                </a>{' '}
                or call us at +94 (52) 222 5232.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}