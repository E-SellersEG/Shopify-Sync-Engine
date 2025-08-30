

import React from 'react';
import Card from './Card';

const Analytics: React.FC = () => {
  return (
    <div className="p-8 flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400">View sales data and store performance.</p>
      </header>
      <div className="max-w-4xl mx-auto">
        <Card title="Coming Soon">
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">Analytics Dashboard</h2>
            <p>This feature is under construction. Soon you'll be able to see detailed analytics about your Shopify store here.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default Analytics;