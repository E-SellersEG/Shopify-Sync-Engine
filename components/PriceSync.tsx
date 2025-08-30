import React, { useContext } from 'react';
import { AppContext } from '../App';
import LogViewer from './LogViewer';
import Card from './Card';
import { useAuth } from '../contexts/AuthContext';

const PriceSync: React.FC = () => {
  const context = useContext(AppContext);
  const { currentUser } = useAuth();
  
  if (!context || !currentUser) return null;
  const { addLog, clearLogs, isLoading, setIsLoading } = context;
  const config = currentUser.config;

  const handleSync = () => {
    if (!config.storeDomain || !config.accessToken) {
      addLog({ type: 'ERROR', message: "Shopify configuration is missing. Please set it in Settings." });
      return;
    }
    setIsLoading(true);
    clearLogs();
    addLog({ type: 'INFO', message: 'Starting price sync...' });
    setTimeout(() => {
      addLog({ type: 'INFO', message: 'Updating price for SKU-123 to $22.50.' });
    }, 500);
     setTimeout(() => {
      addLog({ type: 'INFO', message: 'Updating price for SKU-456 to $19.99.' });
    }, 1000);
    setTimeout(() => {
      addLog({ type: 'SUCCESS', message: 'Price sync complete.' });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="p-8 flex-1 flex flex-col overflow-hidden h-full bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        <div className="lg:w-1/3 flex flex-col gap-6">
            <Card title="Sync Controls">
                <div className="space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        This is a simulation of a product price sync process.
                    </p>
                    <button
                        onClick={handleSync}
                        disabled={isLoading}
                        className="w-full bg-[#ffa500] text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {isLoading ? 'Syncing...' : 'Start Price Sync'}
                    </button>
                </div>
            </Card>
        </div>
        <div className="lg:w-2/3 flex-1 flex flex-col min-h-0">
             <LogViewer />
        </div>
      </div>
    </div>
  );
};
export default PriceSync;