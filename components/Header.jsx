import React from 'react';
import { LeafIcon } from './icons.jsx';

export const Header = ({ onLogout, user }) => {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                    <LeafIcon className="h-8 w-8 text-brand-green" />
                    <div className="ml-2">
                        <h1 className="text-xl md:text-2xl font-bold text-brand-green-dark">
                            SmartHarvest
                        </h1>
                        {user && <p className="text-xs md:text-sm text-gray-600">Welcome, {user.name}!</p>}
                    </div>
                </div>
                <button
                    onClick={onLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};