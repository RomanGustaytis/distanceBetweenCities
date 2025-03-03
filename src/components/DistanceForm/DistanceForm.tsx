import { useState } from "react";
import { fetchCoordinates, fetchSuggestions } from "../../api/cityApi";
import Button from "@mui/material/Button";
import CityInput from "./CityInput/CityInput";
import DistanceCalculator from "./DistanceCalculator/DistanceCalculator";
import styles from "./DistanceForm.module.css";

interface Coordinates {
    city: string;
    lat: number;
    lon: number;
}

const DistanceForm = () => {
    const [cityFirst, setCityFirst] = useState<string>("");
    const [citySecond, setCitySecond] = useState<string>("");
    const [coordinates, setCoordinates] = useState<Coordinates[]>([]);
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleCalculate = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!cityFirst.trim() || !citySecond.trim()) {
            setError("Введите название города");
            return;
        }

        setIsLoading(true);
        const coords1 = await fetchCoordinates(cityFirst);
        const coords2 = await fetchCoordinates(citySecond);

        if (!coords1 || !coords2) {
            setError("Не удалось найти один или оба города. Проверьте правильность написания.");
            setCoordinates([]);
        } else {
            setCoordinates([coords1, coords2].filter(Boolean) as Coordinates[]);
        }


        setIsLoading(false);
    };

    return (
        <div className={styles.container}>
            <form className={styles.wrapper} onSubmit={handleCalculate}>
                <h1>Введите названия городов</h1>

                <CityInput label="Введите первый город" city={cityFirst} setCity={setCityFirst}
                           fetchSuggestions={fetchSuggestions} />
                <CityInput label="Введите второй город" city={citySecond} setCity={setCitySecond}
                           fetchSuggestions={fetchSuggestions} />

                {error && <div className={styles.error}>{error}</div>}

                <DistanceCalculator coordinates={coordinates} />

                {cityFirst.length > 0 && citySecond.length > 0 && (
                    <Button variant="contained"
                            type="submit"
                            fullWidth
                            disabled={isLoading}>
                        {isLoading ? "Загрузка…" : "Посчитать"}
                    </Button>
                )}
            </form>
        </div>
    );
};

export default DistanceForm;
