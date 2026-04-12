import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { enrichWithNWS } from "@/api/nws";
import { Chyron } from "@/components/Chyron";
import { LocationSearch } from "@/components/LocationSearch";
import { Sidebar } from "@/components/Sidebar";
import { SlidePanel } from "@/components/SlidePanel";
import { WeatherIcon } from "@/components/WeatherIcon";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useSlideRotation } from "@/hooks/useSlideRotation";
import { useWeather } from "@/hooks/useWeather";
import type {
	Coordinates,
	DailyForecast,
	HourlyPoint,
	LocationInfo,
	SlideType,
} from "@/types/weather";
import styles from "./App.module.scss";

export function App() {
	const geo = useGeolocation();
	const [manualLocation, setManualLocation] = useState<LocationInfo | null>(
		null,
	);

	const coords: Coordinates | null =
		manualLocation?.coords ?? (geo.status === "success" ? geo.coords : null);

	const { data, isLoading, isError } = useWeather(coords);

	// biome-ignore lint/correctness/useExhaustiveDependencies: coords identity guards against re-enrichment loop
	useEffect(() => {
		if (!manualLocation) return;
		let cancelled = false;
		enrichWithNWS(manualLocation).then((enriched) => {
			if (!cancelled) setManualLocation(enriched);
		});
		return () => {
			cancelled = true;
		};
	}, [manualLocation?.coords.lat, manualLocation?.coords.lon]);

	const showLocationSearch =
		geo.status === "denied" && !manualLocation && !data;
	const activeLocation = data?.location ?? manualLocation ?? null;

	const slides: SlideType[] = [
		"currently",
		"hourly",
		"7day",
		"radar",
		...(data?.alerts && data.alerts.length > 0 ? (["alerts"] as const) : []),
	];
	const { current, index: slideIndex } = useSlideRotation(slides);

	return (
		<div
			className={styles.app}
			style={{
				background:
					"linear-gradient(160deg, #72bde8 0%, #4a9ad0 50%, #3a80bc 100%)",
			}}
		>
			{/* Main row */}
			<div className={styles.mainRow}>
				{/* Left sidebar */}
				<div className={styles.sidebarCol}>
					{showLocationSearch ? (
						<LocationSearch onLocationFound={(loc) => setManualLocation(loc)} />
					) : (
						<Sidebar
							location={activeLocation}
							current={data?.current ?? null}
							isLoading={isLoading && !data}
						/>
					)}
				</div>

				{/* Right content column */}
				<div className={styles.contentCol}>
					{/* Category ticker */}
					<CategoryTicker
						city={activeLocation?.city ?? null}
						slides={slides}
						activeIndex={slideIndex}
					/>

					{/* Blue main panel */}
					<div
						className={styles.mainPanel}
						style={{ background: "#2244b0" }}
					>
						{isLoading && !data ? (
							<LoadingScreen />
						) : isError ? (
							<ErrorScreen onRetry={() => setManualLocation(null)} />
						) : data ? (
							<SlidePanel data={data} current={current} />
						) : null}
					</div>

					{/* Bottom strip — rotates between hourly and 5-day */}
					{data && (
						<BottomStrip
							hourly={data.hourly}
							daily={data.daily}
							location={data.location}
						/>
					)}
				</div>
			</div>

			{/* Bottom chyron */}
			{data && (
				<Chyron localAlerts={data.alerts} locationName={data.location.city} />
			)}

			{/* Stale-data indicator */}
			{data && isLoading && (
				<div
					className={styles.staleIndicator}
					style={{
						background: "rgba(0,0,0,0.55)",
						color: "#99bbdd",
						border: "1px solid #2a44a8",
					}}
				>
					Updating…
				</div>
			)}
		</div>
	);
}

// ── Inline sub-components ────────────────────────────────────────────────────

const TICKER_NAMES: Record<SlideType, string> = {
	currently: "CURRENT",
	hourly: "HOURLY",
	"7day": "7-DAY",
	radar: "RADAR",
	alerts: "ALERTS",
};

function CategoryTicker({
	city,
	slides,
	activeIndex,
}: {
	city: string | null;
	slides: SlideType[];
	activeIndex: number;
}) {
	const n = Math.max(slides.length, 1);
	const COPIES = 50;
	const MID = Math.floor(COPIES / 2);
	const SLOT_W = 90;
	const SEP_W = 20;
	const STRIDE = SLOT_W + SEP_W;

	const containerRef = useRef<HTMLDivElement>(null);
	const contRef = useRef(MID * n + activeIndex);
	const prevActive = useRef(activeIndex);
	const [track, setTrack] = useState({ x: 0, animated: false });

	const getX = (pos: number) => {
		const cw = containerRef.current?.offsetWidth ?? 400;
		return -(pos * STRIDE) + cw * 0.3;
	};

	// Set initial position once container is in the DOM
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset on slide count change
	useLayoutEffect(() => {
		contRef.current = MID * n + activeIndex;
		prevActive.current = activeIndex;
		setTrack({ x: getX(contRef.current), animated: false });
	}, [n]);

	// Slide forward when the active index changes
	// biome-ignore lint/correctness/useExhaustiveDependencies: contRef and getX are stable refs
	useEffect(() => {
		if (activeIndex === prevActive.current) return;
		let delta = activeIndex - prevActive.current;
		if (delta < 0) delta += n;
		contRef.current += delta;
		prevActive.current = activeIndex;
		setTrack({ x: getX(contRef.current), animated: true });
	}, [activeIndex]);

	const allItems = Array.from(
		{ length: COPIES * n },
		(_, i) => slides[i % n] ?? slides[0]!,
	);

	return (
		<div
			className={styles.ticker}
			style={{ background: "#0a0a22" }}
		>
			{/* Fixed city label */}
			<span
				className={styles.tickerCity}
				style={{ color: "#d4a830" }}
			>
				{(city ?? "WEATHERSCAN").toUpperCase()}
			</span>
			<span className={styles.tickerSep} style={{ color: "#333355" }}>
				{"<"}
			</span>

			{/* Infinite sliding strip */}
			<div
				ref={containerRef}
				className={styles.tickerStrip}
			>
				<div
					className={styles.tickerTrack}
					style={{
						transform: `translateX(${track.x}px)`,
						transition: track.animated
							? "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
							: "none",
						willChange: "transform",
					}}
				>
					{allItems.map((slide, i) => (
						<Fragment key={i}>
							{i > 0 && (
								<span
									style={{
										width: SEP_W,
										flexShrink: 0,
										textAlign: "center",
										fontSize: "0.7rem",
										color: "#2a2a55",
									}}
								>
									{"<"}
								</span>
							)}
							<span
								style={{
									width: SLOT_W,
									flexShrink: 0,
									textAlign: "center",
									fontSize: "0.7rem",
									fontWeight: "bold",
									letterSpacing: "0.08em",
									color: i === contRef.current ? "#ffffff" : "#2a2a55",
								}}
							>
								{TICKER_NAMES[slide]}
							</span>
						</Fragment>
					))}
				</div>
			</div>
		</div>
	);
}

function BottomStrip({
	hourly,
	daily,
	location,
}: {
	hourly: HourlyPoint[];
	daily: DailyForecast[];
	location: LocationInfo;
}) {
	const [view, setView] = useState<"hourly" | "daily">("hourly");
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const DISPLAY_MS = 10_000;
		const FADE_MS = 350;
		const timer = setInterval(() => {
			setVisible(false);
			setTimeout(() => {
				setView((v) => (v === "hourly" ? "daily" : "hourly"));
				setVisible(true);
			}, FADE_MS);
		}, DISPLAY_MS);
		return () => clearInterval(timer);
	}, []);

	return (
		<div
			className={styles.bottomStrip}
			style={{ opacity: visible ? 1 : 0, transition: "opacity 0.35s ease" }}
		>
			{view === "hourly" ? (
				<HourlyFooter key="hourly" hourly={hourly} location={location} />
			) : (
				<FiveDayFooter key="daily" daily={daily} location={location} />
			)}
		</div>
	);
}

function FiveDayFooter({
	daily,
	location,
}: {
	daily: DailyForecast[];
	location: LocationInfo;
}) {
	const tz = location.timezone;
	const currentLocalHour =
		parseInt(
			new Intl.DateTimeFormat("en-US", {
				hour: "numeric",
				hour12: false,
				timeZone: tz,
			}).format(new Date()),
		) % 24;
	const start = currentLocalHour >= 16 ? 1 : 0;
	const days = daily.slice(start, start + 5);

	return (
		<div>
			{/* Gold header strip */}
			<div
				className={styles.footerHeader}
				style={{ background: "#c8aa38", borderTop: "2px solid #a08828" }}
			>
				<span
					className={styles.footerCity}
					style={{ color: "#0d1f3a" }}
				>
					{location.city.toUpperCase()}:
				</span>
				<span className={styles.footerLabel} style={{ color: "#1a2d7a" }}>
					5 DAY FORECAST
				</span>
			</div>

			{/* Day columns */}
			<div
				className={styles.footerColumns}
				style={{
					background:
						"linear-gradient(180deg, #8ab4e4 0%, #6090cc 50%, #5080bc 100%)",
				}}
			>
				{days.map((d, i) => {
					const dayLabel = d.date
						.toLocaleDateString("en-US", { weekday: "short", timeZone: tz })
						.toUpperCase();
					return (
						<div
							key={d.date.toISOString()}
							className={styles.footerColumn}
							style={{
								borderRight:
									i < days.length - 1 ? "1px solid #3a5888" : undefined,
							}}
						>
							{/* Day name */}
							<div
								className={styles.footerDayHeader}
								style={{ background: i === 0 ? "#9abce8" : "#5a7ec0" }}
							>
								<span
									className={styles.footerDayName}
									style={{ color: "#0a1840" }}
								>
									{dayLabel}
								</span>
							</div>

							{/* Icon + high / low */}
							<div className={styles.footerDayBody}>
								<WeatherIcon
									code={d.conditionCode}
									isDay
									className={styles.footerDayIcon}
								/>
								<div className={styles.footerTemps}>
									<span
										className={styles.footerHighTemp}
										style={{ color: "#0a1428" }}
									>
										{d.highF}
									</span>
									<span
										className={styles.footerLowTemp}
										style={{ color: "#333333" }}
									>
										{d.lowF}
									</span>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

function HourlyFooter({
	hourly,
	location,
}: {
	hourly: HourlyPoint[];
	location: LocationInfo;
}) {
	const tz = location.timezone;

	// Pick up to 4 slots from the target hours that are at least 3 hours away
	const currentLocalHour =
		parseInt(
			new Intl.DateTimeFormat("en-US", {
				hour: "numeric",
				hour12: false,
				timeZone: tz,
			}).format(new Date()),
		) % 24;
	const TARGET_HOURS = new Set(
		currentLocalHour >= 20 ? [6, 12, 15, 17, 20] : [0, 6, 12, 15, 17, 20],
	);
	const minTime = Date.now() + 3 * 60 * 60 * 1000;
	const slots = hourly
		.filter((h) => {
			if (h.time.getTime() < minTime) return false;
			const localHour =
				parseInt(
					new Intl.DateTimeFormat("en-US", {
						hour: "numeric",
						hour12: false,
						timeZone: tz,
					}).format(h.time),
				) % 24;
			return TARGET_HOURS.has(localHour);
		})
		.slice(0, 4);

	const firstTime = slots[0]?.time;
	const dayName = firstTime
		? firstTime
				.toLocaleDateString("en-US", { weekday: "long", timeZone: tz })
				.toUpperCase()
		: "TODAY";

	return (
		<div className={styles.bottomStrip}>
			{/* Gold header strip */}
			<div
				className={styles.footerHeader}
				style={{ background: "#c8aa38", borderTop: "2px solid #a08828" }}
			>
				<span
					className={styles.footerCity}
					style={{ color: "#0d1f3a" }}
				>
					{location.city.toUpperCase()}:
				</span>
				<span className={styles.footerLabel} style={{ color: "#1a2d7a" }}>
					{dayName}'S FORECAST
				</span>
			</div>

			{/* Time slots */}
			<div
				className={styles.footerColumns}
				style={{
					background:
						"linear-gradient(180deg, #8ab4e4 0%, #6090cc 50%, #5080bc 100%)",
				}}
			>
				{(() => {
					const temps = slots.map((h) => h.tempF);
					const minT = Math.min(...temps);
					const maxT = Math.max(...temps);
					const tempRange = maxT - minT || 1;
					const BAR_MIN = 20;
					const BAR_MAX = 72;
					return slots.map((h, i) => {
						const rawHour = h.time.toLocaleTimeString("en-US", {
							timeZone: tz,
							hour: "numeric",
							hour12: true,
						});
						const timeLabel =
							rawHour === "12 PM" ? "noon" : rawHour.toLowerCase();

						const barH =
							BAR_MIN + ((h.tempF - minT) / tempRange) * (BAR_MAX - BAR_MIN);

						return (
							<div
								key={h.time.toISOString()}
								className={styles.footerColumn}
								style={{
									borderRight:
										i < slots.length - 1 ? "1px solid #3a5888" : undefined,
								}}
							>
								{/* Icon + temperature + bar */}
								<div className={styles.footerSlotBody}>
									<WeatherIcon
										code={h.conditionCode}
										isDay={h.isDay}
										className={styles.footerSlotIcon}
									/>
									{/* Temperature + silver bar stacked */}
									<div className={styles.footerTempBar}>
										<span
											className={styles.footerTemp}
											style={{ color: "#0a1428" }}
										>
											{h.tempF}
										</span>
										<div
											style={
												{
													"--bar-h": `${barH}px`,
													width: "100%",
													height: `${barH}px`,
													background:
														"linear-gradient(90deg, #555 0%, #bbb 25%, #f4f4f4 50%, #bbb 75%, #555 100%)",
													borderRadius: "2px 2px 0 0",
													animation: "grow-bar 1.2s ease-out both",
													animationDelay: `${i * 120}ms`,
												} as React.CSSProperties
											}
										/>
									</div>
								</div>

								{/* Time label band */}
								<div className={styles.footerTimeBand} style={{ background: "#6a5010" }}>
									<span
										className={styles.footerTimeLabel}
										style={{ color: "#ffffff" }}
									>
										{timeLabel}
									</span>
								</div>
							</div>
						);
					});
				})()}
			</div>
		</div>
	);
}

function LoadingScreen() {
	return (
		<div className={styles.loadingScreen}>
			<div
				className={styles.loadingTitle}
				style={{ color: "#d4a830" }}
			>
				Acquiring Data…
			</div>
			<div className={styles.loadingSubtitle} style={{ color: "#99bbdd" }}>
				Fetching conditions for your location
			</div>
		</div>
	);
}

function ErrorScreen({ onRetry }: { onRetry: () => void }) {
	return (
		<div className={styles.errorScreen}>
			<div className={styles.errorTitle} style={{ color: "#dd2200" }}>
				Unable to Load Weather
			</div>
			<div className={styles.errorSubtitle} style={{ color: "#99bbdd" }}>
				Check your connection and try again.
			</div>
			<button
				onClick={onRetry}
				className={styles.retryButton}
				style={{
					background: "#162870",
					color: "#d4a830",
					border: "1px solid #d4a830",
				}}
			>
				Retry
			</button>
		</div>
	);
}
