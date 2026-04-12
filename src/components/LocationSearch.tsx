import { type FormEvent, useRef, useState } from "react";
import { geocodeCity } from "@/api/openMeteo";
import type { LocationInfo } from "@/types/weather";
import styles from "./LocationSearch.module.scss";

interface Props {
	onLocationFound: (location: LocationInfo) => void;
}

export function LocationSearch({ onLocationFound }: Props) {
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		const q = query.trim();
		if (!q) return;
		setLoading(true);
		setError(null);
		try {
			const loc = await geocodeCity(q);
			if (!loc) {
				setError("Location not found. Try a city name or zip code.");
			} else {
				onLocationFound(loc);
			}
		} catch {
			setError("Error looking up location.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.title}>WeatherScan</div>

			<div className={styles.instructions}>
				Location access was denied or unavailable.
				<br />
				Enter a city name or zip code to get started.
			</div>

			<form onSubmit={handleSubmit} className={styles.form}>
				<input
					ref={inputRef}
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="City, State or Zip"
					className={styles.input}
					autoFocus
				/>
				<button
					type="submit"
					disabled={loading}
					className={styles.submitButton}
				>
					{loading ? "..." : "Go"}
				</button>
			</form>

			{error && <div className={styles.errorMsg}>{error}</div>}
		</div>
	);
}
