import React, { useState } from 'react';
import { schemesData } from '../data/schemes';
import { Scheme, Language } from '../types';
import { SchemeDetailsPage } from './SchemeDetailsPage';
import { ChevronLeftIcon, GovernmentIcon } from './icons';

interface SchemesPageProps {
    onBack: () => void;
}

export const SchemesPage: React.FC<SchemesPageProps> = ({ onBack }) => {
    const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
    const [activeTab, setActiveTab] = useState<'central' | 'state'>('central');
    const [language, setLanguage] = useState<Language>('en-US');

    const centralSchemes = schemesData.filter(s => s.type === 'central');
    const stateSchemes = schemesData.filter(s => s.type === 'state');

    if (selectedScheme) {
        return <SchemeDetailsPage scheme={selectedScheme} onBack={() => setSelectedScheme(null)} language={language} />;
    }

    return (
        <section className="bg-white p-6 rounded-lg shadow-lg">
            <button onClick={onBack} className="flex items-center text-sm text-brand-green hover:underline mb-6">
                <ChevronLeftIcon className="w-4 h-4 mr-1" />
                Back to Dashboard
            </button>
            <div className="text-center mb-4">
                <GovernmentIcon className="w-16 h-16 text-indigo-500 mx-auto mb-2" />
                <h2 className="text-3xl font-bold text-brand-green-dark">
                    {language === 'en-US' ? 'Government Schemes for Farmers' : 'விவசாயிகளுக்கான அரசாங்க திட்டங்கள்'}
                </h2>
                <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                    {language === 'en-US' 
                        ? 'Discover a comprehensive list of schemes from both Central and State Governments designed to support and uplift the farming community.'
                        : 'விவசாய சமூகத்தை ஆதரிப்பதற்கும் மேம்படுத்துவதற்கும் வடிவமைக்கப்பட்ட மத்திய மற்றும் மாநில அரசுகளின் திட்டங்களின் விரிவான பட்டியலைக் கண்டறியவும்.'
                    }
                </p>
            </div>
            
            <div className="flex justify-center mb-4 rounded-lg bg-gray-200 p-1 max-w-xs mx-auto">
                <button onClick={() => setLanguage('en-US')} className={`flex-1 p-2 text-sm font-semibold rounded-md transition-colors ${language === 'en-US' ? 'bg-white text-brand-green shadow' : 'bg-transparent text-gray-600'}`}>English</button>
                <button onClick={() => setLanguage('ta-IN')} className={`flex-1 p-2 text-sm font-semibold rounded-md transition-colors ${language === 'ta-IN' ? 'bg-white text-brand-green shadow' : 'bg-transparent text-gray-600'}`}>தமிழ்</button>
            </div>

            <div className="flex justify-center border-b mb-6">
                <button
                    onClick={() => setActiveTab('central')}
                    aria-pressed={activeTab === 'central'}
                    className={`px-4 md:px-6 py-3 text-base md:text-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green rounded-t-md ${activeTab === 'central' ? 'border-b-2 border-brand-green text-brand-green' : 'text-gray-500 hover:text-brand-green'}`}
                >
                    {language === 'en-US' ? 'Central' : 'மத்திய'} ({centralSchemes.length})
                </button>
                <button
                    onClick={() => setActiveTab('state')}
                    aria-pressed={activeTab === 'state'}
                    className={`px-4 md:px-6 py-3 text-base md:text-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green rounded-t-md ${activeTab === 'state' ? 'border-b-2 border-brand-green text-brand-green' : 'text-gray-500 hover:text-brand-green'}`}
                >
                    {language === 'en-US' ? 'State' : 'மாநில'} ({stateSchemes.length})
                </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(activeTab === 'central' ? centralSchemes : stateSchemes).map(scheme => (
                    <div 
                        key={scheme.id} 
                        onClick={() => setSelectedScheme(scheme)} 
                        className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-lg hover:border-brand-green transition-all transform hover:-translate-y-1 flex flex-col"
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => e.key === 'Enter' && setSelectedScheme(scheme)}
                    >
                        <h3 className="font-bold text-lg text-brand-green-dark">{language === 'ta-IN' ? scheme.name_ta : scheme.name}</h3>
                        <p className="text-sm text-gray-600 mt-2 flex-grow">
                            {(language === 'ta-IN' ? scheme.definition_ta : scheme.definition).substring(0, 120)}...
                        </p>
                        <span className="text-sm text-brand-green font-semibold mt-4 self-start">
                             {language === 'en-US' ? 'View Details' : 'விவரங்களைக் காண்க'} &rarr;
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
};