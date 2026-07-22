// FIX: Define and export all shared types to resolve module import errors across the application.

// --- USER & AUTH ---
export interface User {
  mobile: string;
  password: string; 
  name: string;
  village: string;
  district: string;
}

// --- APP NAVIGATION & STATE ---
export type Page = 'dashboard' | 'cropAdvisor' | 'weather' | 'aiAssistant' | 'schemes';
export type Language = 'en-US' | 'ta-IN';

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface CommandResponse {
  command: 'navigate';
  page: Page;
  spokenResponse: string;
}

// --- LOCATION & WEATHER ---
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeocodingResult extends Coordinates {
  displayName: string;
}

export interface WeatherForecastDay {
  day: string;
  high_temp: number;
  low_temp: number;
  condition: string;
  humidity: number;
}

export interface WeatherData {
  current: {
    temp: number;
    condition: string;
    humidity: number;
    wind_speed: number;
  };
  forecast: WeatherForecastDay[];
}

// --- FARMING DATA & RECOMMENDATIONS ---
export interface Alert {
  type: 'Pest' | 'Disease' | 'Weather' | 'Other';
  severity: 'Low' | 'Medium' | 'High';
  description: string;
}

export interface Guide {
  activity: string;
  timing: string;
  reason: string;
}

export interface AlertsData {
  alerts: Alert[];
  guides: Guide[];
}

export interface SoilData {
  nitrogen: number | null;
  phosphorus: number | null;
  potassium: number | null;
  ph: number | null;
  organic_carbon: number | null;
  electrical_conductivity: number | null;
  zinc: number | null;
  iron: number | null;
  manganese: number | null;
  copper: number | null;
  boron: number | null;
}

export interface Crop {
  name: string;
  reason: string;
  yieldPotential: string;
}

export interface FertilizerRecommendation {
    fertilizer: string;
    quantity: string;
    timing: string;
    method: string;
}

export interface FertilizerData {
  recommendations: FertilizerRecommendation[];
  generalAdvice: string;
}

// --- GOVERNMENT SCHEMES ---
export interface SchemeBenefit {
    title: string;
    title_ta: string;
    details: string[];
    details_ta?: string[];
}

export interface SchemeEligibility {
    title: string;
    title_ta: string;
    criteria: string[];
    criteria_ta?: string[];
}

export interface SchemeIntervention {
    title: string;
    title_ta: string;
    description: string;
    description_ta?: string;
}

export interface Scheme {
    id: string;
    name: string;
    name_ta: string;
    type: 'central' | 'state';
    definition: string;
    definition_ta: string;
    eligibility: string[] | SchemeEligibility[];
    eligibility_ta?: string[] | SchemeEligibility[];
    usage?: string;
    usage_ta?: string;
    advantages?: string[];
    advantages_ta?: string[];
    benefits?: string[] | SchemeBenefit[];
    benefits_ta?: string[] | SchemeBenefit[];
    objectives?: string[];
    objectives_ta?: string[];
    features?: string[];
    features_ta?: string[];
    keyFeatures?: string[];
    keyFeatures_ta?: string[];
    challenges?: string[];
    challenges_ta?: string[];
    additionalCriteria?: string[];
    additionalCriteria_ta?: string[];
    interventions?: SchemeIntervention[];
    applicationProcess?: string[];
    applicationProcess_ta?: string[];
}
