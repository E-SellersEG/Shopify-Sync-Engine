import React from 'react';

interface PlansPageProps {
  onChoosePlan: () => void;
  onLogin: () => void;
}

const PlansPage: React.FC<PlansPageProps> = ({ onChoosePlan, onLogin }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight sm:text-5xl">Choose Your Plan</h1>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">Simple, transparent pricing. One plan to rule them all.</p>
        </header>

        <div className="flex justify-center">
          <div className="w-full max-w-sm border-4 border-[#ffa500] rounded-2xl bg-white dark:bg-gray-800 shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pro Plan</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Everything you need to sync and manage your Shopify store.</p>
            
            <div className="my-8">
              <span className="text-5xl font-extrabold text-gray-900 dark:text-gray-100">$49.99</span>
              <span className="text-xl font-medium text-gray-500 dark:text-gray-400">/mo</span>
            </div>
            
            <ul className="space-y-3 text-left text-gray-600 dark:text-gray-300">
              <li className="flex items-center">
                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Unlimited Product Syncs
              </li>
              <li className="flex items-center">
                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                AI-Powered Data Generation
              </li>
              <li className="flex items-center">
                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Batch Control and Tools
              </li>
               <li className="flex items-center">
                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                24/7 Priority Support
              </li>
            </ul>

            <button
              onClick={onChoosePlan}
              className="mt-10 w-full bg-[#ffa500] hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-300"
            >
              Choose Plan
            </button>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <button onClick={onLogin} className="font-medium text-[#ffa500] hover:text-orange-600 focus:outline-none focus:underline transition">
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlansPage;