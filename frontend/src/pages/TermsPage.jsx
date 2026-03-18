export default function TermsPage() {
  return (
    <div className="bg-white dark:bg-gray-900 py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose dark:prose-invert lg:prose-lg mx-auto">
          <h1>Terms of Service</h1>
          <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>

          <p>
            Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the WasteChain website and mobile application (the "Service") operated by WasteChain ("us", "we", or "our").
          </p>

          <p>
            Your access to and use of the Service is conditioned upon your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who wish to access or use the Service.
          </p>

          <h2>Accounts</h2>
          <p>
            When you create an account with us, you guarantee that you are above the age of 18, and that the information you provide us is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on the Service.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of WasteChain and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
          </p>

          <h2>Termination</h2>
          <p>
            We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
          </p>

          <h2>Disclaimer</h2>
          <p>
            Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
          </p>

          <h2>Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
          </p>

          <h2>Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at: legal@wastechain.com.
          </p>
        </div>
      </div>
    </div>
  );
}
