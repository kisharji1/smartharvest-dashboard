import React from 'react';
import { CheckCircleIcon } from './icons.jsx';

export const StepIndicator = ({ steps, currentStep }) => {
    return (
        <nav aria-label="Progress">
            <ol role="list" className="flex items-center justify-center">
                {steps.map((step, stepIdx) => {
                    const stepNumber = stepIdx + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;

                    return (
                        <li key={step} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                            {isCompleted ? (
                                <>
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="h-0.5 w-full bg-brand-green" />
                                    </div>
                                    <span className="relative flex h-8 w-8 items-center justify-center bg-brand-green rounded-full">
                                        <CheckCircleIcon className="h-5 w-5 text-white" aria-hidden="true" />
                                    </span>
                                </>
                            ) : isCurrent ? (
                                <>
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="h-0.5 w-full bg-gray-200" />
                                    </div>
                                    <span className="relative flex h-8 w-8 items-center justify-center bg-white border-2 border-brand-green rounded-full" aria-current="step">
                                        <span className="h-2.5 w-2.5 bg-brand-green rounded-full" aria-hidden="true" />
                                    </span>
                                </>
                            ) : (
                                <>
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="h-0.5 w-full bg-gray-200" />
                                    </div>
                                    <span className="group relative flex h-8 w-8 items-center justify-center bg-white border-2 border-gray-300 rounded-full">
                                        <span className="h-2.5 w-2.5 bg-transparent rounded-full" aria-hidden="true" />
                                    </span>
                                </>
                            )}
                             <span className="absolute top-10 w-max -translate-x-1/2 left-1/2 text-center text-xs font-medium text-gray-600">{step}</span>
                        </li>
                    )
                })}
            </ol>
        </nav>
    );
};