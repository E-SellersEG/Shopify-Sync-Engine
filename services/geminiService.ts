// Mock service for generating stock levels locally (no external dependencies)
export const generateMockProducts = async (): Promise<any> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: 'gid://shopify/Product/12345',
      title: 'Andean Altitude Coffee',
      sku: 'COF-ANDEAN-001',
      price: 24.99,
      vendor: 'Artisanal Coffee Co.',
      tags: ['organic', 'single-origin', 'medium-roast']
    },
    {
      id: 'gid://shopify/Product/12346',
      title: 'Sumatra Supreme Blend',
      sku: 'COF-SUMATRA-002',
      price: 19.99,
      vendor: 'Artisanal Coffee Co.',
      tags: ['blend', 'dark-roast', 'bold']
    },
    {
      id: 'gid://shopify/Product/12347',
      title: 'Ethiopian Yirgacheffe',
      sku: 'COF-ETHIOP-003',
      price: 29.99,
      vendor: 'Artisanal Coffee Co.',
      tags: ['single-origin', 'light-roast', 'fruity']
    },
    {
      id: 'gid://shopify/Product/12348',
      title: 'Colombian Castillo',
      sku: 'COF-COLOM-004',
      price: 22.99,
      vendor: 'Artisanal Coffee Co.',
      tags: ['single-origin', 'medium-roast', 'balanced']
    },
    {
      id: 'gid://shopify/Product/12349',
      title: 'Guatemala Geisha',
      sku: 'COF-GUATE-005',
      price: 39.99,
      vendor: 'Artisanal Coffee Co.',
      tags: ['premium', 'single-origin', 'light-roast']
    }
  ];
};

export const generateMockStockLevels = async (productTitles: string[]): Promise<any> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Generate realistic stock levels between 5 and 200
  const stockLevels: { [key: string]: number } = {};
  
  productTitles.forEach(title => {
    // Generate random stock between 5-200 with realistic distribution
    const baseStock = Math.floor(Math.random() * 196) + 5; // 5-200
    stockLevels[title] = baseStock;
  });
  
  return stockLevels;
};