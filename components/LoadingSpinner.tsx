
import React from 'react';

interface LoadingSpinnerProps {
    message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center p-10">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-green"></div>
            <p className="mt-4 text-lg font-semibold text-gray-700">
                {message || 'Processing...'}
            </p>
        </div>
    );
};
