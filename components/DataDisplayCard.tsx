import React from 'react';
import { SoilData, WeatherData } from '../types';
import { ThermometerIcon, DropletsIcon, WindIcon, SunIcon, CloudIcon, CloudRainIcon } from './icons';

interface DataDisplayCardProps {
    title: string;
    data: SoilData | WeatherData;
}

const formatKey = (key: string) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const WeatherIcon: React.FC<{condition: string, className?: string}> = ({ condition, className="w-6 h-6" }) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('rain') || lowerCondition.includes('shower')) return <CloudRainIcon className={className} />;
    if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) return <CloudIcon className={className} />;
    if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) return <SunIcon className={className} />;
    return <CloudIcon className={className} />;
}

const renderSoilData = (data: SoilData) => (
    <div className="grid grid-cols-2 gap-x-4">
        {Object.entries(data).map(([key, value]) => (
             <div key={key} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                <span className="text-gray-600">{formatKey(key)}</span>
                <span className="font-medium text-gray-800">{value ?? 'N/A'}</span>
            </div>
        ))}
    </div>
);

const renderCurrentWeather = (data: WeatherData['current']) => (
    <div className="flex justify-around items-center text-center">
        <div>
            <WeatherIcon condition={data.condition} className="w-12 h-12 mx-auto text-yellow-500" />
            <p className="font-bold text-2xl mt-1">{data.temp}°C</p>
            <p className="text-sm text-gray-500">{data.condition}</p>
        </div>
        <div className="space-y-3">
             <div className="flex items-center">
                <DropletsIcon className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-sm">{data.humidity}% Humidity</span>
            </div>
             <div className="flex items-center">
                <WindIcon className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-sm">{data.wind_speed} kph Wind</span>
            </div>
        </div>
    </div>
);

const renderForecast = (data: WeatherData['forecast']) => (
    <div className="space-y-2">
        {data.map(day => (
            <div key={day.day} className="grid grid-cols-5 items-center text-sm p-1.5 rounded-md hover:bg-gray-50 gap-2">
                <span className="font-medium col-span-1 truncate">{day.day}</span>
                <div className="flex items-center gap-1 col-span-2">
                    <WeatherIcon condition={day.condition} className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                    <span className="text-gray-600 truncate hidden sm:inline">{day.condition}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 col-span-1 justify-center">
                    <DropletsIcon className="w-4 h-4 text-blue-400" />
                    <span>{day.humidity}%</span>
                </div>
                <span className="font-semibold col-span-1 text-right">{day.high_temp}° / {day.low_temp}°</span>
            </div>
        ))}
    </div>
);

export const DataDisplayCard: React.FC<DataDisplayCardProps> = ({ title, data }) => {
    const isWeatherData = (d: any): d is WeatherData => 'current' in d && 'forecast' in d;

    return (
        <div className="bg-white p-4 rounded-lg shadow-md h-full">
            <h3 className="text-lg font-bold text-brand-green-dark mb-4">{title}</h3>
            {isWeatherData(data) ? (
                <div className="space-y-6">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-500 mb-2">Now</h4>
                        {renderCurrentWeather(data.current)}
                    </div>
                     <div>
                        <h4 className="text-sm font-semibold text-gray-500 mb-2">Next 7 Days</h4>
                        {renderForecast(data.forecast)}
                    </div>
                </div>
            ) : (
                renderSoilData(data as SoilData)
            )}
        </div>
    );
};