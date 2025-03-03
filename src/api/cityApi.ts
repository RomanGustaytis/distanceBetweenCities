let timeout: ReturnType<typeof setTimeout>;

interface Coordinates {
    city: string;
    lat: number;
    lon: number;
}

export const fetchCoordinates = async (city: string): Promise<Coordinates | null> => {
    if (!city.trim()) return null;

    const controller = new AbortController();
    const { signal } = controller;

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`,
            { signal }
        );
        if (!response.ok) {
            throw new Error("Ошибка при получении данных о координатах");
        }
        const data: any[] = await response.json();

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

export const fetchSuggestions = (
    query: string,
    setSuggestions: (suggestions: string[]) => void
) => {
    clearTimeout(timeout);

    timeout = setTimeout(async () => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }

        const controller = new AbortController();
        const { signal } = controller;

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`,
                { signal }
            );
            if (!response.ok) {
                throw new Error("Ошибка при получении подсказок");
            }
            const data: { display_name: string }[] = await response.json();

            setSuggestions(data.map((item) => item.display_name));
        } catch (error) {
            if (error instanceof Error && error.name !== "AbortError") {
                console.error("Ошибка при запросе подсказок:", error);
            }
            setSuggestions([]);
        }
    }, 500);
};
