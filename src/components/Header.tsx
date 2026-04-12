import { useEffect, useState } from "react";
import type { LocationInfo } from "@/types/weather";
import styles from "./Header.module.scss";

interface Props {
	location: LocationInfo | null;
}

export function Header({ location }: Props) {
	const [now, setNow] = useState(new Date());

	useEffect(() => {
		const id = setInterval(() => setNow(new Date()), 1000);
		return () => clearInterval(id);
	}, []);

	const tz =
		location?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

	const timeStr = now.toLocaleTimeString("en-US", {
		timeZone: tz,
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: true,
	});

	const dateStr = now.toLocaleDateString("en-US", {
		timeZone: tz,
		weekday: "short",
		month: "short",
		day: "numeric",
		year: "numeric",
	});

	const locationStr = location
		? [location.city, location.state || location.country]
				.filter(Boolean)
				.join(", ")
				.toUpperCase()
		: "ACQUIRING LOCATION...";

	return (
		<header className={styles.header}>
			{/* Logo */}
			<div className={styles.logo}>
				<div className={styles.logoTitle}>Weatherscan</div>
				<div className={styles.logoBadge}>LOCAL</div>
			</div>

			{/* Location */}
			<div className={styles.location}>{locationStr}</div>

			{/* Clock */}
			<div className={styles.clock}>
				<div className={styles.clockTime}>{timeStr}</div>
				<div className={styles.clockDate}>{dateStr}</div>
			</div>
		</header>
	);
}
