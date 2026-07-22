import React from 'react';
import { LoadingSpinner } from './LoadingSpinner.jsx';
import { ChevronLeftIcon, LocateIcon, SearchIcon, ShieldAlertIcon } from './icons.jsx';
import { DataDisplayCard } from './DataDisplayCard.jsx';
import { RecommendationDetails } from './RecommendationDetails.jsx';

export const WeatherPage = (props) => {
    
    const renderWeatherWidget = () => {
        switch (props.locationStatus) {
            case 'idle':
                return (
                    <div className="text-center p-8">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Get Local Weather & Alerts</h3>
                        <button onClick={props.requestLocation} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full inline-flex items-center">
                            <LocateIcon className="w-5 h-5 mr-2" /> Detect My Location
                        </button>
                    </div>
                );
            case 'detecting':
                return <LoadingSpinner message={props.loadingMessage || "Detecting location & fetching weather..."} />;
            case 'denied':
                return (
                     <div className="text-center p-6 bg-red-50 rounded-lg">
                        <h3 className="font-bold text-red-700">Location Access Denied</h3>
                        <p className="text-sm text-red-600 mt-2">To get weather forecasts, please enable location permissions in your browser settings and try again.</p>
                         <button onClick={props.requestLocation} className="mt-4 text-sm text-blue-600 hover:underline">Try Again</button>
                    </div>
                );
            case 'error':
                 return (
                     <div className="text-center p-6 bg-red-50 rounded-lg">
                        <h3 className="font-bold text-red-700">Location Unavailable</h3>
                        <p className="text-sm text-red-600 mt-2">{props.errorMessage || 'Could not fetch your location. Please check your connection and try again.'}</p>
                         <button onClick={props.requestLocation} className="mt-4 text-sm text-blue-600 hover:underline">Try Auto-Detect</button>
                         <span className="text-sm text-gray-500 mx-2">or</span>
                         <button onClick={() => { props.setIsEditingLocation(true); props.setLocationStatus('success'); props.setErrorMessage(''); }} className="text-sm text-blue-600 hover:underline">Enter Manually</button>
                    </div>
                );
            case 'success':
                return (
                    <div>
                         {props.isEditingLocation ? (
                            <form onSubmit={props.handleManualLocationSearch} className="p-4">
                                <h3 className="text-xl font-bold text-center text-brand-green-dark mb-4">Enter Location</h3>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={props.manualLocationInput}
                                        onChange={(e) => props.setManualLocationInput(e.target.value)}
                                        placeholder="e.g., Coimbatore"
                                        className="flex-grow p-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:outline-none"
                                        aria-label="Enter city name"
                                    />
                                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-2 rounded-md inline-flex items-center justify-center" aria-label="Search">
                                        <SearchIcon className="w-5 h-5" />
                                    </button>
                                </div>
                                {props.weatherData && <button type="button" onClick={() => props.setIsEditingLocation(false)} className="text-sm text-gray-500 hover:underline mt-2 w-full text-center">Cancel</button>}
                            </form>
                        ) : (
                            <>
                                <div className="flex justify-center items-baseline text-center mb-4 gap-2">
                                    <h3 className="text-xl font-bold text-brand-green-dark" title={props.locationName}>
                                        Weather for {props.locationName.split(',')[0]}
                                    </h3>
                                    <button onClick={() => props.setIsEditingLocation(true)} className="text-sm text-blue-600 hover:underline flex-shrink-0">(change)</button>
                                </div>
                                <div className="space-y-6">
                                {props.weatherData && <DataDisplayCard title="Current Conditions" data={props.weatherData} />}
                                {props.alertsAndGuides && <RecommendationDetails title="Alerts & Guides" icon={<ShieldAlertIcon />} data={props.alertsAndGuides} />}
                                </div>
                            </>
                        )}
                    </div>
                )
        }
    }

    return (
        <section className="bg-white p-6 rounded-lg shadow-lg">
            <button onClick={props.onBack} className="flex items-center text-sm text-brand-green hover:underline mb-6">
                <ChevronLeftIcon className="w-4 h-4 mr-1" />
                Back to Dashboard
            </button>
            {renderWeatherWidget()}
        </section>
    );
}