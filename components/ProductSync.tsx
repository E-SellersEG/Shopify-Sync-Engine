import React, { useContext } from 'react';
import { AppContext } from '../App';
import LogViewer from './LogViewer';
import Card from './Card';
import { generateMockProducts } from '../services/geminiService';
import { useAuth } from '../contexts/AuthContext';

const ProductSync: React.FC = () => {
  const context = useContext(AppContext);
  const { currentUser } = useAuth();

  if (!context || !currentUser) return null;

  const { addLog, clearLogs, isLoading, setIsLoading } = context;
  const config = currentUser.config;

  const handleSync = async (mode: 'all' | 'update' | 'create') => {
    if (!config.storeDomain || !config.accessToken) {
      addLog({ type: 'ERROR', message: "Shopify configuration is missing. Please set it in Settings." });
      return;
    }

    setIsLoading(true);
    clearLogs();
    addLog({ type: 'INFO', message: `Starting product sync (Mode: ${mode})...` });
    addLog({ type: 'INFO', message: 'Calling AI to generate mock product data...' });

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      const mockProducts = await generateMockProducts();
      
      addLog({ type: 'SUCCESS', message: `Successfully generated ${mockProducts.length} mock products.` });
      
      for (const product of mockProducts) {
        addLog({ type: 'INFO', message: `Syncing product: ${product.title} (SKU: ${product.sku})` });
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate sync time per product
      }

      const productTitles = mockProducts.map((p: any) => p.title).join(', ');
      addLog({ type: 'SUCCESS', message: `Product sync complete. Synced: ${productTitles}` });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      addLog({ type: 'ERROR', message: `Product sync failed: ${errorMessage}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 flex-1 flex flex-col overflow-hidden h-full bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        <div className="lg:w-1/3 flex flex-col gap-6">
            <Card title="Sync Controls">
                <div className="space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        This tool uses AI to generate mock product data for demonstration.
                    </p>
                    <button
                        onClick={() => handleSync('all')}
                        disabled={isLoading}
                        className="w-full bg-[#ffa500] text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {isLoading ? 'Syncing...' : 'Sync All Products'}
                    </button>
                    <button
                        onClick={() => handleSync('update')}
                        disabled={isLoading}
                        className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {isLoading ? 'Syncing...' : 'Update Existing Only'}
                    </button>
                    <button
                        onClick={() => handleSync('create')}
                        disabled={isLoading}
                        className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {isLoading ? 'Syncing...' : 'Create New Products'}
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

export default ProductSync;