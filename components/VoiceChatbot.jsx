import React, { useState, useEffect, useRef } from 'react';
import { MicrophoneIcon } from './icons.jsx';
import { interpretVoiceCommand } from '../services/geminiService.js';

const SpeechRecognition = (window).SpeechRecognition || (window).webkitSpeechRecognition;

export const VoiceChatbot = ({ onCommand }) => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        if (!SpeechRecognition) {
            console.warn("Speech recognition not supported by this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.onresult = async (event) => {
            const transcript = event.results[0][0].transcript;
            try {
                const command = await interpretVoiceCommand(transcript);
                onCommand(command);
            } catch (error) {
                console.error("Error interpreting voice command:", error);
                const fallbackCommand = {
                    command: 'navigate',
                    page: 'dashboard',
                    spokenResponse: "Sorry, I had trouble understanding that."
                };
                onCommand(fallbackCommand);
            }
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [onCommand]);

    const handleMicClick = () => {
        if (!recognitionRef.current) {
            alert("Voice recognition is not available.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    };
    
    return (
        <button
            onClick={handleMicClick}
            className={`fixed bottom-4 left-4 w-16 h-16 text-white rounded-full flex items-center justify-center shadow-lg z-40 transition-transform transform hover:scale-110 ${isListening ? 'bg-red-500 animate-pulse' : 'bg-brand-green hover:bg-brand-green-dark'}`}
            aria-label={isListening ? 'Stop listening for command' : 'Start voice command'}
        >
            <MicrophoneIcon className="w-8 h-8" />
        </button>
    );
};