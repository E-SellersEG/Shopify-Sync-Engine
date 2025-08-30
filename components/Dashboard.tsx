import React, { useContext } from 'react';
import { AppContext } from '../App';
import Card from './Card';
import { ProductIcon, SettingsIcon, StockIcon, ImageIcon, TagIcon, PriceIcon, AnalyticsIcon, BatchControlIcon } from './icons/Icons';
import { View } from '../types';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
    const context = useContext(AppContext);
    const { currentUser } = useAuth();

    if (!context || !currentUser) return null;
    const { setView } = context;

    const QuickAction = ({ title, description, icon, actionView }: { title: string; description: string; icon: JSX.Element; actionView: View }) => (
        <button onClick={() => setView(actionView)} className="w-full text-left p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 flex items-start space-x-4 border border-gray-200 dark:border-gray-700">
            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center text-[#ffa500]">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
            </div>
        </button>
    );

  return (
    <div className="p-8 flex-1 overflow-y-auto h-full bg-gray-50 dark:bg-gray-900">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome back, {currentUser?.username}.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex flex-col gap-6">
            {currentUser.role === 'CLIENT' && (
                <Card title="Subscription Status">
                    <div className="space-y-3 text-gray-600 dark:text-gray-300">
                        <div className="flex justify-between items-center">
                            <span>Plan:</span>
                            <span className="font-bold text-gray-800 dark:text-gray-100">{currentUser.planName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Status:</span>
                            <span className={`font-bold px-2 py-1 rounded-full text-xs ${
                                currentUser.subscriptionStatus === 'ACTIVE'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                            }`}>{currentUser.subscriptionStatus}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>{currentUser.subscriptionStatus === 'ACTIVE' ? 'Renews on:' : 'Expires on:'}</span>
                            <span className="font-bold text-gray-800 dark:text-gray-100">{currentUser.renewalDate}</span>
                        </div>
                        <button 
                            onClick={() => setView('settings')}
                            className="w-full mt-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            Manage Subscription
                        </button>
                    </div>
                </Card>
            )}
            <Card title="Getting Started">
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                    <p>
                        This tool helps you synchronize your products and stock with Shopify.
                    </p>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>Go to <strong className="text-[#ffa500]">Settings</strong> to configure your Shopify store details.</li>
                        <li>Use the <strong className="text-[#ffa500]">Synchronization</strong> tabs to run a sync.</li>
                        <li>Monitor the progress in the log viewer.</li>
                    </ol>
                </div>
            </Card>
        </div>
        
        <div className="lg:col-span-2">
            <Card title="Quick Actions">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <QuickAction 
                        title="Sync Products" 
                        description="Create and update products." 
                        icon={<ProductIcon />}
                        actionView="products"
                    />
                    <QuickAction 
                        title="Sync Stock" 
                        description="Update inventory levels." 
                        icon={<StockIcon />}
                        actionView="stock"
                    />
                    <QuickAction 
                        title="Sync Images" 
                        description="Update product images." 
                        icon={<ImageIcon />}
                        actionView="images"
                    />
                    <QuickAction 
                        title="Sync Tags" 
                        description="Update product tags." 
                        icon={<TagIcon />}
                        actionView="tags"
                    />
                    <QuickAction 
                        title="Sync Prices" 
                        description="Update product prices." 
                        icon={<PriceIcon />}
                        actionView="price"
                    />
                    <QuickAction 
                        title="View Analytics" 
                        description="Check store performance." 
                        icon={<AnalyticsIcon />}
                        actionView="analytics"
                    />
                    <QuickAction 
                        title="Batch Control" 
                        description="Manage ongoing sync processes." 
                        icon={<BatchControlIcon />}
                        actionView="batchControl"
                    />
                    <QuickAction 
                        title="Configure Settings" 
                        description="Enter your Shopify API credentials." 
                        icon={<SettingsIcon />}
                        actionView="settings"
                    />
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;