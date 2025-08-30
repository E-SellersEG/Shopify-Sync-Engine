

import React, { useContext } from 'react';
import Card from './Card';
import { AppContext } from '../App';

const BatchControl: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { addLog } = context;
  
  const handleAction = (action: string) => {
      addLog({type: 'INFO', message: `Batch Control action triggered: ${action}`});
  }

  return (
    <div className="p-8 flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Batch Control</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage and monitor ongoing batch processes.</p>
      </header>
       <div className="max-w-4xl mx-auto">
        <Card title="Process Management">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
                onClick={() => handleAction('Show Status')}
                className="bg-[#ffa500] text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-200"
            >
                Show Status
            </button>
            <button 
                 onClick={() => handleAction('Pause Current Batch')}
                 className="bg-yellow-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-yellow-600 transition-colors duration-200"
            >
                Pause Current Batch
            </button>
            <button 
                 onClick={() => handleAction('Resume Processing')}
                 className="bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200"
            >
                Resume Processing
            </button>
            <button 
                 onClick={() => handleAction('Reset All Processing')}
                 className="bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
                Reset All Processing
            </button>
          </div>
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Current Status: <span className="font-semibold text-green-500">IDLE</span>
            </p>
             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Last Batch Type: <span className="font-semibold text-gray-700 dark:text-gray-200">Product Sync</span>
            </p>
             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Progress: <span className="font-semibold text-gray-700 dark:text-gray-200">N/A</span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default BatchControl;