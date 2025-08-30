import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import LogViewer from './LogViewer';
import Card from './Card';
import { useAuth } from '../contexts/AuthContext';
import { fetchShopifyProducts, updateProductInventory, ShopifyProduct } from '../services/shopifySDKService';

const StockSync: React.FC = () => {
  const context = useContext(AppContext);
  const { currentUser } = useAuth();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);

  if (!context || !currentUser) return null;

  const { addLog, clearLogs, isLoading, setIsLoading } = context;
  const config = currentUser.config;

  const generateRealisticStockLevels = (productCount: number): { [key: string]: number } => {
    const stockLevels: { [key: string]: number } = {};
    
    for (let i = 0; i < productCount; i++) {
      // Generate realistic stock between 5-200 with some products having higher stock
      const baseStock = Math.floor(Math.random() * 196) + 5; // 5-200
      stockLevels[`product_${i}`] = baseStock;
    }
    
    return stockLevels;
  };

  const handleSync = async () => {
    if (!config.storeDomain || !config.accessToken || !config.locationId) {
      addLog({ type: 'ERROR', message: "Shopify configuration is missing. Please set it in Settings." });
      return;
    }

    setIsLoading(true);
    clearLogs();
    addLog({ type: 'INFO', message: `Starting stock sync...` });
    addLog({ type: 'INFO', message: `Fetching products from your Shopify store...` });
    
    try {
      // Fetch real products from Shopify
      const shopifyProducts = await fetchShopifyProducts(config);
      
      if (shopifyProducts.length === 0) {
        addLog({ type: 'WARN', message: "No products found in your Shopify store." });
        return;
      }

      addLog({ type: 'SUCCESS', message: `Found ${shopifyProducts.length} products in your store.` });
      setProducts(shopifyProducts);

      // Generate realistic stock levels for the actual products
      const stockLevels = generateRealisticStockLevels(shopifyProducts.length);
      
      addLog({ type: 'INFO', message: `Generating realistic stock levels for your products...` });
      
      // Update stock for each product
      for (let i = 0; i < shopifyProducts.length; i++) {
        const product = shopifyProducts[i];
        const newStockLevel = stockLevels[`product_${i}`];
        
        addLog({ type: 'INFO', message: `Updating stock for "${product.title}" to ${newStockLevel} units.` });
        
        // If the product has variants with inventory_item_id, update the inventory
        if (product.variants && product.variants.length > 0) {
          const variant = product.variants[0]; // Update first variant for simplicity
          if (variant.inventory_item_id) {
            try {
              await updateProductInventory(config, variant.inventory_item_id, config.locationId, newStockLevel);
              addLog({ type: 'SUCCESS', message: `Successfully updated "${product.title}" inventory.` });
            } catch (error) {
              addLog({ type: 'ERROR', message: `Failed to update inventory for "${product.title}": ${error instanceof Error ? error.message : 'Unknown error'}` });
            }
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate sync time per product
      }

      addLog({ type: 'SUCCESS', message: `Stock sync complete for ${shopifyProducts.length} products.` });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      addLog({ type: 'ERROR', message: `Stock sync failed: ${errorMessage}` });
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
                        This tool fetches your real Shopify products and generates realistic stock levels for them.
                    </p>
                    {products.length > 0 && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          Found <strong>{products.length}</strong> products in your store
                        </p>
                      </div>
                    )}
                    <button
                        onClick={handleSync}
                        disabled={isLoading}
                        className="w-full bg-[#ffa500] text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {isLoading ? 'Syncing...' : 'Start Stock Sync'}
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

export default StockSync;