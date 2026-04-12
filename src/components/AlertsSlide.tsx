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
				<div
					className={styles.noAlertsTitle}
					style={{ color: COLORS.green }}
				>
					No Active Alerts
				</div>
				<div className={styles.noAlertsDesc} style={{ color: COLORS.textDim }}>
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
						style={{
							border: `1px solid ${colors.border}`,
							background: colors.bg,
						}}
					>
						<div className={styles.alertHeader}>
							<div
								className={styles.alertEvent}
								style={{ color: colors.text }}
							>
								{a.event}
							</div>
							<div
								className={styles.alertSeverity}
								style={{
									color: colors.text,
									border: `1px solid ${colors.border}`,
								}}
							>
								{a.severity}
							</div>
						</div>
						<div
							className={styles.alertArea}
							style={{ color: COLORS.textSecondary }}
						>
							{a.areaDesc}
						</div>
						<div className={styles.alertExpires} style={{ color: COLORS.textDim }}>
							Until: {formatAlertTime(a.expires)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
