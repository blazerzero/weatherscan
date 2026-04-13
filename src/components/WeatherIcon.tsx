import clearDay from "@meteocons/lottie/fill/clear-day.json";
import clearNight from "@meteocons/lottie/fill/clear-night.json";
import drizzle from "@meteocons/lottie/fill/drizzle.json";
import fogDay from "@meteocons/lottie/fill/fog-day.json";
import fogNight from "@meteocons/lottie/fill/fog-night.json";
import mostlyClearDay from "@meteocons/lottie/fill/mostly-clear-day.json";
import mostlyClearNight from "@meteocons/lottie/fill/mostly-clear-night.json";
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
	const night = !isDay;
	switch (code) {
		case 0:
			return night ? clearNight : clearDay;
		case 1:
			return night ? mostlyClearNight : mostlyClearDay;
		case 2:
			return night ? partlyCloudyNight : partlyCloudyDay;
		case 3:
			return overcast;
		case 45:
		case 48:
			return night ? fogNight : fogDay;
		case 51:
		case 53:
		case 55:
			return drizzle;
		case 56:
		case 57:
			return night ? overcastNightDrizzle : overcastDayDrizzle;
		case 61:
		case 63:
		case 65:
			return rain;
		case 66:
		case 67:
			return sleet;
		case 71:
		case 85:
			return night ? partlyCloudyNightSnow : partlyCloudyDaySnow;
		case 73:
		case 77:
		case 75:
		case 86:
			return snow;
		case 80:
		case 81:
		case 82:
			return night ? partlyCloudyNightRain : partlyCloudyDayRain;
		case 95:
			return night ? thunderstormsNight : thunderstormsDay;
		case 96:
		case 99:
			return night ? thunderstormsExtremeNight : thunderstormsExtremeDay;
		default:
			return night ? clearNight : clearDay;
	}
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
