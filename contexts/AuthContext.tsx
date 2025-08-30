import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, Role, ShopifyConfig, ConnectionStatus } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addClient: (username: string, password: string) => { success: boolean, message: string };
  updateUserConfig: (newConfig: ShopifyConfig, newStatus: ConnectionStatus) => void;
  cancelSubscription: () => void;
  getClients: () => User[];
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_STORAGE_KEY = 'shopify-sync-users';

// This function simulates a user database using localStorage
const getUsersFromStorage = (): User[] => {
  try {
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    if (!usersJson) return [];
    return JSON.parse(usersJson) as User[];
  } catch (error) {
    console.error("Error reading users from localStorage", error);
    return [];
  }
};

const saveUsersToStorage = (users: User[]) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Error saving users to localStorage", error);
  }
};

const getFutureRenewalDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(getUsersFromStorage);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Initialize with Admin and a demo Client user if they don't exist
  useEffect(() => {
    const existingUsers = getUsersFromStorage();
    const usersToUpdate = [...existingUsers];
    let needsUpdate = false;

    const adminExists = existingUsers.some(u => u.role === 'ADMIN');
    if (!adminExists) {
      const adminUser: User = {
        id: 'admin-user',
        username: 'E-sellers',
        password: 'E-sellers@123',
        role: 'ADMIN',
        config: { storeDomain: '', accessToken: '', locationId: '', googleSheetId: '' },
        connectionStatus: 'UNTESTED',
      };
      usersToUpdate.push(adminUser);
      needsUpdate = true;
    }

    const demoClientExists = existingUsers.some(u => u.username === 'User');
    if (!demoClientExists) {
        const demoClient: User = {
            id: 'demo-client',
            username: 'User',
            password: 'User',
            role: 'CLIENT',
            config: { storeDomain: '', accessToken: '', locationId: '', googleSheetId: '' },
            connectionStatus: 'UNTESTED',
            subscriptionStatus: 'ACTIVE',
            planName: 'Pro Plan',
            renewalDate: getFutureRenewalDate(),
        };
        usersToUpdate.push(demoClient);
        needsUpdate = true;
    }

    if (needsUpdate) {
      setUsers(usersToUpdate);
      saveUsersToStorage(usersToUpdate);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addClient = (username: string, password: string): { success: boolean, message: string } => {
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        return { success: false, message: 'Username already exists.'};
    }
    const newClient: User = {
      id: `user-${Date.now()}`,
      username,
      password,
      role: 'CLIENT',
      config: { storeDomain: '', accessToken: '', locationId: '', googleSheetId: '' },
      connectionStatus: 'UNTESTED',
      subscriptionStatus: 'ACTIVE',
      planName: 'Pro Plan',
      renewalDate: getFutureRenewalDate(),
    };
    const newUsers = [...users, newClient];
    setUsers(newUsers);
    saveUsersToStorage(newUsers);
    return { success: true, message: 'Client created successfully.' };
  };
  
  const updateUserConfig = (newConfig: ShopifyConfig, newStatus: ConnectionStatus) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, config: newConfig, connectionStatus: newStatus };
    setCurrentUser(updatedUser);

    const newUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
    setUsers(newUsers);
    saveUsersToStorage(newUsers);
  };

  const cancelSubscription = () => {
    if (!currentUser || currentUser.role !== 'CLIENT') return;

    const updatedUser: User = { ...currentUser, subscriptionStatus: 'CANCELED' };
    setCurrentUser(updatedUser);

    const newUsers = users.map(u => (u.id === currentUser.id ? updatedUser : u));
    setUsers(newUsers);
    saveUsersToStorage(newUsers);
  };

  const getClients = (): User[] => {
      return users.filter(u => u.role === 'CLIENT');
  }

  const value = {
    currentUser,
    login,
    logout,
    addClient,
    updateUserConfig,
    cancelSubscription,
    getClients,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};