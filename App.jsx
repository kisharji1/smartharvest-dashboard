import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';
import { 
    getLocationNameFromCoords,
    getWeatherData,
    getAlertsAndGuides,
    getCoordsFromLocationName,
    getFarmQueryResponse,
} from './services/geminiService.js';
import { SeedlingIcon, WindIcon, BotIcon, GovernmentIcon } from './components/icons.jsx';
import { AIAssistantPage } from './components/AIAssistantPage.jsx';
import { SchemesPage } from './components/SchemesPage.jsx';
import { CropAdvisorPage } from './components/CropAdvisorPage.jsx';
import { WeatherPage } from './components/WeatherPage.jsx';
import { VoiceChatbot } from './components/VoiceChatbot.jsx';

// --- DASHBOARD ---
const DashboardPage = ({ navigateTo }) => (
    <div>
        <h2 className="text-3xl font-bold text-center text-brand-green-dark mb-8">SmartHarvest Dashboard</h2>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div 
                onClick={() => navigateTo('cropAdvisor')}
                className="bg-white p-8 rounded-lg shadow-lg cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center"
            >
                <SeedlingIcon className="w-16 h-16 text-brand-green mb-4"/>
                <h3 className="text-2xl font-bold text-brand-green-dark mb-2">AI Crop Advisor</h3>
                <p className="text-gray-600">Upload your Soil Health Card to get personalized crop and fertilizer recommendations.</p>
            </div>
            <div 
                onClick={() => navigateTo('weather')}
                className="bg-white p-8 rounded-lg shadow-lg cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center"
            >
                <WindIcon className="w-16 h-16 text-blue-500 mb-4"/>
                <h3 className="text-2xl font-bold text-brand-green-dark mb-2">Weather & Alerts</h3>
                <p className="text-gray-600">Get real-time local weather forecasts and AI-powered farming alerts and guides.</p>
            </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
            <div 
                onClick={() => navigateTo('aiAssistant')}
                className="bg-white p-8 rounded-lg shadow-lg cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-8"
            >
                <BotIcon className="w-16 h-16 text-purple-600 flex-shrink-0"/>
                <div>
                    <h3 className="text-2xl font-bold text-brand-green-dark mb-2">AI Assistant</h3>
                    <p className="text-gray-600">Have a question? Chat with our AI expert for instant answers on farming techniques, pest control, and more in English or Tamil.</p>
                </div>
            </div>
            <div 
                onClick={() => navigateTo('schemes')}
                className="bg-white p-8 rounded-lg shadow-lg cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-8"
            >
                <GovernmentIcon className="w-16 h-16 text-indigo-600 flex-shrink-0"/>
                <div>
                    <h3 className="text-2xl font-bold text-brand-green-dark mb-2">Government Schemes</h3>
                    <p className="text-gray-600">Explore beneficial government schemes for agriculture from both central and state levels.</p>
                </div>
            </div>
        </div>
    </div>
);


// --- MAIN APP CONTENT ---
const MainApp = ({ user, onLogout }) => {
    const [currentPage, setCurrentPage] = useState('dashboard');
    
    // Shared State (Weather & Location)
    const [loadingMessage, setLoadingMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [locationStatus, setLocationStatus] = useState('idle');
    const [locationName, setLocationName] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [alertsAndGuides, setAlertsAndGuides] = useState(null);
    const [isEditingLocation, setIsEditingLocation] = useState(false);
    const [manualLocationInput, setManualLocationInput] = useState('');

    // Chatbot State for AIAssistantPage
    const [chatHistory, setChatHistory] = useState([
        { sender: 'ai', text: "Hello! I'm your AI farm assistant. Ask me anything about agriculture in English or Tamil." }
    ]);
    const [isChatProcessing, setIsChatProcessing] = useState(false);
    const [language, setLanguage] = useState('en-US');

    // Load saved or default location on initial app load
    useEffect(() => {
        const loadInitialLocation = async () => {
            const savedLocationJSON = localStorage.getItem('userLocation');
            if (savedLocationJSON) {
                const savedLocation = JSON.parse(savedLocationJSON);
                await fetchWeatherForLocation(savedLocation);
            } else {
                setLocationStatus('detecting');
                setLoadingMessage('Loading default weather for Coimbatore...');
                setErrorMessage('');
                try {
                    const coimbatoreLocation = await getCoordsFromLocationName('Coimbatore');
                    if (coimbatoreLocation) {
                        localStorage.setItem('userLocation', JSON.stringify(coimbatoreLocation));
                        await fetchWeatherForLocation(coimbatoreLocation);
                    } else {
                        setErrorMessage('Could not find default location "Coimbatore". Please search for a location manually.');
                        setLocationStatus('error');
                    }
                } catch (error) {
                    console.error("Error fetching default location data:", error);
                    setErrorMessage('An error occurred while loading the default location.');
                    setLocationStatus('error');
                } finally {
                    setLoadingMessage('');
                }
            }
        };

        loadInitialLocation();
    }, []);

    const fetchWeatherForLocation = async (locationData) => {
        setLocationStatus('detecting');
        setLoadingMessage(`Fetching weather for ${locationData.displayName}...`);
        setErrorMessage('');
        try {
            setLocationName(locationData.displayName);
            const weather = await getWeatherData(locationData);
            setWeatherData(weather);
            const alerts = await getAlertsAndGuides(weather);
            setAlertsAndGuides(alerts);
            setLocationStatus('success');
            setIsEditingLocation(false);
        } catch (error) {
            console.error("Error fetching weather data:", error);
            setErrorMessage('Failed to fetch weather data for your saved location.');
            setLocationStatus('error');
        } finally {
            setLoadingMessage('');
        }
    };

    const requestLocation = () => {
        localStorage.removeItem('userLocation');
        setLocationStatus('detecting');
        setErrorMessage('');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const coords = { latitude: position.coords.latitude, longitude: position.coords.longitude };
                try {
                    setLoadingMessage('Fetching weather data...');
                    const name = await getLocationNameFromCoords(coords);
                    setLocationName(name);
                    const weather = await getWeatherData(coords);
                    setWeatherData(weather);
                    const alerts = await getAlertsAndGuides(weather);
                    setAlertsAndGuides(alerts);
                    setLocationStatus('success');
                } catch (error) {
                    console.error("Error fetching weather data:", error);
                    setErrorMessage('Failed to fetch weather data.');
                    setLocationStatus('error');
                } finally {
                    setLoadingMessage('');
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                setLocationStatus(error.code === error.PERMISSION_DENIED ? 'denied' : 'error');
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const searchForLocation = async (locationName) => {
        if (!locationName.trim()) return false;
    
        setLocationStatus('detecting');
        setErrorMessage('');
        let success = false;
        try {
            setLoadingMessage(`Searching for ${locationName}...`);
            const locationData = await getCoordsFromLocationName(locationName);
            if (locationData) {
                localStorage.setItem('userLocation', JSON.stringify(locationData));
                await fetchWeatherForLocation(locationData);
                setManualLocationInput('');
                success = true;
            } else {
                setErrorMessage(`Could not find location: "${locationName}". Please try again.`);
                setLocationStatus('error');
            }
        } catch (error) {
            console.error("Error fetching manual location data:", error);
            setErrorMessage('An error occurred while searching for the location.');
            setLocationStatus('error');
        } finally {
            setLoadingMessage('');
        }
        return success;
    }
    
    const handleManualLocationSearch = async (e) => {
        e.preventDefault();
        await searchForLocation(manualLocationInput);
    };

    const speak = (text, lang) => {
        try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            window.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error("Speech synthesis failed.", error);
        }
    };

    const handleSendMessage = async (message) => {
        if (!message.trim()) return;
        setChatHistory(prev => [...prev, { sender: 'user', text: message }]);
        setIsChatProcessing(true);
    
        try {
            const responseText = await getFarmQueryResponse(message, language);
    
            setChatHistory(prev => [...prev, { sender: 'ai', text: responseText }]);
            speak(responseText, language);
    
        } catch (error) {
            console.error("Error from AI Assistant:", error);
            const errorMessage = "Sorry, I'm having trouble understanding. Please try again.";
            setChatHistory(prev => [...prev, { sender: 'ai', text: errorMessage }]);
            speak(errorMessage, language);
        } finally {
            setIsChatProcessing(false);
        }
    };

    const handleVoiceCommand = (command) => {
        speak(command.spokenResponse, 'en-US');
        if (command.command === 'navigate' && command.page) {
            setCurrentPage(command.page);
        }
    };
    
    const renderPage = () => {
        switch(currentPage) {
            case 'cropAdvisor':
                return <CropAdvisorPage onBack={() => setCurrentPage('dashboard')} weatherData={weatherData} />;
            case 'weather':
                const weatherProps = {
                    onBack: () => setCurrentPage('dashboard'),
                    locationStatus, locationName, weatherData, alertsAndGuides,
                    errorMessage, loadingMessage, requestLocation, handleManualLocationSearch,
                    manualLocationInput, setManualLocationInput, isEditingLocation, setIsEditingLocation,
                    setLocationStatus, setErrorMessage,
                };
                return <WeatherPage {...weatherProps} />;
            case 'aiAssistant':
                return <AIAssistantPage 
                    onBack={() => setCurrentPage('dashboard')}
                    onSendMessage={handleSendMessage} 
                    chatHistory={chatHistory}
                    isProcessing={isChatProcessing}
                    language={language}
                    setLanguage={setLanguage}
                />;
            case 'schemes':
                return <SchemesPage onBack={() => setCurrentPage('dashboard')} />;
            case 'dashboard':
            default:
                return <DashboardPage navigateTo={setCurrentPage} />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[rgba(240,255,240,0.85)]">
            <Header onLogout={onLogout} user={user} />
            <main className="flex-grow container mx-auto px-4 py-8">
                {renderPage()}
            </main>
            <Footer />
            <VoiceChatbot onCommand={handleVoiceCommand} />
        </div>
    );
};

// --- AUTH GATEWAY ---
const App = () => {
    return <MainApp user={null} onLogout={() => {}} />;
}

export default App;