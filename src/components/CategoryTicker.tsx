import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { SlideType } from "@/types/weather";
import styles from "./CategoryTicker.module.scss";

interface Props {
	city: string | null;
	slides: SlideType[];
	activeIndex: number;
}

const TICKER_NAMES: Record<SlideType, string> = {
	currently: "CURRENT",
	hourly: "HOURLY",
	"7day": "7-DAY",
	radar: "RADAR",
	alerts: "ALERTS",
};

export function CategoryTicker({ city, slides, activeIndex }: Props) {
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
		<div className={styles.ticker} style={{ background: "#0a0a22" }}>
			<span className={styles.city} style={{ color: "#d4a830" }}>
				{(city ?? "WEATHERSCAN").toUpperCase()}
			</span>
			<span className={styles.sep} style={{ color: "#333355" }}>
				{"<"}
			</span>

			<div ref={containerRef} className={styles.strip}>
				<div
					className={styles.track}
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
