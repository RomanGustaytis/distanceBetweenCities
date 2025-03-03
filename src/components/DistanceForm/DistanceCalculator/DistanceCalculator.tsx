interface Coordinates {
    city: string;
    lat: number;
    lon: number;
}

interface DistanceCalculatorProps {
    coordinates: Coordinates[];
}

const calculateDistance = (coords1: Coordinates, coords2: Coordinates): number => {
    const toRadians = (deg: number) => (deg * Math.PI) / 180;

    const R = 6371;
    const lat1 = toRadians(coords1.lat);
    const lon1 = toRadians(coords1.lon);
    const lat2 = toRadians(coords2.lat);
    const lon2 = toRadians(coords2.lon);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const DistanceCalculator = ({ coordinates }: DistanceCalculatorProps) => {
    if (coordinates.length < 2) return null;

    const distance = calculateDistance(coordinates[0], coordinates[1]);

    return <b>Расстояние между городами по прямой: {distance.toFixed(2)} км</b>;
};

export default DistanceCalculator;
