import clearDay from "@meteocons/lottie/fill/clear-day.json";
import clearNight from "@meteocons/lottie/fill/clear-night.json";
import drizzle from "@meteocons/lottie/fill/drizzle.json";
import fogDay from "@meteocons/lottie/fill/fog-day.json";
import fogNight from "@meteocons/lottie/fill/fog-night.json";
import overcast from "@meteocons/lottie/fill/overcast.json";
import overcastDayDrizzle from "@meteocons/lottie/fill/overcast-day-drizzle.json";
import overcastNightDrizzle from "@meteocons/lottie/fill/overcast-night-drizzle.json";
import partlyCloudyDay from "@meteocons/lottie/fill/partly-cloudy-day.json";
import partlyCloudyDayRain from "@meteocons/lottie/fill/partly-cloudy-day-rain.json";
import partlyCloudyDaySnow from "@meteocons/lottie/fill/partly-cloudy-day-snow.json";
import partlyCloudyNight from "@meteocons/lottie/fill/partly-cloudy-night.json";
import partlyCloudyNightRain from "@meteocons/lottie/fill/partly-cloudy-night-rain.json";
import partlyCloudyNightSnow from "@meteocons/lottie/fill/partly-cloudy-night-snow.json";
import rain from "@meteocons/lottie/fill/rain.json";
import sleet from "@meteocons/lottie/fill/sleet.json";
import snow from "@meteocons/lottie/fill/snow.json";
import thunderstormsDay from "@meteocons/lottie/fill/thunderstorms-day.json";
import thunderstormsExtremeDay from "@meteocons/lottie/fill/thunderstorms-extreme-day.json";
import thunderstormsExtremeNight from "@meteocons/lottie/fill/thunderstorms-extreme-night.json";
import thunderstormsNight from "@meteocons/lottie/fill/thunderstorms-night.json";
import lottie, { type AnimationItem } from "lottie-web";
import { useEffect, useRef } from "react";
import styles from "./WeatherIcon.module.scss";

interface Props {
	code: number;
	isDay: boolean;
	className?: string;
	size?: number | string;
}

function getIcon(code: number, isDay: boolean): object {
	const d = isDay ? "day" : "night";

	if (code === 0) return d === "night" ? clearNight : clearDay;
	if (code <= 2) return d === "night" ? partlyCloudyNight : partlyCloudyDay;
	if (code === 3) return overcast;
	if (code === 45 || code === 48) return d === "night" ? fogNight : fogDay;
	if (code >= 51 && code <= 55) return drizzle;
	if (code >= 56 && code <= 57)
		return d === "night" ? overcastNightDrizzle : overcastDayDrizzle;
	if (code >= 61 && code <= 65) return rain;
	if (code >= 66 && code <= 67) return sleet;
	if (code >= 71 && code <= 77) return snow;
	if (code >= 80 && code <= 82)
		return d === "night" ? partlyCloudyNightRain : partlyCloudyDayRain;
	if (code >= 85 && code <= 86)
		return d === "night" ? partlyCloudyNightSnow : partlyCloudyDaySnow;
	if (code === 95) return d === "night" ? thunderstormsNight : thunderstormsDay;
	if (code >= 96)
		return d === "night" ? thunderstormsExtremeNight : thunderstormsExtremeDay;
	return d === "night" ? clearNight : clearDay;
}

export function WeatherIcon({
	code,
	isDay,
	className = "",
	size = "4rem",
}: Props) {
	const containerRef = useRef<HTMLDivElement>(null);
	const icon = getIcon(code, isDay);

	useEffect(() => {
		if (!containerRef.current) return;

		let anim: AnimationItem | null = null;
		let cancelled = false;

		if (cancelled || !containerRef.current) return;
		anim = lottie.loadAnimation({
			container: containerRef.current,
			renderer: "svg",
			loop: true,
			autoplay: true,
			animationData: icon,
		});

		return () => {
			cancelled = true;
			anim?.destroy();
		};
	}, [icon]);

	return (
		<div
			ref={containerRef}
			className={`${styles.icon} ${className}`}
			role="img"
			aria-label={`weather condition ${code}`}
			style={{ width: size, height: size }}
		/>
	);
}
