import { useState } from "react";
import TextField from "@mui/material/TextField";
import { CityInputProps } from "../../../interfaces/interfaces";
import styles from "../DistanceForm.module.css";
import CancelIcon from '@mui/icons-material/Cancel';
import * as React from "react";
import { IconButton } from "@mui/material";

const CityInput = ({ label, city, setCity, fetchSuggestions, error }: CityInputProps) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (suggestions.length === 0) return;

        if (event.key === "ArrowDown") {
            event.preventDefault();
            setSelectedIndex((prevIndex) => Math.min(prevIndex + 1, suggestions.length - 1));
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        }

        if (event.key === "Enter") {
            event.preventDefault();
            if (selectedIndex >= 0) {
                setCity(suggestions[selectedIndex]);
                setSuggestions([]);
                setSelectedIndex(-1);
                setIsFocused(false);
            }
        }
    };

    return (
        <div className={styles.fieldBlock}>
            <TextField
                value={city}
                onChange={(e) => {
                    setCity(e.target.value);
                    fetchSuggestions(e.target.value, setSuggestions);
                    setSelectedIndex(-1);
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                    setIsFocused(false);
                    setSuggestions([]);
                }}
                onKeyDown={handleKeyDown}
                label={label}
                fullWidth
                error={Boolean(error)}
                helperText={error || ""}
                slotProps={{
                    input: {
                        endAdornment:
                            <IconButton
                                onClick={() => setCity("")}
                                edge="end"
                                sx={{
                                    "&:focus": {
                                        outline: "none",
                                    },
                                }}
                            >
                                <CancelIcon />
                            </IconButton>,
                    },
                }}
            />
            {isFocused && suggestions.length > 0 && (
                <ul className={styles.suggestions}>
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className={`${styles.suggestionItem} ${index === selectedIndex ? styles.selected : ""}`}
                            onMouseDown={() => {
                                setCity(suggestion);
                                setSuggestions([]);
                                setIsFocused(false);
                            }}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CityInput;
