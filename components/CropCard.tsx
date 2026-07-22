
import React from 'react';
import { Crop } from '../types';
import { SeedlingIcon } from './icons';

interface CropCardProps {
    crop: Crop;
    onSelect: (crop: Crop) => void;
}

export const CropCard: React.FC<CropCardProps> = ({ crop, onSelect }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform transform hover:-translate-y-1">
            <div className="bg-brand-green text-white p-4 flex items-center">
                <SeedlingIcon className="h-6 w-6 mr-3"/>
                <h3 className="text-xl font-bold">{crop.name}</h3>
            </div>
            <div className="p-6 flex-grow">
                <p className="text-gray-600 mb-4">{crop.reason}</p>
                <div>
                    <span className="text-sm font-semibold text-gray-500">Yield Potential</span>
                    <p className="text-lg font-bold text-brand-green-dark">{crop.yieldPotential}</p>
                </div>
            </div>
            <div className="px-6 pb-6 mt-auto">
                <button
                    onClick={() => onSelect(crop)}
                    className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-2 px-4 rounded-full transition-colors"
                >
                    Create Plan
                </button>
            </div>
        </div>
    );
};
