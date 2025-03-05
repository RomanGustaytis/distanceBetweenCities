import { Coordinates, NominatimResponse } from "../interfaces/interfaces";

export const fetchCoordinates = async (city: string): Promise<Coordinates | null> => {
    if (!city.trim()) return null;

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`,
        );
        if (!response.ok) {
            throw new Error("Ошибка при получении данных о координатах");
        }
        const data: NominatimResponse[] = await response.json();

        return data.length > 0
            ? { city, lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) }
            : null;
    } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
            console.error("Ошибка при запросе координат:", error);
        }
        return null;
    }
};

export const fetchSuggestions = async (query: string): Promise<string[]> => {
    if (!query.trim()) return [];

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`
        );
        if (!response.ok) {
            throw new Error("Ошибка при получении подсказок");
        }
        const data: { display_name: string }[] = await response.json();

        return data.map((item) => item.display_name);
    } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
            console.error("Ошибка при запросе подсказок:", error);
        }
        return [];
    }
};

