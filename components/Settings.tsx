import React, { useState, useEffect, useContext } from 'react';
import { ShopifyConfig } from '../types';
import Card from './Card';
import { useAuth } from '../contexts/AuthContext';
import { AppContext } from '../App';
import { testShopifyConnection } from '../services/shopifySDKService';

const Settings: React.FC = () => {
  const { currentUser, updateUserConfig, cancelSubscription } = useAuth();
  const appContext = useContext(AppContext);

  if (!currentUser || !appContext) return null;
  
  const { addLog } = appContext;
  const [localConfig, setLocalConfig] = useState<ShopifyConfig>(currentUser.config);
  const [connectionStatus, setConnectionStatus] = useState(currentUser.connectionStatus);
  const [isSaved, setIsSaved] = useState(true);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    setLocalConfig(currentUser.config);
    setConnectionStatus(currentUser.connectionStatus);
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Auto-clean store domain if user pastes full URL
    if (e.target.name === 'storeDomain') {
      value = value.replace('https://', '').replace('http://', '').replace('/admin/api/2024-04', '');
    }
    
    setLocalConfig({ ...localConfig, [e.target.name]: value });
    setIsSaved(false);
  };

  const handleSave = () => {
    updateUserConfig(localConfig, connectionStatus);
    addLog({ type: 'SUCCESS', message: 'Configuration saved successfully.' });
    setIsSaved(true);
  };

  const handleTestConnection = async () => {
    if (!localConfig.storeDomain || !localConfig.accessToken) {
        addLog({ type: 'ERROR', message: "Store Domain and Access Token are required to test." });
        return;
    }
    
    setIsTesting(true);
    setConnectionStatus('TESTING');
    addLog({ type: 'INFO', message: 'Testing Shopify connection...' });

    try {
      // First, test basic network connectivity
      addLog({ type: 'INFO', message: 'Testing network connectivity...' });
      
      try {
        const networkTest = await fetch('https://httpbin.org/get', { method: 'GET' });
        if (networkTest.ok) {
          addLog({ type: 'SUCCESS', message: 'Network connectivity: OK' });
        } else {
          addLog({ type: 'WARN', message: 'Network connectivity: Limited' });
        }
      } catch (networkError) {
        addLog({ type: 'ERROR', message: 'Network connectivity: FAILED - Check your internet connection' });
        setConnectionStatus('FAILED');
        updateUserConfig(localConfig, 'FAILED');
        return;
      }

      // Now test Shopify connection using the service
      addLog({ type: 'INFO', message: 'Testing Shopify API connection...' });
      addLog({ type: 'INFO', message: 'Note: Using CORS proxy to work around browser restrictions...' });
      
      const testResult = await testShopifyConnection(localConfig);
      
      if (testResult.success) {
        setConnectionStatus('CONNECTED');
        updateUserConfig(localConfig, 'CONNECTED');
        addLog({ type: 'SUCCESS', message: 'Connection to Shopify successful! Your credentials are valid.' });
        if (testResult.details?.shop?.name) {
          addLog({ type: 'INFO', message: `Connected to shop: ${testResult.details.shop.name}` });
        }
        if (testResult.details?.productsCount !== undefined) {
          addLog({ type: 'INFO', message: `Products accessible: ${testResult.details.productsCount} found` });
        }
      } else {
        setConnectionStatus('FAILED');
        updateUserConfig(localConfig, 'FAILED');
        addLog({ type: 'ERROR', message: `Shopify connection failed: ${testResult.error || 'Unknown error'}` });
        
        // Provide troubleshooting tips
        if (testResult.error?.includes('Access denied') || testResult.error?.includes('401')) {
          addLog({ type: 'WARN', message: '💡 Tip: Check if your access token has the correct permissions (read_products, read_inventory)' });
        }
        if (testResult.error?.includes('Store not found') || testResult.error?.includes('404')) {
          addLog({ type: 'WARN', message: '💡 Tip: Verify your store domain is correct (e.g., e-sellers-net.myshopify.com)' });
        }
        if (testResult.error?.includes('CORS')) {
          addLog({ type: 'WARN', message: '💡 Tip: CORS issue detected - the proxy should handle this automatically' });
        }
      }
    } catch (error) {
      setConnectionStatus('FAILED');
      updateUserConfig(localConfig, 'FAILED');
      addLog({ type: 'ERROR', message: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setIsTesting(false);
    }
  };
  
  const handleCancelSubscription = () => {
      if (window.confirm('Are you sure you want to cancel your subscription? You will lose access at the end of your billing period.')) {
          cancelSubscription();
          addLog({ type: 'WARN', message: 'Your subscription has been canceled.' });
      }
  }

  const getStatusIndicator = () => {
      switch (connectionStatus) {
          case 'CONNECTED':
              return <span className="text-green-500 font-bold">Connected</span>;
          case 'FAILED':
              return <span className="text-red-500 font-bold">Failed</span>;
          case 'TESTING':
              return <span className="text-yellow-500 font-bold">Testing...</span>;
          case 'UNTESTED':
          default:
              return <span className="text-gray-500 dark:text-gray-400 font-bold">Untested</span>;
      }
  }

  return (
    <div className="p-8 flex-1 overflow-y-auto h-full bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto space-y-8">
        <Card title="Shopify Credentials">
            <div className="space-y-6">
                <div>
                    <label htmlFor="storeDomain" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                        Store Domain
                    </label>
                    <input
                        type="text"
                        name="storeDomain"
                        id="storeDomain"
                        value={localConfig.storeDomain}
                        onChange={handleChange}
                        placeholder="your-store.myshopify.com"
                        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#ffa500] focus:border-[#ffa500] transition"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Format: your-store.myshopify.com (without https:// or /admin/api/2024-04)
                    </p>
                </div>
                <div>
                    <label htmlFor="accessToken" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                        Admin API Access Token
                    </label>
                    <input
                        type="password"
                        name="accessToken"
                        id="accessToken"
                        value={localConfig.accessToken}
                        onChange={handleChange}
                        placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxx"
                        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#ffa500] focus:border-[#ffa500] transition"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Should start with "shpat_" - get this from your Shopify admin
                    </p>
                </div>
                 <div>
                    <label htmlFor="locationId" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                        Location ID (Optional)
                    </label>
                    <input
                        type="text"
                        name="locationId"
                        id="locationId"
                        value={localConfig.locationId}
                        onChange={handleChange}
                        placeholder="1234567890"
                        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#ffa500] focus:border-[#ffa500] transition"
                    />
                </div>
                <div>
                    <label htmlFor="googleSheetId" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                        Google Sheet ID (Optional)
                    </label>
                    <input
                        type="text"
                        name="googleSheetId"
                        id="googleSheetId"
                        value={localConfig.googleSheetId}
                        onChange={handleChange}
                        placeholder="Enter your Google Sheet ID"
                        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#ffa500] focus:border-[#ffa500] transition"
                    />
                </div>

                {/* Debug Section - Show stored values */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Debug Info (Current Stored Values):</h4>
                    <div className="space-y-2 text-xs">
                        <div><strong>Store Domain:</strong> <span className="font-mono text-gray-600 dark:text-gray-400">{localConfig.storeDomain || 'Not set'}</span></div>
                        <div><strong>Access Token:</strong> <span className="font-mono text-gray-600 dark:text-gray-400">{localConfig.accessToken ? `${localConfig.accessToken.substring(0, 10)}...` : 'Not set'}</span></div>
                        <div><strong>Location ID:</strong> <span className="font-mono text-gray-600 dark:text-gray-400">{localConfig.locationId || 'Not set'}</span></div>
                        <div><strong>Current Status:</strong> <span className="font-mono text-gray-600 dark:text-gray-400">{connectionStatus}</span></div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800 dark:text-gray-200">Connection Status:</span>
                        {getStatusIndicator()}
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleTestConnection}
                            disabled={isTesting}
                            className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {isTesting ? 'Testing...' : 'Test Connection'}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaved}
                            className="bg-[#ffa500] text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 disabled:bg-gray-400 dark:disabled:bg-orange-800 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {isSaved ? 'Saved' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </Card>

        {currentUser.role === 'CLIENT' && (
            <Card title="Subscription Management">
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                        <span>Current Plan:</span>
                        <span className="font-bold text-lg text-gray-800 dark:text-gray-100">{currentUser.planName}</span>
                    </div>
                     <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                        <span>Status:</span>
                        <span className={`font-bold px-2 py-1 rounded-full text-sm ${
                            currentUser.subscriptionStatus === 'ACTIVE'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                        }`}>{currentUser.subscriptionStatus}</span>
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        {currentUser.subscriptionStatus === 'ACTIVE' ? (
                            <>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    Your subscription will automatically renew on {currentUser.renewalDate}.
                                </p>
                                <button
                                    onClick={handleCancelSubscription}
                                    className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    Cancel Subscription
                                </button>
                            </>
                        ) : (
                             <p className="text-sm text-center text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/40 p-3 rounded-md">
                                Your subscription has been canceled. You will retain access until {currentUser.renewalDate}.
                            </p>
                        )}
                    </div>
                </div>
            </Card>
        )}
      </div>
    </div>
  );
};

export default Settings;