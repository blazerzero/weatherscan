import { type FormEvent, useRef, useState } from "react";
import { geocodeCity } from "@/api/openMeteo";
import type { LocationInfo } from "@/types/weather";

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
		<div
			className="flex flex-col items-center justify-center h-full gap-6"
			style={{
				background: "linear-gradient(180deg, #000d1a 0%, #001433 100%)",
			}}
		>
			<div
				className="text-3xl font-bold tracking-widest uppercase"
				style={{ color: "#00aaff", textShadow: "0 0 20px #0077cc" }}
			>
				WeatherScan
			</div>

			<div
				className="text-sm text-center"
				style={{ color: "#557799", maxWidth: "22rem" }}
			>
				Location access was denied or unavailable.
				<br />
				Enter a city name or zip code to get started.
			</div>

			<form onSubmit={handleSubmit} className="flex gap-2">
				<input
					ref={inputRef}
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="City, State or Zip"
					className="px-3 py-1.5 rounded text-sm outline-none"
					style={{
						background: "#001a40",
						border: "1px solid #1a4070",
						color: "#e8f4ff",
						width: "16rem",
					}}
					autoFocus
				/>
				<button
					type="submit"
					disabled={loading}
					className="px-3 py-1.5 rounded text-sm font-bold uppercase tracking-wider cursor-pointer"
					style={{
						background: "#003366",
						color: "#00aaff",
						border: "1px solid #0055a0",
						opacity: loading ? 0.6 : 1,
					}}
				>
					{loading ? "..." : "Go"}
				</button>
			</form>

			{error && (
				<div className="text-xs" style={{ color: "#ff8800" }}>
					{error}
				</div>
			)}
		</div>
	);
}
