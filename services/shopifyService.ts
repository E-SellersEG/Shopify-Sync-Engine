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

// Check if we're in development mode
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Mock Shopify data for development
const mockShopifyData = {
  shop: {
    id: 123456789,
    name: "E-sellers Store",
    domain: "e-sellers-net.myshopify.com",
    email: "admin@e-sellers.com",
    currency: "USD",
    timezone: "America/New_York"
  },
  products: [
    {
      id: "gid://shopify/Product/123456789",
      title: "Sample Product 1",
      sku: "PROD-001",
      vendor: "E-sellers",
      tags: ["electronics", "gadgets"],
      variants: [{
        id: "gid://shopify/ProductVariant/987654321",
        inventory_quantity: 50,
        inventory_item_id: "inv_item_001"
      }]
    },
    {
      id: "gid://shopify/Product/123456790",
      title: "Sample Product 2", 
      sku: "PROD-002",
      vendor: "E-sellers",
      tags: ["clothing", "fashion"],
      variants: [{
        id: "gid://shopify/ProductVariant/987654322",
        inventory_quantity: 25,
        inventory_item_id: "inv_item_002"
      }]
    },
    {
      id: "gid://shopify/Product/123456791",
      title: "Sample Product 3",
      sku: "PROD-003", 
      vendor: "E-sellers",
      tags: ["home", "decor"],
      variants: [{
        id: "gid://shopify/ProductVariant/987654323",
        inventory_quantity: 75,
        inventory_item_id: "inv_item_003"
      }]
    }
  ]
};

// Development mode: Simulate API calls with realistic delays
const simulateApiCall = async (endpoint: string, delay: number = 800) => {
  console.log(`[DEV MODE] Simulating API call to: ${endpoint}`);
  await new Promise(resolve => setTimeout(resolve, delay));
  
  if (endpoint.includes('shop.json')) {
    return { shop: mockShopifyData.shop };
  } else if (endpoint.includes('products.json')) {
    return { products: mockShopifyData.products };
  } else if (endpoint.includes('inventory_levels/set.json')) {
    return { success: true };
  }
  
  throw new Error('Unknown endpoint in development mode');
};

// Production mode: Real Shopify API calls
const makeRealShopifyRequest = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
    }
    return response;
  } catch (error) {
    console.error('Real Shopify API call failed:', error);
    throw error;
  }
};

// Main request function that switches between dev and production
const makeShopifyRequest = async (url: string, options: RequestInit = {}) => {
  if (isDevelopment) {
    // Development mode: Use mock data
    const mockResponse = await simulateApiCall(url);
    return {
      ok: true,
      json: async () => mockResponse,
      text: async () => JSON.stringify(mockResponse),
      status: 200,
      statusText: 'OK'
    } as Response;
  } else {
    // Production mode: Use real API
    return await makeRealShopifyRequest(url, options);
  }
};

export const fetchShopifyProducts = async (config: ShopifyConfig): Promise<ShopifyProduct[]> => {
  try {
    const storeDomain = config.storeDomain.replace('https://', '').replace('/admin/api/2024-04', '');
    
    const url = `https://${storeDomain}/admin/api/2024-04/products.json`;
    console.log('Fetching products from:', url);
    
    const response = await makeShopifyRequest(url, {
      headers: {
        'X-Shopify-Access-Token': config.accessToken,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('Products response:', data);
    return data.products || [];
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
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
    const storeDomain = config.storeDomain.replace('https://', '').replace('/admin/api/2024-04', '');
    
    const url = `https://${storeDomain}/admin/api/2024-04/inventory_levels/set.json`;
    console.log('Updating inventory at:', url);
    
    const response = await makeShopifyRequest(url, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': config.accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location_id: locationId,
        inventory_item_id: inventoryItemId,
        available: quantity,
      }),
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error updating inventory:', error);
    throw new Error(`Failed to update inventory: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Test connection function
export const testShopifyConnection = async (config: ShopifyConfig): Promise<{ success: boolean; error?: string; details?: any }> => {
  try {
    const storeDomain = config.storeDomain.replace('https://', '').replace('/admin/api/2024-04', '');
    
    console.log('Testing connection to:', storeDomain);
    console.log('Using token:', config.accessToken.substring(0, 10) + '...');
    
    if (isDevelopment) {
      console.log('[DEV MODE] Using simulated Shopify API for testing');
    }
    
    // Test with shop.json endpoint first
    const shopUrl = `https://${storeDomain}/admin/api/2024-04/shop.json`;
    console.log('Testing shop API:', shopUrl);
    
    const shopResponse = await makeShopifyRequest(shopUrl, {
      headers: {
        'X-Shopify-Access-Token': config.accessToken,
        'Content-Type': 'application/json',
      },
    });

    console.log('Shop API response status:', shopResponse.status);

    if (!shopResponse.ok) {
      const errorText = await shopResponse.text();
      console.error('Shop API error response:', errorText);
      throw new Error(`Shopify API error: ${shopResponse.status} ${shopResponse.statusText} - ${errorText}`);
    }

    const shopData = await shopResponse.json();
    console.log('Shop API success response:', shopData);
    
    if (!shopData.shop) {
      throw new Error('Invalid response format from Shopify API');
    }

    // Test products endpoint to ensure full access
    try {
      const productsUrl = `https://${storeDomain}/admin/api/2024-04/products.json?limit=1`;
      console.log('Testing products API:', productsUrl);
      
      const productsResponse = await makeShopifyRequest(productsUrl, {
        headers: {
          'X-Shopify-Access-Token': config.accessToken,
          'Content-Type': 'application/json',
        },
      });

      console.log('Products API response status:', productsResponse.status);
      
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        console.log('Products API success response:', productsData);
        return { 
          success: true, 
          details: { 
            shop: shopData.shop, 
            productsCount: productsData.products?.length || 0 
          } 
        };
      } else {
        const errorText = await productsResponse.text();
        console.error('Products API error response:', errorText);
        return { 
          success: false, 
          error: `Products API failed: ${productsResponse.status} ${productsResponse.statusText}`,
          details: { shop: shopData.shop }
        };
      }
    } catch (productsError) {
      console.error('Products API test failed:', productsError);
      return { 
        success: false, 
        error: `Products API test failed: ${productsError instanceof Error ? productsError.message : 'Unknown error'}`,
        details: { shop: shopData.shop }
      };
    }

  } catch (error) {
    console.error('Shopify connection test failed:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return { 
        success: false, 
        error: 'Network error - check if the store domain is correct and accessible' 
      };
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
      return { success: false, error: error.message };
    }
    
    return { success: false, error: 'Unknown error occurred during connection test' };
  }
};
