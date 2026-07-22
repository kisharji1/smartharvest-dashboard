import React from 'react';
import { FertilizerData, AlertsData, Alert, Guide } from '../types';
import { BookOpenIcon, BugIcon, CloudLightningIcon, ClockIcon, ScaleIcon, LayersIcon } from './icons';

interface RecommendationDetailsProps {
    title: string;
    icon: React.ReactNode;
    data: FertilizerData | AlertsData;
}

const isAlertsData = (d: any): d is AlertsData => 'alerts' in d && 'guides' in d;

const AlertItem: React.FC<{ alert: Alert }> = ({ alert }) => {
    const severityClasses = {
        Low: 'border-yellow-400 bg-yellow-50',
        Medium: 'border-orange-400 bg-orange-50',
        High: 'border-red-400 bg-red-50',
    };
    const iconType = {
        Pest: <BugIcon className="w-5 h-5 text-red-600" />,
        Disease: <BugIcon className="w-5 h-5 text-green-600" />,
        Weather: <CloudLightningIcon className="w-5 h-5 text-blue-600" />,
        Other: <BookOpenIcon className="w-5 h-5 text-gray-600" />
    };

    return (
        <div className={`p-3 rounded-md border-l-4 ${severityClasses[alert.severity]} flex items-start`}>
             <div className="flex-shrink-0 pt-0.5">{iconType[alert.type]}</div>
             <div className="ml-3">
                <p className="font-semibold text-sm text-gray-800">{alert.type} Alert ({alert.severity})</p>
                <p className="text-sm text-gray-600">{alert.description}</p>
            </div>
        </div>
    )
}

const GuideItem: React.FC<{ guide: Guide }> = ({ guide }) => (
    <div className="p-3 rounded-md bg-blue-50 border-l-4 border-blue-400">
        <p className="font-semibold text-sm text-blue-800">{guide.activity} ({guide.timing})</p>
        <p className="text-sm text-blue-700">{guide.reason}</p>
    </div>
);


export const RecommendationDetails: React.FC<RecommendationDetailsProps> = ({ title, icon, data }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md w-full">
            <div className="flex items-center mb-4">
                <div className="text-brand-green">{icon}</div>
                <h3 className="text-lg font-bold text-brand-green-dark ml-3">{title}</h3>
            </div>
            
            {isAlertsData(data) ? (
                <div className="space-y-4">
                    {data.alerts.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-gray-600 text-sm mb-2">Alerts</h4>
                            <div className="space-y-2">
                                {data.alerts.map((alert, i) => <AlertItem key={i} alert={alert} />)}
                            </div>
                        </div>
                    )}
                    {data.guides.length > 0 && (
                         <div>
                            <h4 className="font-semibold text-gray-600 text-sm mb-2">Guides</h4>
                            <div className="space-y-2">
                                {data.guides.map((guide, i) => <GuideItem key={i} guide={guide} />)}
                            </div>
                        </div>
                    )}
                     {data.alerts.length === 0 && data.guides.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">No specific alerts or guides at this time.</p>
                     )}
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="space-y-4">
                        {data.recommendations.map((rec, index) => (
                           <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <p className="font-bold text-lg text-brand-green-dark mb-4">{rec.fertilizer}</p>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <ScaleIcon className="w-5 h-5 text-gray-500 mr-3" />
                                        <div>
                                            <span className="text-xs font-semibold text-gray-500 uppercase">Quantity</span>
                                            <p className="text-sm text-gray-800 font-medium">{rec.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <ClockIcon className="w-5 h-5 text-gray-500 mr-3" />
                                        <div>
                                            <span className="text-xs font-semibold text-gray-500 uppercase">Timing</span>
                                            <p className="text-sm text-gray-800 font-medium">{rec.timing}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <LayersIcon className="w-5 h-5 text-gray-500 mr-3" />
                                        <div>
                                            <span className="text-xs font-semibold text-gray-500 uppercase">Method</span>
                                            <p className="text-sm text-gray-800 font-medium">{rec.method}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {data.generalAdvice && (
                        <div className="mt-6 p-4 bg-brand-light rounded-md border-l-4 border-brand-green flex items-start">
                             <div className="flex-shrink-0 text-brand-green pt-0.5">
                                <BookOpenIcon className="w-5 h-5" />
                            </div>
                            <div className="ml-3">
                                <h4 className="font-semibold text-gray-700">General Advice</h4>
                                <p className="text-sm text-gray-600 mt-1">{data.generalAdvice}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};