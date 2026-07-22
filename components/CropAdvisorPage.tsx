import React, { useState } from 'react';
import { FileUpload } from './FileUpload';
import { DataDisplayCard } from './DataDisplayCard';
import { CropCard } from './CropCard';
import { RecommendationDetails } from './RecommendationDetails';
import { LoadingSpinner } from './LoadingSpinner';
import { SoilData, Crop, FertilizerData, WeatherData } from '../types';
import { 
    extractSoilDataFromImage, 
    getCropRecommendations, 
    getFertilizerRecommendations,
} from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import { ChevronLeftIcon, FertilizerIcon } from './icons';
import { StepIndicator } from './StepIndicator';

interface PageProps {
    onBack: () => void;
}

interface CropAdvisorPageProps extends PageProps {
    weatherData: WeatherData | null;
}

export const CropAdvisorPage: React.FC<CropAdvisorPageProps> = ({ onBack, weatherData }) => {
    type EntryMode = 'upload' | 'manual';

    const [step, setStep] = useState<number>(1);
    const [shcImage, setShcImage] = useState<File | null>(null);
    const [shcImageUrl, setShcImageUrl] = useState<string>('');
    const [soilData, setSoilData] = useState<SoilData | null>(null);
    const [cropRecommendations, setCropRecommendations] = useState<Crop[]>([]);
    const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
    const [fertilizerRecs, setFertilizerRecs] = useState<FertilizerData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [entryMode, setEntryMode] = useState<EntryMode>('upload');
    
    const initialManualSoilData: SoilData = {
        nitrogen: null, phosphorus: null, potassium: null, ph: null,
        organic_carbon: null, electrical_conductivity: null, zinc: null,
        iron: null, manganese: null, copper: null, boron: null,
    };
    const [manualSoilForm, setManualSoilForm] = useState<Record<keyof SoilData, string>>(
        Object.keys(initialManualSoilData).reduce((acc, key) => ({...acc, [key]: ''}), {} as Record<keyof SoilData, string>)
    );

    const handleFileChange = (file: File | null) => {
        if (file) {
            setShcImage(file);
            setShcImageUrl(URL.createObjectURL(file));
            setErrorMessage('');
        }
    };

    const processSoilCard = async () => {
        if (!shcImage) {
            setErrorMessage('Please upload a Soil Health Card image.');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');
        try {
            setLoadingMessage('Analyzing Soil Health Card...');
            const imageBase64 = await fileToBase64(shcImage);
            const extractedSoilData = await extractSoilDataFromImage(imageBase64, shcImage.type);
            setSoilData(extractedSoilData);
            
            setLoadingMessage('Generating crop recommendations...');
            const recommendedCrops = await getCropRecommendations(extractedSoilData, weatherData);
            setCropRecommendations(recommendedCrops);
            
            setStep(2);
        } catch (error) {
            console.error(error);
            setErrorMessage('An error occurred during analysis. Please try again.');
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    };
    
    const handleManualFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setManualSoilForm(prev => ({...prev, [name]: value}));
    };

    const handleManualProcess = async () => {
        const processedData = Object.entries(manualSoilForm).reduce((acc, [key, value]) => {
            acc[key as keyof SoilData] = value === '' ? null : parseFloat(value);
            return acc;
        }, {} as SoilData);
    
        setIsLoading(true);
        setErrorMessage('');
        try {
            setLoadingMessage('Generating crop recommendations...');
            setSoilData(processedData); 
    
            const recommendedCrops = await getCropRecommendations(processedData, weatherData);
            setCropRecommendations(recommendedCrops);
            setStep(2);
        } catch (error) {
            console.error(error);
            setErrorMessage('An error occurred while getting recommendations. Please try again.');
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    };

    const handleCropSelection = async (crop: Crop) => {
        setSelectedCrop(crop);
        setIsLoading(true);
        setErrorMessage('');
        try {
            setLoadingMessage(`Calculating fertilizer plan for ${crop.name}...`);
            const fertilizerData = await getFertilizerRecommendations(crop, soilData!);
            setFertilizerRecs(fertilizerData);
            setStep(3);
        } catch (error) {
            console.error(error);
            setErrorMessage('Failed to get fertilizer recommendations. Please try again.');
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    };

    const startOver = () => {
        setStep(1);
        setShcImage(null);
        setShcImageUrl('');
        setSoilData(null);
        setCropRecommendations([]);
        setSelectedCrop(null);
        setFertilizerRecs(null);
        setErrorMessage('');
        setEntryMode('upload');
        setManualSoilForm(Object.keys(initialManualSoilData).reduce((acc, key) => ({...acc, [key]: ''}), {} as Record<keyof SoilData, string>));
    };
    
    const renderContent = () => {
        if (isLoading) {
            return <LoadingSpinner message={loadingMessage} />;
        }
        
        switch (step) {
            case 1:
                return (
                    <>
                        <div className="flex justify-center mb-6 rounded-lg bg-gray-200 p-1 max-w-sm mx-auto">
                            <button 
                                onClick={() => setEntryMode('upload')}
                                className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${entryMode === 'upload' ? 'bg-white text-brand-green shadow' : 'text-gray-600'}`}
                                aria-pressed={entryMode === 'upload'}
                            >
                                Upload Card
                            </button>
                            <button 
                                onClick={() => setEntryMode('manual')}
                                className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${entryMode === 'manual' ? 'bg-white text-brand-green shadow' : 'text-gray-600'}`}
                                aria-pressed={entryMode === 'manual'}
                            >
                                Enter Manually
                            </button>
                        </div>

                        {entryMode === 'upload' ? (
                            <>
                                <FileUpload onFileChange={handleFileChange} imageUrl={shcImageUrl} />
                                {errorMessage && !shcImage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
                                <div className="text-center mt-6">
                                    <button
                                        onClick={processSoilCard}
                                        disabled={!shcImage || isLoading}
                                        className="bg-brand-green hover:bg-brand-green-dark text-white font-bold py-2 px-6 rounded-full transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        Analyze Soil & Get Recommendations
                                    </button>
                                </div>
                            </>
                        ) : (
                             <>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 p-4 bg-gray-50 rounded-lg border">
                                    {Object.keys(initialManualSoilData).map(key => (
                                        <div key={key}>
                                            <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize">
                                                {key.replace(/_/g, ' ')}
                                            </label>
                                            <input
                                                type="number"
                                                name={key}
                                                id={key}
                                                value={manualSoilForm[key as keyof SoilData]}
                                                onChange={handleManualFormChange}
                                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-green focus:border-brand-green sm:text-sm"
                                                placeholder={key === 'ph' ? 'e.g. 7.5' : 'e.g. 150'}
                                                step="any"
                                            />
                                        </div>
                                    ))}
                                </div>
                                {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
                                <div className="text-center mt-6">
                                    <button 
                                        onClick={handleManualProcess} 
                                        disabled={isLoading} 
                                        className="bg-brand-green hover:bg-brand-green-dark text-white font-bold py-2 px-6 rounded-full transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        Analyze Soil & Get Recommendations
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                );
            case 2:
                return (
                     <div>
                        <div className="mb-8"><DataDisplayCard title="Soil Health Analysis" data={soilData!} /></div>
                        <h3 className="text-xl font-bold text-center text-brand-green-dark mb-4">Select a Crop to Create a Plan</h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                            {cropRecommendations.map(crop => (
                                <CropCard key={crop.name} crop={crop} onSelect={handleCropSelection} />
                            ))}
                        </div>
                         <div className="text-center mt-6">
                            <button onClick={startOver} className="text-sm text-brand-green hover:underline">Start Over</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                     <div>
                         {fertilizerRecs && <RecommendationDetails title={`Fertilizer Plan for ${selectedCrop?.name}`} icon={<FertilizerIcon />} data={fertilizerRecs} />}
                         <div className="text-center mt-8">
                             <button onClick={startOver} className="bg-brand-green hover:bg-brand-green-dark text-white font-bold py-2 px-6 rounded-full">
                                Analyze Another Card
                            </button>
                        </div>
                    </div>
                );
            default: return null;
        }
    }

    const advisorSteps = ['Analyze Soil', 'Get Recommendations', 'Create Plan'];

    return (
        <section className="bg-white p-6 rounded-lg shadow-lg">
             <button onClick={onBack} className="flex items-center text-sm text-brand-green hover:underline mb-6">
                <ChevronLeftIcon className="w-4 h-4 mr-1" />
                Back to Dashboard
            </button>
            <div className="text-center">
                 <h2 className="text-3xl font-bold text-brand-green-dark mb-4">AI Crop Advisor</h2>
                 <p className="text-gray-600 max-w-2xl mx-auto mb-8">Get personalized crop and fertilizer plans based on your soil's health.</p>
            </div>
            
            <div className="mb-12">
                <StepIndicator steps={advisorSteps} currentStep={step} />
            </div>

            {renderContent()}
        </section>
    );
};
