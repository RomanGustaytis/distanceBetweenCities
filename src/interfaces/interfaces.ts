export interface Coordinates {
    city: string;
    lat: number;
    lon: number;
}

export interface DistanceCalculatorProps {
    coordinates: Coordinates[];
}

export interface CityInputProps {
    label: string;
    city: string;
    setCity: (city: string) => void;
    fetchSuggestions: (input: string, setSuggestions: (suggestions: string[]) => void) => void;
    error?: string;
}