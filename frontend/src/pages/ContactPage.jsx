import { Mail, Phone, MapPin } from 'lucide-react';
import Button from '../components/Button';

export default function ContactPage() {
  return (
    <div className="bg-white dark:bg-gray-900 py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Contact Us</h2>
          <p className="mt-2 text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white">
            Get in Touch
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            Have questions or want to partner with us? We'd love to hear from you.
          </p>
        </div>

        <div className="mt-20 grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Mail />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Email</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">General Inquiries: <a href="mailto:contact@wastechain.com" className="text-primary-600 hover:underline">contact@wastechain.com</a></p>
                <p className="mt-1 text-gray-500 dark:text-gray-400">Support: <a href="mailto:support@wastechain.com" className="text-primary-600 hover:underline">support@wastechain.com</a></p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Phone />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Phone</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">6284195632</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <MapPin />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Location</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">123 Green Way, Sustainable City, 12345</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form className="space-y-6 bg-gray-50 dark:bg-gray-800/50 p-8 rounded-2xl shadow-lg">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <input type="text" id="name" className="input mt-1" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input type="email" id="email" className="input mt-1" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
              <textarea id="message" rows="4" className="input mt-1"></textarea>
            </div>
            <Button type="submit" className="w-full">Send Message</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
