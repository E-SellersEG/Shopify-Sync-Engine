
import React, { useContext } from 'react';
import { AppContext } from '../App';
import { View } from '../types';
import { 
    DashboardIcon, 
    ProductIcon, 
    StockIcon, 
    SettingsIcon, 
    ImageIcon, 
    TagIcon, 
    PriceIcon, 
    AnalyticsIcon, 
    BatchControlIcon 
} from './icons/Icons';

const Sidebar: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) return null;

  const { view, setView } = context;

  const NavItem = ({ id, label, icon }: { id: View; label: string; icon: JSX.Element }) => (
    <li>
      <button
        onClick={() => setView(id)}
        className={`flex items-center w-full p-3 my-1 rounded-lg transition-colors duration-200 ${
          view === id ? 'bg-[#ffa500] text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
        }`}
      >
        <span className="w-6 h-6 mr-3">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </button>
    </li>
  );

  const NavGroup: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
      <div className="mt-4">
          <h2 className="px-3 mb-2 text-xs font-semibold tracking-wider text-gray-400 dark:text-gray-500 uppercase">{title}</h2>
          <ul>{children}</ul>
      </div>
  )

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col">
      <div className="flex items-center mb-6">
        <svg className="w-10 h-10 text-[#ffa500] mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.52 3.47L12 1 6.48 3.47 1 6.48v11.04l5.48 2.99L12 23l5.52-2.52L23 17.52V6.48l-5.48-3.01zM8.22 8.44l3.78 2.18 3.78-2.18-3.78-2.18-3.78 2.18zm-2.74 6.08l3.78-2.18v4.36l-3.78-2.18zm1.08 3.75l3.78-2.18 1.89-1.09-1.89-1.09-3.78-2.18 3.78-2.18 5.67 3.27-1.89 1.09-3.78 2.18 3.78 2.18-5.67 3.27-3.78-2.18zm9.36-1.57l-3.78-2.18v-4.36l3.78 2.18v2.18z"/>
        </svg>
        <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight">Shopify Sync Engine</h1>
      </div>
      <nav className="flex-grow">
        <ul>
            <NavItem id="dashboard" label="Dashboard" icon={<DashboardIcon />} />
        </ul>

        <NavGroup title="Synchronization">
            <NavItem id="products" label="Products" icon={<ProductIcon />} />
            <NavItem id="stock" label="Stock" icon={<StockIcon />} />
            <NavItem id="images" label="Images" icon={<ImageIcon />} />
            <NavItem id="tags" label="Tags" icon={<TagIcon />} />
            <NavItem id="price" label="Price" icon={<PriceIcon />} />
        </NavGroup>
        
        <NavGroup title="Tools">
            <NavItem id="analytics" label="Analytics" icon={<AnalyticsIcon />} />
            <NavItem id="batchControl" label="Batch Control" icon={<BatchControlIcon />} />
        </NavGroup>
        
      </nav>
      <div>
        <ul>
          <NavItem id="settings" label="Settings" icon={<SettingsIcon />} />
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;