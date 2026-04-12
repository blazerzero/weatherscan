/** Query refresh / stale-time intervals (milliseconds) */
export const FIVE_MIN = 5 * 60 * 1000;
export const THIRTY_MIN = 30 * 60 * 1000;

export const COLORS = {
	// Sky-blue sidebar / overall background
	skyLight: "#72bde8",
	skyMid: "#4a9ad0",
	skyDark: "#3a80bc",

	// Deep-blue right panel
	panelBg: "#2244b0",
	panelDark: "#162870",
	panelMid: "#2a52bc",

	// Dark text on the sky-blue sidebar
	navyText: "#0d1f3a",
	navyMid: "#1a3a6a",
	navyLight: "#2a5a8a",

	// Gold / yellow accents
	gold: "#d4a830",
	goldBright: "#e8c040",
	cityBand: "#c8aa38",

	// Category ticker
	tickerBg: "#0a0a22",

	// Text on dark panels
	panelLabel: "#d4a830",
	panelValue: "#ffffff",
	panelMuted: "#99bbdd",

	// Alerts / status
	red: "#dd2200",
	orange: "#ee7700",
	green: "#22aa44",

	// Bottom chyron
	chyronBg: "#484848",

	// Legacy aliases — preserve existing component usage
	blueDarkest: "#000d1a",
	blueDark: "#162870",
	blueMid: "#2244b0",
	blueLight: "#2a52bc",
	blueBright: "#3a7add",
	blueAccent: "#5599ee",
	cyan: "#4499dd",
	goldDark: "#aa8820",
	textPrimary: "#ffffff",
	textSecondary: "#99bbdd",
	textTertiary: "#7799bb",
	textDim: "#5577aa",
	border: "#2a44a8",
	borderDark: "#162870",
} as const;

/** Monospace font stack used for numeric readouts */
export const MONO_FONT = "Courier New, monospace" as const;
