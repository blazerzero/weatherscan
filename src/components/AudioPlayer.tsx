import cn from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./AudioPlayer.module.scss";

// Free smooth jazz internet radio stream
const STREAM_URL = "https://streaming.live365.com/a18141";

// Royalty-free bundled fallback tracks (MP3 files in public/music/)
const BUNDLED_TRACKS = [
	"/music/track1.mp3",
	"/music/track2.mp3",
	"/music/track3.mp3",
];

type Mode = "stream" | "bundled";

function getStoredMute(): boolean {
	try {
		return localStorage.getItem("ws-muted") === "true";
	} catch {
		return false;
	}
}

function setStoredMute(v: boolean) {
	try {
		localStorage.setItem("ws-muted", String(v));
	} catch {
		/* ignore */
	}
}

export function AudioPlayer() {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [muted, setMuted] = useState(getStoredMute);
	const [started, setStarted] = useState(false);
	const [mode, setMode] = useState<Mode>("stream");
	const [trackIdx, setTrackIdx] = useState(0);

	const online = typeof navigator !== "undefined" ? navigator.onLine : true;
	const [isOnline, setIsOnline] = useState(online);

	useEffect(() => {
		const onOnline = () => setIsOnline(true);
		const onOffline = () => setIsOnline(false);
		window.addEventListener("online", onOnline);
		window.addEventListener("offline", onOffline);
		return () => {
			window.removeEventListener("online", onOnline);
			window.removeEventListener("offline", onOffline);
		};
	}, []);

	// Switch mode based on connectivity
	useEffect(() => {
		setMode(isOnline ? "stream" : "bundled");
	}, [isOnline]);

	const src =
		mode === "stream"
			? STREAM_URL
			: (BUNDLED_TRACKS[trackIdx % BUNDLED_TRACKS.length] ?? "");

	// Apply src + muted state to audio element
	useEffect(() => {
		const el = audioRef.current;
		if (!el) return;
		el.muted = muted;
		if (started) {
			if (el.src !== src) {
				el.src = src;
				el.load();
				el.play().catch(console.error);
			}
		}
	}, [src, muted, started]);

	const handleTuneIn = useCallback(() => {
		setStarted(true);
		const el = audioRef.current;
		if (!el) return;
		el.src = src;
		el.muted = muted;
		el.load();
		el.play().catch(() => {
			/* blocked */
		});
	}, [src, muted]);

	const toggleMute = useCallback(() => {
		setMuted((m) => {
			const next = !m;
			setStoredMute(next);
			if (audioRef.current) audioRef.current.muted = next;
			return next;
		});
	}, []);

	const handleEnded = useCallback(() => {
		if (mode === "bundled") {
			setTrackIdx((i) => (i + 1) % BUNDLED_TRACKS.length);
		}
	}, [mode]);

	return (
		<div className={styles.player}>
			<audio ref={audioRef} onEnded={handleEnded} preload="none" />

			{!started ? (
				<button onClick={handleTuneIn} className={styles.button}>
					▶ Tune In
				</button>
			) : (
				<button
					onClick={toggleMute}
					className={cn(styles.button, muted && styles.muted)}
					title={muted ? "Unmute" : "Mute"}
				>
					{muted ? "🔇" : "🎵"} {muted ? "Muted" : "Jazz"}
				</button>
			)}

			{started && !isOnline && (
				<span className={styles.offlineLabel}>offline mode</span>
			)}
		</div>
	);
}
