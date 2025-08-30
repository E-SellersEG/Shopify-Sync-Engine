import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface CheckoutPageProps {
  onLogin: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onLogin }) => {
  const { addClient, login } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Dummy state for payment form
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }
    // Basic validation for other fields
    if (!username || !cardName || !cardNumber || !expiry || !cvc) {
        setError("Please fill in all fields.");
        return;
    }

    setIsLoading(true);

    // Simulate payment processing
    setTimeout(() => {
        const result = addClient(username, password);
        if (result.success) {
            // Automatically log in the new user
            const loginSuccess = login(username, password);
            if (!loginSuccess) {
                 setError('An unexpected error occurred during login. Please try again.');
                 setIsLoading(false);
            }
            // On successful login, the AppController will automatically redirect to the dashboard.
        } else {
            setError(result.message);
            setIsLoading(false);
        }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Complete Your Purchase</h1>
            <p className="text-gray-500 dark:text-gray-400">Create your account and start syncing.</p>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
            {/* Account Info */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">Account Information</h2>
                <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Username</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full p-2 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:border-[#ffa500] focus:ring-orange-200" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-2 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:border-[#ffa500] focus:ring-orange-200" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full p-2 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:border-[#ffa500] focus:ring-orange-200" />
                </div>
            </div>

            {/* Payment Info */}
            <div className="space-y-6">
                 <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">Payment Details (Simulation)</h2>
                 <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Name on Card</label>
                    <input type="text" value={cardName} onChange={e => setCardName(e.target.value)} required className="w-full p-2 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" placeholder="John Doe" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Card Number</label>
                    <input type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)} required className="w-full p-2 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" placeholder="**** **** **** 1234" />
                </div>
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Expiry (MM/YY)</label>
                        <input type="text" value={expiry} onChange={e => setExpiry(e.target.value)} required className="w-full p-2 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" placeholder="12/25" />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">CVC</label>
                        <input type="text" value={cvc} onChange={e => setCvc(e.target.value)} required className="w-full p-2 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" placeholder="123" />
                    </div>
                </div>
            </div>
            
            {/* Submission */}
            <div className="md:col-span-2">
                {error && <p className="text-sm text-red-500 mb-4 text-center">{error}</p>}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-[#ffa500] hover:bg-orange-600 disabled:bg-gray-500 transition"
                >
                    {isLoading ? 'Processing...' : 'Pay $49.99 & Subscribe'}
                </button>
            </div>
        </form>
         <div className="mt-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
                Already have an account?{' '}
                <button onClick={onLogin} className="font-medium text-[#ffa500] hover:text-orange-600 focus:outline-none focus:underline transition">
                Login
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;