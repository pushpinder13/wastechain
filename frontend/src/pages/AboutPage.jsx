import { Building, Users, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-gray-900 py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">About Us</h2>
          <p className="mt-2 text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white">
            Pioneering the Future of Sustainable Waste Management
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            WasteChain is on a mission to revolutionize the recycling industry through transparency, technology, and community engagement.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto">
                <Building />
              </div>
              <h3 className="mt-5 text-lg font-medium text-gray-900 dark:text-white">Our Vision</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                To create a circular economy where waste is a resource, not a burden. We envision a world where every piece of recyclable material is tracked, processed, and given a new life.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto">
                <Target />
              </div>
              <h3 className="mt-5 text-lg font-medium text-gray-900 dark:text-white">Our Mission</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                To build a transparent and rewarding ecosystem that connects citizens, collectors, and recyclers, making the recycling process efficient, accountable, and beneficial for everyone.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto">
                <Users />
              </div>
              <h3 className="mt-5 text-lg font-medium text-gray-900 dark:text-white">Our Team</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                We are a passionate team of engineers, environmentalists, and innovators dedicated to solving the global waste crisis with cutting-edge technology.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
