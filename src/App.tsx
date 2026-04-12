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
import type { Coordinates, DailyForecast, HourlyPoint, LocationInfo, SlideType } from "@/types/weather";

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
			className="w-screen h-screen overflow-hidden flex flex-col"
			style={{
				background:
					"linear-gradient(160deg, #72bde8 0%, #4a9ad0 50%, #3a80bc 100%)",
			}}
		>
			{/* Main row */}
			<div className="flex flex-1 overflow-hidden">
				{/* Left sidebar */}
				<div className="shrink-0 flex flex-col" style={{ width: "33%" }}>
					{showLocationSearch ? (
						<LocationSearch
							onLocationFound={(loc) => setManualLocation(loc)}
						/>
					) : (
						<Sidebar
							location={activeLocation}
							current={data?.current ?? null}
							isLoading={isLoading && !data}
						/>
					)}
				</div>

				{/* Right content column */}
				<div className="flex-1 flex flex-col overflow-hidden">
					{/* Category ticker */}
					<CategoryTicker
						city={activeLocation?.city ?? null}
						slides={slides}
						activeIndex={slideIndex}
					/>

					{/* Blue main panel */}
					<div
						className="flex-1 overflow-hidden"
						style={{ background: "#2244b0" }}
					>
						{isLoading && !data ? (
							<LoadingScreen />
						) : isError ? (
							<ErrorScreen onRetry={() => setManualLocation(null)} />
						) : data ? (
							<SlidePanel
								data={data}
								current={current}
							/>
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
					className="absolute top-2 right-2 text-sm px-2 py-0.5 rounded z-30"
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
			className="shrink-0 flex items-center overflow-hidden"
			style={{ height: "1.625rem", background: "#0a0a22" }}
		>
			{/* Fixed city label */}
			<span
				className="shrink-0 text-xs font-bold tracking-wider px-2 whitespace-nowrap"
				style={{ color: "#d4a830" }}
			>
				{(city ?? "WEATHERSCAN").toUpperCase()}
			</span>
			<span className="shrink-0 text-xs px-1" style={{ color: "#333355" }}>
				{"<"}
			</span>

			{/* Infinite sliding strip */}
			<div ref={containerRef} className="flex-1 h-full overflow-hidden relative">
				<div
					className="absolute inset-y-0 left-0 flex items-center"
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
			className="shrink-0"
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
				className="flex items-center gap-2 px-3 py-1"
				style={{ background: "#c8aa38", borderTop: "2px solid #a08828" }}
			>
				<span
					className="text-base font-bold uppercase tracking-wide"
					style={{ color: "#0d1f3a" }}
				>
					{location.city.toUpperCase()}:
				</span>
				<span className="text-base font-bold" style={{ color: "#1a2d7a" }}>
					5 DAY FORECAST
				</span>
			</div>

			{/* Day columns */}
			<div
				className="flex"
				style={{
					background:
						"linear-gradient(180deg, #8ab4e4 0%, #6090cc 50%, #5080bc 100%)",
					height: "10rem",
				}}
			>
				{days.map((d, i) => {
					const dayLabel = d.date
						.toLocaleDateString("en-US", { weekday: "short", timeZone: tz })
						.toUpperCase();
					return (
						<div
							key={d.date.toISOString()}
							className="flex-1 flex flex-col"
							style={{
								borderRight:
									i < days.length - 1 ? "1px solid #3a5888" : undefined,
							}}
						>
							{/* Day name */}
							<div
								className="px-2 py-1"
								style={{ background: i === 0 ? "#9abce8" : "#5a7ec0" }}
							>
								<span
									className="text-sm font-bold"
									style={{ color: "#0a1840" }}
								>
									{dayLabel}
								</span>
							</div>

							{/* Icon + high / low */}
							<div className="flex-1 flex items-center px-2 gap-2">
								<WeatherIcon
									code={d.conditionCode}
									isDay
									className="text-3xl leading-none shrink-0"
								/>
								<div className="flex flex-col leading-none">
									<span
										className="text-3xl font-bold"
										style={{ color: "#0a1428" }}
									>
										{d.highF}
									</span>
									<span
										className="text-lg font-bold"
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
		<div className="shrink-0">
			{/* Gold header strip */}
			<div
				className="flex items-center gap-2 px-3 py-1"
				style={{ background: "#c8aa38", borderTop: "2px solid #a08828" }}
			>
				<span
					className="text-base font-bold uppercase tracking-wide"
					style={{ color: "#0d1f3a" }}
				>
					{location.city.toUpperCase()}:
				</span>
				<span className="text-base font-bold" style={{ color: "#1a2d7a" }}>
					{dayName}'S FORECAST
				</span>
			</div>

			{/* Time slots */}
			<div
				className="flex"
				style={{
					background:
						"linear-gradient(180deg, #8ab4e4 0%, #6090cc 50%, #5080bc 100%)",
					height: "10rem",
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
							className="flex-1 flex flex-col"
							style={{
								borderRight:
									i < slots.length - 1 ? "1px solid #3a5888" : undefined,
							}}
						>
							{/* Icon + temperature + bar */}
							<div className="flex items-end justify-between px-2 pt-2 pb-1 flex-1">
								<WeatherIcon
									code={h.conditionCode}
									isDay={h.isDay}
									className="text-3xl leading-none self-center"
								/>
								{/* Temperature + silver bar stacked */}
								<div className="flex flex-col items-center gap-0.5">
									<span
										className="text-4xl font-bold leading-none"
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
							<div
								className="px-2 py-1"
								style={{ background: "#6a5010" }}
							>
								<span
									className="text-sm font-bold"
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
		<div className="flex flex-col items-center justify-center h-full gap-4">
			<div
				className="text-2xl font-bold tracking-widest uppercase animate-pulse"
				style={{ color: "#d4a830" }}
			>
				Acquiring Data…
			</div>
			<div className="text-sm" style={{ color: "#99bbdd" }}>
				Fetching conditions for your location
			</div>
		</div>
	);
}

function ErrorScreen({ onRetry }: { onRetry: () => void }) {
	return (
		<div className="flex flex-col items-center justify-center h-full gap-4">
			<div className="text-2xl font-bold" style={{ color: "#dd2200" }}>
				Unable to Load Weather
			</div>
			<div className="text-sm" style={{ color: "#99bbdd" }}>
				Check your connection and try again.
			</div>
			<button
				onClick={onRetry}
				className="px-4 py-1.5 rounded text-sm font-bold uppercase tracking-wider cursor-pointer"
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
