import React, { useState, useCallback, useContext } from 'react';
import { View, LogEntry, AppContextType } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ProductSync from './components/ProductSync';
import StockSync from './components/StockSync';
import Settings from './components/Settings';
import ImageSync from './components/ImageSync';
import TagSync from './components/TagSync';
import PriceSync from './components/PriceSync';
import Analytics from './components/Analytics';
import BatchControl from './components/BatchControl';
import Login from './components/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import HomePage from './components/HomePage';
import PlansPage from './components/PlansPage';
import CheckoutPage from './components/CheckoutPage';
import { ThemeProvider } from './contexts/ThemeContext';


export const AppContext = React.createContext<AppContextType | null>(null);

// Client-facing part of the app with its own context
const ClientApp: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const addLog = useCallback((log: Omit<LogEntry, 'timestamp'>) => {
    const newLog: LogEntry = {
      ...log,
      timestamp: new Date().toLocaleTimeString(),
    };
    setLogs(prevLogs => [...prevLogs, newLog]);
  }, []);
  
  const clearLogs = useCallback(() => {
      setLogs([]);
  }, []);

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <Dashboard />;
      case 'products': return <ProductSync />;
      case 'stock': return <StockSync />;
      case 'images': return <ImageSync />;
      case 'tags': return <TagSync />;
      case 'price': return <PriceSync />;
      case 'analytics': return <Analytics />;
      case 'batchControl': return <BatchControl />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  const contextValue: AppContextType = {
    view,
    setView,
    logs,
    addLog,
    clearLogs,
    isLoading,
    setIsLoading,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <Layout>
        {renderView()}
      </Layout>
    </AppContext.Provider>
  );
};


// Determines what to show based on auth state and pre-auth flow
const AppController: React.FC = () => {
    const { currentUser } = useAuth();
    type PreAuthState = 'home' | 'plans' | 'checkout' | 'login';
    const [preAuthState, setPreAuthState] = useState<PreAuthState>('home');

    if (currentUser) {
        if (currentUser.role === 'ADMIN') {
            return <AdminDashboard />;
        }
        return <ClientApp />;
    }

    // If no current user, show the pre-auth flow
    switch (preAuthState) {
        case 'home':
            return <HomePage onGetStarted={() => setPreAuthState('plans')} onLogin={() => setPreAuthState('login')} />;
        case 'plans':
            return <PlansPage onChoosePlan={() => setPreAuthState('checkout')} onLogin={() => setPreAuthState('login')} />;
        case 'checkout':
            return <CheckoutPage onLogin={() => setPreAuthState('login')} />;
        case 'login':
        default:
            return <Login />;
    }
}


const App: React.FC = () => {
  return (
    <ThemeProvider>
        <AuthProvider>
            <AppController />
        </AuthProvider>
    </ThemeProvider>
  );
};

export default App;