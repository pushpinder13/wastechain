import React from 'react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { Leaf, Recycle, Check, X, ThumbsUp, ThumbsDown } from 'lucide-react';

const InfoPage = () => {
  const recyclingBenefits = [
    {
      icon: <Leaf className="w-10 h-10 text-green-500" />,
      title: "Conserves Natural Resources",
      text: "Recycling reduces the need for extracting raw materials, saving energy and preserving natural habitats."
    },
    {
      icon: <Recycle className="w-10 h-10 text-blue-500" />,
      title: "Reduces Pollution",
      text: "Manufacturing with recycled materials produces less air and water pollution than using virgin materials."
    },
    {
      icon: <ThumbsUp className="w-10 h-10 text-yellow-500" />,
      title: "Saves Energy",
      text: "It takes significantly less energy to reprocess recycled materials than to produce new materials from scratch."
    }
  ];

  const dos = [
    "Clean and dry containers before recycling.",
    "Flatten cardboard boxes to save space.",
    "Check local guidelines for accepted materials.",
    "Recycle all accepted paper, plastic, glass, and metal.",
    "Keep electronics and batteries out of the regular recycling bin."
  ];
  
  const donts = [
    "Do not recycle plastic bags in curbside bins.",
    "Avoid putting food waste in recycling containers.",
    "Do not recycle items with mixed materials (like coffee cups).",
    "Keep hazardous waste like paint or chemicals out of recycling.",
    "Don't guess - if you're not sure, it's better to trash it."
  ];


  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Recycle className="w-20 h-20 text-primary-500 mx-auto mb-4"/>
            <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white">Your Guide to Effective Recycling</h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Learn how your actions contribute to a cleaner, more sustainable planet.
            </p>
          </div>
          
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">Why Recycling Matters</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {recyclingBenefits.map((item, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <div className="mb-4 inline-block p-4 bg-primary-100 dark:bg-primary-900/50 rounded-full">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.text}</p>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 text-center">Recycling Do's & Don'ts</h2>
            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <div className='flex items-center mb-4'>
                        <ThumbsUp className="w-8 h-8 text-green-500 mr-3"/>
                        <h3 className="text-2xl font-bold">Do's</h3>
                    </div>
                    <ul className="space-y-3">
                        {dos.map((item, index) => (
                           <li key={index} className="flex items-start">
                                <Check className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                                <span>{item}</span>
                           </li>
                        ))}
                    </ul>
                </Card>
                <Card>
                    <div className='flex items-center mb-4'>
                        <ThumbsDown className="w-8 h-8 text-red-500 mr-3"/>
                        <h3 className="text-2xl font-bold">Don'ts</h3>
                    </div>
                     <ul className="space-y-3">
                        {donts.map((item, index) => (
                           <li key={index} className="flex items-start">
                                <X className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" />
                                <span>{item}</span>
                           </li>
                        ))}
                    </ul>
                </Card>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default InfoPage;
