import { GoogleGenAI, Type } from "@google/genai";

// FIX: Initialize GoogleGenAI with API_KEY from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- SCHEMAS ---

const commandSchema = {
    type: Type.OBJECT,
    properties: {
        command: { type: Type.STRING, enum: ['navigate'] },
        page: { type: Type.STRING, enum: ['dashboard', 'cropAdvisor', 'weather', 'aiAssistant', 'schemes'] },
        spokenResponse: { type: Type.STRING, description: 'A brief confirmation message to be spoken to the user.' }
    },
    required: ['command', 'page', 'spokenResponse']
};

const soilDataSchema = {
    type: Type.OBJECT,
    properties: {
        nitrogen: { type: Type.NUMBER, nullable: true },
        phosphorus: { type: Type.NUMBER, nullable: true },
        potassium: { type: Type.NUMBER, nullable: true },
        ph: { type: Type.NUMBER, nullable: true },
        organic_carbon: { type: Type.NUMBER, description: "Often abbreviated as OC", nullable: true },
        electrical_conductivity: { type: Type.NUMBER, description: "Often abbreviated as EC", nullable: true },
        zinc: { type: Type.NUMBER, nullable: true },
        iron: { type: Type.NUMBER, nullable: true },
        manganese: { type: Type.NUMBER, nullable: true },
        copper: { type: Type.NUMBER, nullable: true },
        boron: { type: Type.NUMBER, nullable: true },
    }
};

const cropRecommendationsSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING },
            reason: { type: Type.STRING },
            yieldPotential: { type: Type.STRING }
        },
        required: ['name', 'reason', 'yieldPotential']
    }
};

const fertilizerRecommendationsSchema = {
    type: Type.OBJECT,
    properties: {
        recommendations: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    fertilizer: { type: Type.STRING },
                    quantity: { type: Type.STRING },
                    timing: { type: Type.STRING },
                    method: { type: Type.STRING }
                },
                required: ['fertilizer', 'quantity', 'timing', 'method']
            }
        },
        generalAdvice: { type: Type.STRING }
    },
    required: ['recommendations', 'generalAdvice']
};

const weatherDataSchema = {
    type: Type.OBJECT,
    properties: {
        current: {
            type: Type.OBJECT,
            properties: {
                temp: { type: Type.NUMBER },
                condition: { type: Type.STRING },
                humidity: { type: Type.NUMBER },
                wind_speed: { type: Type.NUMBER }
            },
            required: ['temp', 'condition', 'humidity', 'wind_speed']
        },
        forecast: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.STRING },
                    high_temp: { type: Type.NUMBER },
                    low_temp: { type: Type.NUMBER },
                    condition: { type: Type.STRING },
                    humidity: { type: Type.NUMBER, description: "Average humidity for the day as a whole number percentage." }
                },
                required: ['day', 'high_temp', 'low_temp', 'condition', 'humidity']
            }
        }
    },
    required: ['current', 'forecast']
};

const alertsAndGuidesSchema = {
    type: Type.OBJECT,
    properties: {
        alerts: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING, enum: ['Pest', 'Disease', 'Weather', 'Other'] },
                    severity: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
                    description: { type: Type.STRING }
                },
                required: ['type', 'severity', 'description']
            }
        },
        guides: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    activity: { type: Type.STRING },
                    timing: { type: Type.STRING },
                    reason: { type: Type.STRING }
                },
                 required: ['activity', 'timing', 'reason']
            }
        }
    },
    required: ['alerts', 'guides']
};

// --- UTILITY ---

const safelyParseJSON = (jsonString) => {
    try {
        let cleanJsonString = jsonString;
        const match = jsonString.match(/```json\n([\s\S]*?)\n```/);
        if (match) {
            cleanJsonString = match[1];
        }
        return JSON.parse(cleanJsonString);
    } catch (e) {
        console.error("Failed to parse JSON:", jsonString);
        throw new Error("Received malformed JSON from API.");
    }
};

const wmoCodeToDescription = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
};


// --- API FUNCTIONS ---

export const extractSoilDataFromImage = async (base64Image, mimeType) => {
    const prompt = `Analyze this image of a Soil Health Card. Extract the following values: Nitrogen (N), Phosphorus (P), Potassium (K), pH, Organic Carbon (OC), Electrical Conductivity (EC), Zinc (Zn), Iron (Fe), Manganese (Mn), Copper (Cu), and Boron (B). Return the data as a JSON object matching the provided schema. If a value is not present, use null.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [{ text: prompt }, { inlineData: { mimeType, data: base64Image } }] },
        config: { responseMimeType: 'application/json', responseSchema: soilDataSchema }
    });

    return safelyParseJSON(response.text);
};

export const getCropRecommendations = async (soilData, weatherData) => {
    const prompt = `Act as an expert agronomist for Indian agriculture. Based on the detailed soil nutrient analysis and local weather forecast provided, recommend the top 3 most suitable crops.
Soil Data: ${JSON.stringify(soilData)}
${weatherData ? `Weather Data: ${JSON.stringify(weatherData)}` : ''}

Your analysis must consider:
1.  **Soil Type & Nutrients:** Match crop requirements with the soil's pH, organic carbon, and specific nutrient levels (N, P, K, micronutrients). For example, if Nitrogen is low, suggest crops that are either nitrogen-fixing or have lower nitrogen requirements.
2.  **Weather Conditions:** Analyze the temperature range, humidity, and forecast (e.g., upcoming rain) to ensure the crops are suitable for the current and upcoming climate.
3.  **Synergy:** The reason for each recommendation should clearly explain *why* the crop is a good fit, linking specific soil parameters and weather conditions to the crop's needs.

For each of the 3 recommended crops, provide the name, a detailed reason for its suitability based on the data, and an estimated yield potential in quintals per hectare. Return as a JSON array matching the schema.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema: cropRecommendationsSchema }
    });
    
    return safelyParseJSON(response.text);
};

export const getFertilizerRecommendations = async (crop, soilData) => {
    const prompt = `For the crop "${crop.name}" and the given soil profile: ${JSON.stringify(soilData)}, recommend specific fertilizers (e.g., Urea, DAP, MOP) and their precise quantities in kg/acre. Provide guidelines on application timing (e.g., basal, top dressing) and method. Include some general advice. Return as a JSON object matching the schema.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema: fertilizerRecommendationsSchema }
    });

    return safelyParseJSON(response.text);
};


export const getLocationNameFromCoords = async (coords) => {
    const { latitude, longitude } = coords;
    // Using Nominatim (OpenStreetMap) for reliable reverse geocoding.
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=en`;

    try {
        const apiResponse = await fetch(apiUrl);
        if (!apiResponse.ok) {
            throw new Error(`Reverse geocoding request failed with status ${apiResponse.status}`);
        }
        const data = await apiResponse.json();
        
        // Return the full display name for clarity, falling back to a constructed name.
        if (data.display_name) {
            return data.display_name;
        }

        const address = data.address;
        const city = address.city || address.town || address.village || address.hamlet;
        const state = address.state;

        if (city && state) {
            return `${city}, ${state}`;
        }
        if (city) {
            return city;
        }
        if (state) {
            return state;
        }
        return "Your Location";

    } catch (error) {
        console.error("Failed to fetch location name from Nominatim:", error);
        // Fallback to Gemini if the dedicated service fails
        console.log("Nominatim failed, falling back to Gemini for location name.");
        try {
            const prompt = `Provide a short location name (e.g., "City, State") for these coordinates: latitude ${latitude}, longitude ${longitude}. Be concise.`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            return response.text.trim();
        } catch (geminiError) {
            console.error("Gemini fallback for location name also failed:", geminiError);
            return "Your Location"; // Final fallback
        }
    }
}

export const getCoordsFromLocationName = async (locationName) => {
    const apiUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1&accept-language=en`;
    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Forward geocoding request failed with status ${response.status}`);
        }
        const data = await response.json();
        if (data && data.length > 0) {
            return {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon),
                displayName: data[0].display_name
            };
        }
        return null;
    } catch (error) {
        console.error("Failed to fetch coordinates from Nominatim:", error);
        return null;
    }
};

export const getWeatherData = async (coords) => {
    const { latitude, longitude } = coords;
    
    const currentVars = "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code";
    const dailyVars = "weather_code,temperature_2m_max,temperature_2m_min,relative_humidity_2m_mean";
    
    // The Open-Meteo API requires `hourly` variables to be requested for `current` to work reliably.
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=${currentVars}&hourly=${currentVars}&daily=${dailyVars}&timezone=auto`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            const errorBody = await response.text();
            console.error("Open-Meteo API Error:", errorBody);
            throw new Error(`Open-Meteo request failed with status ${response.status}`);
        }
        const data = await response.json();

        if (!data.current || !data.daily) {
             throw new Error("Malformed response from Open-Meteo, missing current or daily data.");
        }

        // Transform the API response into our WeatherData format
        const transformedData = {
            current: {
                temp: Math.round(data.current.temperature_2m),
                condition: wmoCodeToDescription[data.current.weather_code] || 'Unknown',
                humidity: Math.round(data.current.relative_humidity_2m),
                wind_speed: Math.round(data.current.wind_speed_10m)
            },
            forecast: data.daily.time.slice(0, 7).map((dateString, index) => {
                const date = new Date(dateString + 'T00:00:00'); // Use T00:00:00 to avoid timezone interpretation issues
                let dayName;
                if (index === 0) {
                    dayName = 'Today';
                } else {
                    dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                }

                return {
                    day: dayName,
                    high_temp: Math.round(data.daily.temperature_2m_max[index]),
                    low_temp: Math.round(data.daily.temperature_2m_min[index]),
                    condition: wmoCodeToDescription[data.daily.weather_code[index]] || 'Unknown',
                    humidity: Math.round(data.daily.relative_humidity_2m_mean[index]),
                };
            })
        };
        return transformedData;

    } catch (error) {
        console.error("Failed to fetch weather data from Open-Meteo:", error);
        throw new Error("Could not fetch weather data.");
    }
};


export const getAlertsAndGuides = async (weatherData) => {
    const prompt = `Based on this weather data for a farming context in India, generate relevant alerts and guides.
    Weather: ${JSON.stringify(weatherData)}
    - Alerts: Identify potential risks like high winds, heavy rain, high humidity leading to fungal disease, or potential pest outbreaks.
    - Guides: Suggest timely activities like when to irrigate, spray pesticides, or apply fertilizers based on the forecast.
    Return the response in the exact JSON format defined by the schema. If there are no specific alerts or guides, return empty arrays.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema: alertsAndGuidesSchema }
    });
    return safelyParseJSON(response.text);
}

export const interpretVoiceCommand = async (transcript) => {
    const prompt = `Interpret the user's voice command. The user is trying to navigate the SmartHarvest dashboard.
    Available pages are: 'dashboard', 'cropAdvisor', 'weather', 'aiAssistant', 'schemes'.
    Based on the transcript, determine the navigation command and the target page.
    Provide a brief, natural-sounding confirmation message in English to be spoken back to the user.
    For example, if the user says "show me the weather forecast", you should navigate to 'weather' and the spoken response could be "Showing the weather forecast.".
    If the user says "go to the main page", navigate to 'dashboard' and respond "Going to the dashboard.".
    If the command is unclear, navigate to the 'dashboard' and respond "Sorry, I didn't catch that. Here's the dashboard.".

    User transcript: "${transcript}"

    Return the result as a JSON object matching the provided schema.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema: commandSchema }
    });

    return safelyParseJSON(response.text);
};

export const getFarmQueryResponse = async (query, language) => {
    const langName = language === 'en-US' ? 'English' : 'Tamil';
    const prompt = `You are an expert agricultural assistant named SmartHarvest AI.
    A user has a query about farming. Provide a helpful and concise answer.
    The user is communicating in ${langName}. You MUST respond in ${langName}.

    User Query: "${query}"`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return response.text;
};