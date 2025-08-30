import { ShopifyConfig } from '../types';

export interface ShopifyProduct {
  id: string;
  title: string;
  sku?: string;
  vendor?: string;
  tags?: string[];
  variants?: Array<{
    id: string;
    inventory_quantity: number;
    inventory_item_id: string;
  }>;
}

// Enhanced Shopify client with multiple fallback strategies
class EnhancedShopifyClient {
  private storeDomain: string;
  private accessToken: string;

  constructor(storeDomain: string, accessToken: string) {
    this.storeDomain = storeDomain.replace('https://', '').replace('/admin/api/2024-04', '');
    this.accessToken = accessToken;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `https://${this.storeDomain}/admin/api/2024-04${endpoint}`;
    
    // Strategy 1: Try direct request first
    try {
      console.log('🔄 Strategy 1: Trying direct Shopify API request...');
      const response = await fetch(url, {
        ...options,
        headers: {
          'X-Shopify-Access-Token': this.accessToken,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
      }

      console.log('✅ Direct request successful!');
      return response;
    } catch (error) {
      console.log('❌ Direct request failed, trying CORS proxies...');
    }

    // Strategy 2: Try CORS proxies
    const proxyOptions = [
      'https://api.allorigins.win/raw?url=', // This one was working before
      'https://cors-anywhere.herokuapp.com/',
      'https://thingproxy.freeboard.io/fetch/',
      'https://corsproxy.io/?',
      'https://cors.eu.org/?',
      'https://api.codetabs.com/v1/proxy?quest=',
      'https://cors.bridged.cc/'
    ];

    for (const proxy of proxyOptions) {
      try {
        console.log(`🔄 Strategy 2: Trying CORS proxy: ${proxy}`);
        let proxyUrl: string;
        
        if (proxy === 'https://cors-anywhere.herokuapp.com/') {
          proxyUrl = proxy + url;
        } else if (proxy === 'https://api.allorigins.win/raw?url=') {
          proxyUrl = proxy + encodeURIComponent(url);
        } else if (proxy === 'https://thingproxy.freeboard.io/fetch/') {
          proxyUrl = proxy + url;
        } else if (proxy === 'https://corsproxy.io/?') {
          proxyUrl = proxy + url;
        } else if (proxy === 'https://cors.eu.org/?') {
          proxyUrl = proxy + url;
        } else if (proxy === 'https://api.codetabs.com/v1/proxy?quest=') {
          proxyUrl = proxy + url;
        } else if (proxy === 'https://cors.bridged.cc/') {
          proxyUrl = proxy + url;
        }

        const proxyResponse = await fetch(proxyUrl, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...options.headers,
          },
        });

        if (!proxyResponse.ok) {
          throw new Error(`Proxy ${proxy} failed: ${proxyResponse.status}`);
        }

        console.log(`✅ CORS proxy ${proxy} successful!`);
        return proxyResponse;
      } catch (proxyError) {
        console.log(`❌ CORS proxy ${proxy} failed:`, proxyError);
        continue;
      }
    }

    // Strategy 3: Try Netlify function as final fallback
    try {
      console.log('🔄 Strategy 3: Trying Netlify function proxy...');
      
      // First check if the function is accessible
      try {
        const healthCheck = await fetch('/.netlify/functions/shopify-proxy', {
          method: 'OPTIONS'
        });
        console.log('✅ Netlify function is accessible');
      } catch (healthError) {
        console.log('❌ Netlify function health check failed:', healthError);
        throw new Error('Netlify function not accessible');
      }
      
      const netlifyResponse = await fetch('/.netlify/functions/shopify-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint,
          method: options.method || 'GET',
          body: options.body,
          storeDomain: this.storeDomain,
          accessToken: this.accessToken,
        }),
      });

      if (!netlifyResponse.ok) {
        throw new Error(`Netlify function failed: ${netlifyResponse.status}`);
      }

      const netlifyData = await netlifyResponse.json();
      
      if (!netlifyData.success) {
        throw new Error(`Shopify API error via Netlify: ${netlifyData.status} ${netlifyData.statusText}`);
      }

      console.log('✅ Netlify function proxy successful!');
      
      // Return a mock response object that mimics the original response
      return {
        ok: true,
        json: async () => netlifyData.data,
        text: async () => JSON.stringify(netlifyData.data),
        status: netlifyData.status,
        statusText: netlifyData.statusText,
      } as Response;
      
    } catch (netlifyError) {
      console.log('❌ Netlify function failed:', netlifyError);
    }

    // If all strategies fail, throw comprehensive error
    throw new Error(`All connection strategies failed. Cannot connect to Shopify API. Please check your credentials and try again.`);
  }

  // Simple connection test that doesn't require full API access
  async testBasicConnection(): Promise<boolean> {
    try {
      console.log('🔄 Testing basic connection with minimal request...');
      
      // Try to make a very simple request to see if credentials work
      const response = await fetch(`https://${this.storeDomain}/admin/api/2024-04/shop.json`, {
        method: 'HEAD', // Just check headers, don't get full response
        headers: {
          'X-Shopify-Access-Token': this.accessToken,
        },
      });
      
      if (response.status === 200 || response.status === 401 || response.status === 403) {
        // These status codes mean we can reach Shopify (even if unauthorized)
        console.log('✅ Basic connection test successful - can reach Shopify');
        return true;
      } else {
        console.log('❌ Basic connection test failed');
        return false;
      }
    } catch (error) {
      console.log('❌ Basic connection test error:', error);
      return false;
    }
  }

  async getShop() {
    const response = await this.makeRequest('/shop.json');
    const data = await response.json();
    
    console.log('🔍 Raw shop response data:', data);
    console.log('🔍 Data type:', typeof data);
    console.log('🔍 Data keys:', data ? Object.keys(data) : 'null/undefined');
    
    // Handle different response formats from proxies
    if (data && data.shop) {
      return data.shop;
    } else if (data && typeof data === 'object') {
      // Some proxies might return the data directly
      return data;
    } else {
      console.warn('Unexpected shop data format:', data);
      throw new Error('Invalid shop data format received from Shopify');
    }
  }

  async getProducts(limit: number = 50) {
    const response = await this.makeRequest(`/products.json?limit=${limit}`);
    const data = await response.json();
    
    console.log('🔍 Raw products response data:', data);
    console.log('🔍 Data type:', typeof data);
    console.log('🔍 Data keys:', data ? Object.keys(data) : 'null/undefined');
    
    // Handle different response formats from proxies
    if (data && Array.isArray(data.products)) {
      return data.products;
    } else if (data && Array.isArray(data)) {
      // Some proxies might return the array directly
      return data;
    } else {
      console.warn('Unexpected products data format:', data);
      return []; // Return empty array instead of throwing
    }
  }

  async updateInventory(inventoryItemId: string, locationId: string, quantity: number) {
    const response = await this.makeRequest('/inventory_levels/set.json', {
      method: 'POST',
      body: JSON.stringify({
        location_id: locationId,
        inventory_item_id: inventoryItemId,
        available: quantity,
      }),
    });

    const data = await response.json();
    return data.inventory_level || null;
  }
}

// Export functions that use the enhanced client
export const createEnhancedShopifyClient = (config: ShopifyConfig) => {
  return new EnhancedShopifyClient(config.storeDomain, config.accessToken);
};

export const fetchShopifyProducts = async (config: ShopifyConfig): Promise<ShopifyProduct[]> => {
  try {
    const client = createEnhancedShopifyClient(config);
    const products = await client.getProducts(50);
    console.log('✅ Products fetched successfully:', products.length);
    return products;
  } catch (error) {
    console.error('❌ Error fetching Shopify products:', error);
    throw new Error(`Failed to fetch products from Shopify: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const updateProductInventory = async (
  config: ShopifyConfig, 
  inventoryItemId: string, 
  locationId: string, 
  quantity: number
): Promise<boolean> => {
  try {
    const client = createEnhancedShopifyClient(config);
    const result = await client.updateInventory(inventoryItemId, locationId, quantity);
    console.log('✅ Inventory updated successfully:', result);
    return !!result;
  } catch (error) {
    console.error('❌ Error updating inventory:', error);
    throw new Error(`Failed to update inventory: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const testShopifyConnection = async (config: ShopifyConfig): Promise<{ success: boolean; error?: string; details?: any }> => {
  try {
    console.log('🚀 Testing Shopify connection with enhanced multi-strategy approach...');
    const client = createEnhancedShopifyClient(config);
    
    // Test shop endpoint
    console.log('🔄 Testing shop API...');
    const shop = await client.getShop();
    console.log('✅ Shop API success:', shop);
    
    // Test products endpoint
    console.log('🔄 Testing products API...');
    const products = await client.getProducts(1);
    console.log('✅ Products API success:', products.length, 'products found');
    
    return { 
      success: true, 
      details: { 
        shop, 
        productsCount: products.length 
      } 
    };
    
  } catch (error) {
    console.error('❌ Shopify connection test failed:', error);
    
    // Try basic connection test as fallback
    try {
      console.log('🔄 Trying basic connection test as fallback...');
      const client = createEnhancedShopifyClient(config);
      const basicConnection = await client.testBasicConnection();
      
      if (basicConnection) {
        return { 
          success: true, 
          details: { 
            message: 'Basic connection successful - credentials are valid but API access may be limited',
            basicTest: true
          } 
        };
      }
    } catch (basicError) {
      console.log('❌ Basic connection test also failed:', basicError);
    }
    
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        return { success: false, error: 'Access denied - check if your access token is valid and has the correct permissions' };
      }
      if (error.message.includes('403')) {
        return { success: false, error: 'Forbidden - your access token may not have sufficient permissions' };
      }
      if (error.message.includes('404')) {
        return { success: false, error: 'Store not found - check if the store domain is correct' };
      }
      if (error.message.includes('CORS')) {
        return { success: false, error: 'CORS blocked - all proxy attempts failed. This is a browser security limitation.' };
      }
      if (error.message.includes('All connection strategies failed')) {
        return { success: false, error: 'All connection methods failed. Please check your credentials and try again later.' };
      }
      return { success: false, error: error.message };
    }
    
    return { success: false, error: 'Unknown error occurred during connection test' };
  }
};
