import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types';
import Card from '../Card';
import { useTheme } from '../../contexts/ThemeContext';
import { SunIcon, MoonIcon } from '../icons/Icons';

const AddClientForm: React.FC<{ onClientAdded: () => void }> = ({ onClientAdded }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<{ text: string; type: 'SUCCESS' | 'ERROR' } | null>(null);
    const { addClient } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            setMessage({ text: 'Username and password are required.', type: 'ERROR' });
            return;
        }
        const result = addClient(username, password);
        setMessage({ text: result.message, type: result.success ? 'SUCCESS' : 'ERROR'});
        if (result.success) {
            setUsername('');
            setPassword('');
            onClientAdded();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">New Client Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#ffa500]"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">New Client Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#ffa500]"
                />
            </div>
            <button type="submit" className="w-full bg-[#ffa500] text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">
                Create Client
            </button>
            {message && (
                <p className={`mt-2 text-sm ${message.type === 'SUCCESS' ? 'text-green-500' : 'text-red-500'}`}>
                    {message.text}
                </p>
            )}
        </form>
    );
};


const AdminDashboard: React.FC = () => {
    const { currentUser, logout, getClients } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [clients, setClients] = useState<User[]>([]);

    useEffect(() => {
        setClients(getClients());
    }, []);

    const handleClientAdded = () => {
        setClients(getClients());
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Welcome, {currentUser?.username}</span>
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                    </button>
                    <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg">
                        Logout
                    </button>
                </div>
            </header>
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card title="Client Accounts">
                            <div className="space-y-3">
                                {clients.length === 0 ? (
                                    <p className="text-gray-500 dark:text-gray-400">No clients have been created yet.</p>
                                ) : (
                                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {clients.map(client => (
                                            <li key={client.id} className="py-3 flex justify-between items-center">
                                                <span className="font-medium text-gray-800 dark:text-gray-200">{client.username}</span>
                                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                                    client.connectionStatus === 'CONNECTED' 
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                                                }`}>
                                                    {client.connectionStatus}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </Card>
                    </div>
                    <div>
                        <Card title="Add New Client">
                            <AddClientForm onClientAdded={handleClientAdded} />
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;