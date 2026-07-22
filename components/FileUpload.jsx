import React, { useRef } from 'react';
import { UploadCloudIcon } from './icons.jsx';

export const FileUpload = ({ onFileChange, imageUrl }) => {
    const fileInputRef = useRef(null);

    const handleFileSelect = (event) => {
        const file = event.target.files?.[0] || null;
        onFileChange(file);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div 
            className="flex justify-center items-center w-full bg-white p-6 rounded-lg shadow-md border-2 border-dashed border-gray-300 cursor-pointer hover:border-brand-green transition-colors"
            onClick={handleClick}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*"
            />
            {imageUrl ? (
                <div className="text-center">
                    <img src={imageUrl} alt="Soil Health Card Preview" className="max-h-64 rounded-lg mx-auto" />
                     <p className="text-sm text-gray-500 mt-2">Click again to change image</p>
                </div>
            ) : (
                <div className="text-center">
                    <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-lg font-semibold text-gray-700">Upload Soil Health Card</p>
                    <p className="text-sm text-gray-500">Click to browse or drag and drop</p>
                </div>
            )}
        </div>
    );
};