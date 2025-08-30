import React, { useContext } from 'react';
import { AppContext } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { View } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon } from './icons/Icons';

const viewTitles: Record<View, string> = {
    dashboard: 'Dashboard',
    products: 'Product Synchronization',
    stock: 'Stock Synchronization',
    images: 'Image Synchronization',
    tags: 'Tag Synchronization',
    price: 'Price Synchronization',
    analytics: 'Analytics',
    batchControl: 'Batch Control',
    settings: 'Settings'
};

const Header: React.FC = () => {
  const appContext = useContext(AppContext);
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (!appContext) return null;
  const { view } = appContext;

  return (
    <header className="flex-shrink-0 flex items-center justify-between p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{viewTitles[view]}</h1>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
            Logged in as <strong className="text-gray-800 dark:text-gray-100">{currentUser?.username}</strong>
        </span>
         <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
        <button 
          onClick={logout} 
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;