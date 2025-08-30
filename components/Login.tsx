import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(username, password);
    if (!success) {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="text-center">
            <div className="flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-[#ffa500] mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.52 3.47L12 1 6.48 3.47 1 6.48v11.04l5.48 2.99L12 23l5.52-2.52L23 17.52V6.48l-5.48-3.01zM8.22 8.44l3.78 2.18 3.78-2.18-3.78-2.18-3.78 2.18zm-2.74 6.08l3.78-2.18v4.36l-3.78-2.18zm1.08 3.75l3.78-2.18 1.89-1.09-1.89-1.09-3.78-2.18 3.78-2.18 5.67 3.27-1.89 1.09-3.78 2.18 3.78 2.18-5.67 3.27-3.78-2.18zm9.36-1.57l-3.78-2.18v-4.36l3.78 2.18v2.18z"/>
                </svg>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Shopify Sync Engine</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400">Please sign in to continue</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="text-sm font-bold text-gray-600 dark:text-gray-300 block"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-2 mt-1 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:border-[#ffa500] focus:ring focus:ring-orange-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-bold text-gray-600 dark:text-gray-300 block"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 mt-1 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:border-[#ffa500] focus:ring focus:ring-orange-200 focus:ring-opacity-50"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ffa500] hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;