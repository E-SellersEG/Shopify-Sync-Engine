import React from 'react';
import { ProductIcon, StockIcon, ImageIcon, TagIcon, PriceIcon, AnalyticsIcon } from './icons/Icons';

interface HomePageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const FeatureCard: React.FC<{ icon: JSX.Element; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition-transform duration-300 shadow-sm">
    <div className="flex items-center justify-center w-12 h-12 mb-4 bg-gray-100 dark:bg-gray-700 rounded-full text-[#ffa500]">
      {icon}
    </div>
    <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400">{description}</p>
  </div>
);

const HomePage: React.FC<HomePageProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center p-4 relative">
      <header className="absolute top-0 left-0 right-0 p-4 z-10">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
                 <svg className="w-8 h-8 text-[#ffa500]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.52 3.47L12 1 6.48 3.47 1 6.48v11.04l5.48 2.99L12 23l5.52-2.52L23 17.52V6.48l-5.48-3.01zM8.22 8.44l3.78 2.18 3.78-2.18-3.78-2.18-3.78 2.18zm-2.74 6.08l3.78-2.18v4.36l-3.78-2.18zm1.08 3.75l3.78-2.18 1.89-1.09-1.89-1.09-3.78-2.18 3.78-2.18 5.67 3.27-1.89 1.09-3.78 2.18 3.78 2.18-5.67 3.27-3.78-2.18zm9.36-1.57l-3.78-2.18v-4.36l3.78 2.18v2.18z"/>
                </svg>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Shopify Sync Engine</span>
            </div>
            <button
                onClick={onLogin}
                className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-2 px-5 rounded-lg transition-colors duration-300"
            >
                Login
            </button>
        </nav>
      </header>
      
      <main className="max-w-5xl w-full text-center flex-1 flex flex-col justify-center pt-20">
        <header className="mb-12">
            <div className="flex items-center justify-center mb-4">
                <svg className="w-16 h-16 text-[#ffa500] mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.52 3.47L12 1 6.48 3.47 1 6.48v11.04l5.48 2.99L12 23l5.52-2.52L23 17.52V6.48l-5.48-3.01zM8.22 8.44l3.78 2.18 3.78-2.18-3.78-2.18-3.78 2.18zm-2.74 6.08l3.78-2.18v4.36l-3.78-2.18zm1.08 3.75l3.78-2.18 1.89-1.09-1.89-1.09-3.78-2.18 3.78-2.18 5.67 3.27-1.89 1.09-3.78 2.18 3.78 2.18-5.67 3.27-3.78-2.18zm9.36-1.57l-3.78-2.18v-4.36l3.78 2.18v2.18z"/>
                </svg>
                <h1 className="text-5xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Shopify Sync Engine</h1>
            </div>
            <p className="mt-4 text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                A powerful multi-client dashboard for effortlessly managing and synchronizing product data with Shopify stores, powered by AI.
            </p>
        </header>

        <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={<ProductIcon />} 
                    title="Product Sync" 
                    description="Create, update, and manage your entire product catalog. Uses AI to generate realistic mock data for testing."
                />
                <FeatureCard 
                    icon={<StockIcon />} 
                    title="Stock Level Sync" 
                    description="Keep inventory levels accurate across multiple locations with automated and manual stock adjustments."
                />
                <FeatureCard 
                    icon={<ImageIcon />} 
                    title="Image & Media Sync" 
                    description="Easily upload and assign images to product variants, ensuring your storefront is always visually up-to-date."
                />
                <FeatureCard 
                    icon={<TagIcon />} 
                    title="Tag Management" 
                    description="Organize your products with tags for better filtering and collection management."
                />
                <FeatureCard 
                    icon={<PriceIcon />} 
                    title="Price Updates" 
                    description="Perform bulk price adjustments or schedule updates for sales and promotions."
                />
                 <FeatureCard 
                    icon={<AnalyticsIcon />} 
                    title="Admin Oversight" 
                    description="A dedicated admin dashboard to create and manage client accounts with isolated configurations."
                />
            </div>
        </section>

        <div className="mt-12">
          <button
            onClick={onGetStarted}
            className="bg-[#ffa500] hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Get Started
          </button>
        </div>
      </main>
      <footer className="mt-12 text-center text-gray-400 dark:text-gray-500">
        <p>&copy; {new Date().getFullYear()} Shopify Sync Engine. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;