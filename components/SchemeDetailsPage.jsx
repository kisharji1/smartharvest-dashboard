import React from 'react';
import { ChevronLeftIcon, CheckCircleIcon, TargetIcon, BookOpenIcon, InfoIcon, AlertTriangleIcon } from './icons.jsx';

const DetailSection = ({ title, icon, children }) => (
    <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center mb-3">
            {icon && <span className="text-brand-green mr-3 flex-shrink-0">{icon}</span>}
            <h3 className="text-xl font-bold text-brand-green-dark">{title}</h3>
        </div>
        <div className="pl-0 md:pl-9 text-gray-700 space-y-2 prose prose-sm max-w-none">
            {children}
        </div>
    </div>
);


const renderSimpleList = (items) => (
    <ul className="list-disc list-outside ml-4 space-y-2">
        {items.map((item, index) => <li key={index}>{item}</li>)}
    </ul>
);

const renderComplexList = (items, lang) => (
    <ul className="list-disc list-outside ml-4 space-y-3">
        {items.map((item, index) => {
            const isTamil = lang === 'ta-IN';
            if ('details' in item) { // SchemeBenefit
                const title = isTamil ? item.title_ta : item.title;
                const details = isTamil && item.details_ta ? item.details_ta : item.details;
                return (
                    <li key={index}>
                        <strong>{title}</strong>
                        <ul className="list-circle list-outside ml-4 mt-1 space-y-1">
                            {details.map((d, i) => <li key={i}>{d}</li>)}
                        </ul>
                    </li>
                );
            }
             if ('criteria' in item) { // SchemeEligibility
                const title = isTamil ? item.title_ta : item.title;
                const criteria = isTamil && item.criteria_ta ? item.criteria_ta : item.criteria;
                return (
                    <li key={index}>
                        <strong>{title}</strong>
                        <ul className="list-circle list-outside ml-4 mt-1 space-y-1">
                            {criteria.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                    </li>
                );
            }
             if ('description' in item) { // SchemeIntervention
                 const title = isTamil ? item.title_ta : item.title;
                 const description = isTamil && item.description_ta ? item.description_ta : item.description;
                 return <li key={index}><strong>{title}:</strong> {description}</li>
             }
            return null;
        })}
    </ul>
);


export const SchemeDetailsPage = ({ scheme, onBack, language }) => {
    const isTamil = language === 'ta-IN';
    
    // Helper to get translated titles
    const getTitle = (en, ta) => isTamil ? ta : en;
    
    return (
        <section className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
            <button onClick={onBack} className="flex items-center text-sm text-brand-green hover:underline mb-6">
                <ChevronLeftIcon className="w-4 h-4 mr-1" />
                {getTitle('Back to Schemes List', 'திட்டங்கள் பட்டியலுக்குத் திரும்புக')}
            </button>
            <header className="text-center mb-8">
                <h2 className="text-3xl font-bold text-brand-green-dark mb-2">{isTamil ? scheme.name_ta : scheme.name}</h2>
                <p className="text-center text-sm font-semibold uppercase text-gray-500 tracking-wider">
                    {scheme.type === 'central' ? getTitle('Central Government Scheme', 'மத்திய அரசுத் திட்டம்') : getTitle('State Government Scheme', 'மாநில அரசுத் திட்டம்')}
                </p>
            </header>

            <DetailSection title={getTitle('Definition', 'வரையறை')} icon={<BookOpenIcon className="w-6 h-6"/>}>
                <p>{isTamil ? scheme.definition_ta : scheme.definition}</p>
            </DetailSection>

            {scheme.objectives && <DetailSection title={getTitle('Objectives', 'குறிக்கோள்கள்')} icon={<TargetIcon className="w-6 h-6"/>}>{renderSimpleList(isTamil && scheme.objectives_ta ? scheme.objectives_ta : scheme.objectives)}</DetailSection>}
            {scheme.usage && <DetailSection title={getTitle('Usage', 'பயன்பாடு')} icon={<InfoIcon className="w-6 h-6"/>}><p>{isTamil && scheme.usage_ta ? scheme.usage_ta : scheme.usage}</p></DetailSection>}
            {scheme.advantages && <DetailSection title={getTitle('Advantages', 'நன்மைகள்')} icon={<CheckCircleIcon className="w-6 h-6"/>}>{renderSimpleList(isTamil && scheme.advantages_ta ? scheme.advantages_ta : scheme.advantages)}</DetailSection>}
            {scheme.benefits && <DetailSection title={getTitle('Benefits', 'பலன்கள்')} icon={<CheckCircleIcon className="w-6 h-6"/>}>{typeof scheme.benefits[0] === 'string' ? renderSimpleList(isTamil && scheme.benefits_ta ? scheme.benefits_ta : scheme.benefits) : renderComplexList(scheme.benefits, language)}</DetailSection>}
            {scheme.keyFeatures && <DetailSection title={getTitle('Key Features', 'முக்கிய அம்சங்கள்')} icon={<InfoIcon className="w-6 h-6"/>}>{renderSimpleList(isTamil && scheme.keyFeatures_ta ? scheme.keyFeatures_ta : scheme.keyFeatures)}</DetailSection>}
            {scheme.features && <DetailSection title={getTitle('Features', 'அம்சங்கள்')} icon={<InfoIcon className="w-6 h-6"/>}>{renderSimpleList(isTamil && scheme.features_ta ? scheme.features_ta : scheme.features)}</DetailSection>}
            {scheme.interventions && <DetailSection title={getTitle('Key Components / Interventions', 'முக்கிய கூறுகள் / தலையீடுகள்')} icon={<InfoIcon className="w-6 h-6"/>}>{renderComplexList(scheme.interventions, language)}</DetailSection>}
            {scheme.eligibility && <DetailSection title={getTitle('Eligibility', 'தகுதி')} icon={<CheckCircleIcon className="w-6 h-6"/>}>{typeof scheme.eligibility[0] === 'string' ? renderSimpleList(isTamil && scheme.eligibility_ta ? scheme.eligibility_ta : scheme.eligibility) : renderComplexList(scheme.eligibility, language)}</DetailSection>}
            {scheme.additionalCriteria && <DetailSection title={getTitle('Additional Criteria', 'கூடுதல் தகுதிகள்')} icon={<CheckCircleIcon className="w-6 h-6"/>}>{renderSimpleList(isTamil && scheme.additionalCriteria_ta ? scheme.additionalCriteria_ta : scheme.additionalCriteria)}</DetailSection>}
            {scheme.applicationProcess && <DetailSection title={getTitle('Application Process', 'விண்ணப்ப செயல்முறை')} icon={<InfoIcon className="w-6 h-6"/>}>{renderSimpleList(isTamil && scheme.applicationProcess_ta ? scheme.applicationProcess_ta : scheme.applicationProcess)}</DetailSection>}
            {scheme.challenges && <DetailSection title={getTitle('Challenges', 'சவால்கள்')} icon={<AlertTriangleIcon className="w-6 h-6"/>}>{renderSimpleList(isTamil && scheme.challenges_ta ? scheme.challenges_ta : scheme.challenges)}</DetailSection>}

        </section>
    );
};