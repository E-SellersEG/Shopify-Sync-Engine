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

// Create a simple Shopify client that bypasses CORS
class ShopifyClient {
  private storeDomain: string;
  private accessToken: string;

  constructor(storeDomain: string, accessToken: string) {
    this.storeDomain = storeDomain.replace('https://', '').replace('/admin/api/2024-04', '');
    this.accessToken = accessToken;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `https://${this.storeDomain}/admin/api/2024-04${endpoint}`;
    
    try {
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

      return response;
    } catch (error) {
      // If direct request fails due to CORS, try using a CORS proxy
      console.log('Direct request failed, trying CORS proxy...');
      
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      const proxyResponse = await fetch(proxyUrl, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!proxyResponse.ok) {
        throw new Error(`Proxy request failed: ${proxyResponse.status} ${proxyResponse.statusText}`);
      }

      return proxyResponse;
    }
  }

  async getShop() {
    const response = await this.makeRequest('/shop.json');
    const data = await response.json();
    return data.shop;
  }

  async getProducts(limit: number = 50) {
    const response = await this.makeRequest(`/products.json?limit=${limit}`);
    const data = await response.json();
    return data.products || [];
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

// Export functions that use the client
export const createShopifyClient = (config: ShopifyConfig) => {
  return new ShopifyClient(config.storeDomain, config.accessToken);
};

export const fetchShopifyProducts = async (config: ShopifyConfig): Promise<ShopifyProduct[]> => {
  try {
    const client = createShopifyClient(config);
    const products = await client.getProducts(50);
    console.log('Products fetched successfully:', products.length);
    return products;
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
    const client = createShopifyClient(config);
    const result = await client.updateInventory(inventoryItemId, locationId, quantity);
    console.log('Inventory updated successfully:', result);
    return !!result;
  } catch (error) {
    console.error('Error updating inventory:', error);
    throw new Error(`Failed to update inventory: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const testShopifyConnection = async (config: ShopifyConfig): Promise<{ success: boolean; error?: string; details?: any }> => {
  try {
    console.log('Testing Shopify connection with SDK...');
    const client = createShopifyClient(config);
    
    // Test shop endpoint
    console.log('Testing shop API...');
    const shop = await client.getShop();
    console.log('Shop API success:', shop);
    
    // Test products endpoint
    console.log('Testing products API...');
    const products = await client.getProducts(1);
    console.log('Products API success:', products.length, 'products found');
    
    return { 
      success: true, 
      details: { 
        shop, 
        productsCount: products.length 
      } 
    };
    
  } catch (error) {
    console.error('Shopify connection test failed:', error);
    
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
