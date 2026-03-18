import { Link } from 'react-router-dom';
import { Recycle, QrCode, TrendingUp, Award, Shield, Leaf, ArrowRight, Users, CheckCircle } from 'lucide-react';
import heroImage from '../assets/hero.png';

export default function LandingPage() {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center min-h-[80vh]">
            <div className="py-12 md:py-24">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-gray-900 dark:text-white">
                Turn Waste into <span className="text-primary-600">Value</span>.
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-600 dark:text-gray-300">
                Join the recycling revolution with WasteChain. Track your waste, earn rewards, and build a sustainable future with our transparent, blockchain-powered platform.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/register" className="inline-flex items-center justify-center bg-primary-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-primary-700 transition transform hover:scale-105">
                  Get Started <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/info" className="inline-flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src={heroImage} 
                alt="WasteChain platform showing recycling stats" 
                className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Our Features</h2>
            <p className="mt-2 text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white">Everything You Need for Smart Recycling</p>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {[
              { icon: QrCode, title: 'QR Code Tracking', description: 'Every submission gets a unique QR code for complete lifecycle tracking.' },
              { icon: Shield, title: 'Blockchain Traceability', description: 'Immutable records ensure transparency and accountability at every step.' },
              { icon: Award, title: 'Gamified Rewards', description: 'Earn points and badges for recycling. Level up and make a real impact!' },
              { icon: TrendingUp, title: 'AI-Powered Detection', description: 'Smart waste classification using AI to identify recyclable materials instantly.' },
              { icon: Recycle, title: 'Closed-Loop Ecosystem', description: 'Track waste from citizen submission to final recycling, closing the loop.' },
              { icon: Leaf, title: 'Sustainability Impact', description: 'Visualize your environmental impact and contribution to a greener planet.' }
            ].map((feature) => (
              <div key={feature.title} className="p-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="inline-block p-4 bg-primary-100 dark:bg-primary-900/50 rounded-xl mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white">Simple Steps to a Cleaner Planet</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Our process is designed to be easy and rewarding.</p>
          </div>
          <div className="mt-12 grid md:grid-cols-4 gap-8 text-center">
            {[
              { step: '1', title: 'Submit & Scan', desc: 'Log your waste with a photo and get a unique QR code.' },
              { step: '2', title: 'Schedule Pickup', desc: 'A local collector is notified to pick up your waste.' },
              { step: '3', title: 'Track the Journey', desc: 'Follow your waste’s journey to the recycling facility.' },
              { step: '4', title: 'Earn Rewards', desc: 'Get points and rewards once your waste is recycled.' }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                {idx < 3 && <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200 dark:bg-gray-700"></div>}
                <div className="relative w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 z-10">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Join the Movement Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary-600 to-green-600 rounded-3xl p-12 md:p-16 text-white text-center">
            <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">Join the WasteChain Movement Today!</h2>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
              Be part of a community dedicated to making a tangible difference. Every piece of waste you track contributes to a cleaner, more sustainable world.
            </p>
            <Link to="/register" className="inline-flex items-center justify-center bg-white text-primary-600 px-10 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-gray-100 transition transform hover:scale-105">
              Create Your Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">WasteChain</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">A new era of recycling, powered by technology and community.</p>
            </div>
            <div>
              <h3 className="text-base font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-primary-600">About Us</Link></li>
                <li><Link to="/features" className="hover:text-primary-600">Features</Link></li>
                <li><Link to="/contact" className="hover:text-primary-600">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold mb-4">Get Started</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/register" className="hover:text-primary-600">Sign Up</Link></li>
                <li><Link to="/login" className="hover:text-primary-600">Login</Link></li>
                <li><Link to="/info" className="hover:text-primary-600">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy" className="hover:text-primary-600">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-primary-600">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} WasteChain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
