import { useState, useEffect } from "react";
import { fetchCoordinates, fetchSuggestions } from "../../api/cityApi";
import Button from "@mui/material/Button";
import CityInput from "./CityInput/CityInput";
import DistanceCalculator from "./DistanceCalculator/DistanceCalculator";
import { Coordinates } from "../../interfaces/interfaces";
import styles from "./DistanceForm.module.css";

const DistanceForm = () => {
    const [cityFirst, setCityFirst] = useState<string>("");
    const [citySecond, setCitySecond] = useState<string>("");
    const [coordinates, setCoordinates] = useState<Coordinates[]>([]);
    const [errorFirst, setErrorFirst] = useState<string>("");
    const [errorSecond, setErrorSecond] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!cityFirst.trim() || !citySecond.trim()) {
            setCoordinates([]);
        }
    }, [cityFirst, citySecond]);

    const handleCalculate = async (event: React.FormEvent) => {
        event.preventDefault();

        setErrorFirst("");
        setErrorSecond("");

        if (!cityFirst.trim() || !citySecond.trim()) {
            return;
        }

        setIsLoading(true);

        const coords1 = await fetchCoordinates(cityFirst);
        const coords2 = await fetchCoordinates(citySecond);

        if (!coords1) {
            setErrorFirst("Не удалось найти город. Проверьте правильность написания.");
        } else if (!coords2) {
            setErrorSecond("Не удалось найти город. Проверьте правильность написания.");
        } else {
            setCoordinates([coords1, coords2]);
        }

        setIsLoading(false);
    };

    return (
        <div className={styles.container}>
            <form className={styles.wrapper} onSubmit={handleCalculate}>
                <h1 className={styles.title}>Введите названия городов</h1>

                <CityInput
                    label="Введите первый город"
                    city={cityFirst}
                    setCity={setCityFirst}
                    fetchSuggestions={fetchSuggestions}
                    error={errorFirst}
                />

                <CityInput
                    label="Введите второй город"
                    city={citySecond}
                    setCity={setCitySecond}
                    fetchSuggestions={fetchSuggestions}
                    error={errorSecond}
                />

                {cityFirst.trim() && citySecond.trim() && <DistanceCalculator coordinates={coordinates} />}

                {cityFirst.length > 0 && citySecond.length > 0 && (
                    <Button variant="contained" type="submit" fullWidth disabled={isLoading}>
                        {isLoading ? "Загрузка…" : "Посчитать"}
                    </Button>
                )}
            </form>
        </div>
    );
};

export default DistanceForm;
