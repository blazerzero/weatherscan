import { COLORS } from "@/lib/constants";
import styles from "./SlideHeader.module.scss";

interface Props {
	title: string;
	city?: string;
	/** When true, renders in alert-red rather than the standard gold. */
	alert?: boolean;
}

export function SlideHeader({ title, city, alert = false }: Props) {
	return (
		<div
			className={styles.header}
			style={{
				background: alert ? "#3a0808" : COLORS.panelDark,
				borderBottom: `2px solid ${alert ? COLORS.red : COLORS.gold}`,
			}}
		>
			<span
				className={styles.title}
				style={{ color: "#ffffff" }}
			>
				{title}
			</span>

			{city && (
				<span
					className={styles.city}
					style={{ color: "#ffffff" }}
				>
					{city}
				</span>
			)}

			{/* Gold / red diagonal corner triangle */}
			<div
				style={{
					position: "absolute",
					right: 0,
					top: 0,
					width: 0,
					height: 0,
					borderStyle: "solid",
					borderWidth: "0 48px 48px 0",
					borderColor: `transparent ${alert ? COLORS.red : COLORS.gold} transparent transparent`,
				}}
			/>
		</div>
	);
}
