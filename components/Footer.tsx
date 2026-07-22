
import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-white mt-8">
            <div className="container mx-auto px-4 py-4 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} SmartHarvest. Powered by AI for a greener tomorrow.</p>
            </div>
        </footer>
    );
};
