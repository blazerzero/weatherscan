import cn from "classnames";
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { MainPanelSlideType } from "@/types/weather";
import styles from "./CategoryTicker.module.scss";

interface Props {
	slides: MainPanelSlideType[];
	activeIndex: number;
}

const TICKER_NAMES: Record<MainPanelSlideType, string> = {
	currently: "CURRENT",
	"7day": "7-DAY",
	radar: "RADAR",
	alerts: "ALERTS",
};

export function CategoryTicker({ slides, activeIndex }: Props) {
	const n = Math.max(slides.length, 1);
	const COPIES = 50;
	const MID = Math.floor(COPIES / 2);
	const SLOT_W = 105;
	const SEP_W = 36; // 20px width + 8px padding each side (0.5rem @ 16px base)
	const STRIDE = SLOT_W + SEP_W;

	const contRef = useRef(MID * n + activeIndex);
	const prevActive = useRef(activeIndex);
	const [track, setTrack] = useState({ x: 8, animated: false });

	const getX = (pos: number) => -(pos * STRIDE) + 8;

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
		<div className={styles.ticker}>
			<div className={styles.strip}>
				<div
					className={styles.track}
					style={{
						transform: `translateX(${track.x}px)`,
						transition: track.animated
							? "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
							: "none",
					}}
				>
					{allItems.map((slide, i) => (
						<Fragment key={i}>
							{i > 0 && <span className={styles.innerSep}>{"<"}</span>}
							<span
								className={cn(
									styles.slot,
									i === contRef.current && styles.slotActive,
								)}
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
