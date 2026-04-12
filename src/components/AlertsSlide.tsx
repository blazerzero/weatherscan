import type { CSSProperties } from "react";
import { COLORS } from "@/lib/constants";
import { formatAlertTime } from "@/lib/format";
import type { WeatherAlert } from "@/types/weather";
import styles from "./AlertsSlide.module.scss";

interface Props {
	alerts: WeatherAlert[];
}

const SEVERITY_COLORS: Record<
	WeatherAlert["severity"],
	{ text: string; border: string; bg: string }
> = {
	Extreme: { text: COLORS.red, border: COLORS.red, bg: "rgba(221,34,0,0.1)" },
	Severe: {
		text: COLORS.orange,
		border: COLORS.orange,
		bg: "rgba(238,119,0,0.1)",
	},
	Moderate: {
		text: COLORS.gold,
		border: COLORS.gold,
		bg: "rgba(212,168,48,0.1)",
	},
	Minor: {
		text: COLORS.green,
		border: COLORS.green,
		bg: "rgba(34,170,68,0.1)",
	},
	Unknown: {
		text: COLORS.textSecondary,
		border: COLORS.border,
		bg: "transparent",
	},
};

export function AlertsSlide({ alerts }: Props) {
	if (alerts.length === 0) {
		return (
			<div className={styles.noAlerts}>
				<div className={styles.noAlertsIcon}>✅</div>
				<div className={styles.noAlertsTitle}>No Active Alerts</div>
				<div className={styles.noAlertsDesc}>
					No warnings or advisories for your area.
				</div>
			</div>
		);
	}

	return (
		<div className={styles.alertList}>
			{alerts.map((a) => {
				const colors = SEVERITY_COLORS[a.severity];
				return (
					<div
						key={a.id}
						className={styles.alertCard}
						style={
							{
								"--sev-color": colors.text,
								"--sev-border": colors.border,
								"--sev-bg": colors.bg,
							} as CSSProperties
						}
					>
						<div className={styles.alertHeader}>
							<div className={styles.alertEvent}>{a.event}</div>
							<div className={styles.alertSeverity}>{a.severity}</div>
						</div>
						<div className={styles.alertArea}>{a.areaDesc}</div>
						<div className={styles.alertExpires}>
							Until: {formatAlertTime(a.expires)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
