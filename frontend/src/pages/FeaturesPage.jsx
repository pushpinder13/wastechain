import { Recycle, QrCode, TrendingUp, Award, Shield, Leaf } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    { icon: QrCode, title: 'QR Code Tracking', description: 'Every waste submission gets a unique QR code for complete lifecycle tracking from your doorstep to the recycling facility.' },
    { icon: Shield, title: 'Blockchain Traceability', description: 'Our platform is built on a blockchain-inspired system, ensuring that all records are immutable, transparent, and accountable.' },
    { icon: Award, title: 'Gamified Rewards System', description: 'Earn points, badges, and level up for your recycling efforts. Turn your sustainable habits into tangible rewards.' },
    { icon: TrendingUp, title: 'AI-Powered Waste Detection', description: 'Our smart waste classification uses advanced AI to instantly identify recyclable materials from a photo, making submission a breeze.' },
    { icon: Recycle, title: 'Complete Closed-Loop Ecosystem', description: 'We connect all stakeholders in the recycling process, from the citizen to the collector to the recycler, creating a seamless and efficient loop.' },
    { icon: Leaf, title: 'Measure Your Sustainability Impact', description: 'Our dashboards provide detailed analytics on your recycling habits, allowing you to visualize your positive environmental impact.' }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white">
            Technology for a Greener Tomorrow
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            Explore the innovative features that make WasteChain the most advanced recycling platform.
          </p>
        </div>

        <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature) => (
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
    </div>
  );
}
