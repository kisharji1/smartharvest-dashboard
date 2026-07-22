import React, { useState, useEffect, useRef } from 'react';
import { MicrophoneIcon, SendIcon, ChevronLeftIcon } from './icons.jsx';

// Check for SpeechRecognition API
const SpeechRecognition = (window).SpeechRecognition || (window).webkitSpeechRecognition;

export const AIAssistantPage = ({ onBack, onSendMessage, chatHistory, isProcessing, language, setLanguage }) => {
    const [isListening, setIsListening] = useState(false);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [chatHistory]);

    useEffect(() => {
        if (!SpeechRecognition) return;

        if (!recognitionRef.current) {
            const instance = new SpeechRecognition();
            instance.continuous = false;
            instance.interimResults = false;
            recognitionRef.current = instance;
        }
        const recognition = recognitionRef.current;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            onSendMessage(transcript);
        };
        
        return () => {
            if (recognition) {
                recognition.stop();
            }
        };
    }, [onSendMessage]);

    const handleMicClick = () => {
        const recognition = recognitionRef.current;
        if (!recognition) {
            alert("Voice recognition is not supported by your browser.");
            return;
        }
        if (isListening) {
            recognition.stop();
        } else {
            recognition.lang = language;
            recognition.start();
        }
    };
    
    const handleSend = (e) => {
        e.preventDefault();
        if (inputText.trim()) {
            onSendMessage(inputText);
            setInputText('');
        }
    }

    return (
        <section className="bg-white rounded-lg shadow-lg flex flex-col h-[calc(100vh-10rem)]">
            <header className="flex flex-col bg-brand-green text-white rounded-t-lg">
                <div className="flex justify-between items-center p-4">
                    <button onClick={onBack} className="flex items-center text-sm hover:underline">
                        <ChevronLeftIcon className="w-4 h-4 mr-1" />
                        Back to Dashboard
                    </button>
                    <h2 className="text-xl font-bold">AI Assistant</h2>
                     {/* Placeholder to balance the title */}
                    <div className="w-36"></div>
                </div>
                 <div className="flex border-t border-green-700">
                    <button onClick={() => setLanguage('en-US')} className={`flex-1 p-2 text-sm font-semibold transition-colors ${language === 'en-US' ? 'bg-white text-brand-green' : 'bg-brand-green hover:bg-brand-green-dark text-white'}`}>English</button>
                    <button onClick={() => setLanguage('ta-IN')} className={`flex-1 p-2 text-sm font-semibold transition-colors ${language === 'ta-IN' ? 'bg-white text-brand-green' : 'bg-brand-green hover:bg-brand-green-dark text-white'}`}>தமிழ்</button>
                </div>
            </header>
            <main className="flex-grow p-4 overflow-y-auto bg-gray-50">
                <div className="space-y-3">
                    {chatHistory.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xl text-sm p-3 rounded-lg shadow ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                     {isProcessing && (
                         <div className="flex justify-start">
                             <div className="bg-white text-gray-800 p-3 rounded-lg shadow">
                                 <div className="flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></span>
                                </div>
                             </div>
                         </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </main>
            <footer className="p-3 border-t bg-white rounded-b-lg">
                 <form onSubmit={handleSend} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-grow p-2 border rounded-full focus:ring-2 focus:ring-brand-green focus:outline-none disabled:bg-gray-100"
                        disabled={isProcessing}
                        aria-label="Chat input"
                    />
                     <button
                        type="button"
                        onClick={handleMicClick}
                        disabled={isProcessing}
                        className={`flex-shrink-0 w-10 h-10 flex justify-center items-center rounded-full text-white transition-colors ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-brand-green hover:bg-brand-green-dark'} disabled:bg-gray-400 disabled:cursor-not-allowed`}
                        aria-label={isListening ? 'Stop listening' : 'Start listening'}
                    >
                        <MicrophoneIcon className="w-5 h-5" />
                    </button>
                    <button
                        type="submit"
                        disabled={!inputText.trim() || isProcessing}
                        className="flex-shrink-0 w-10 h-10 flex justify-center items-center rounded-full bg-brand-green text-white transition-colors hover:bg-brand-green-dark disabled:bg-gray-400 disabled:cursor-not-allowed"
                        aria-label="Send message"
                    >
                        <SendIcon className="w-5 h-5" />
                    </button>
                </form>
            </footer>
        </section>
    );
};