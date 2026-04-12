import styles from "./LoadingScreen.module.scss";

export function LoadingScreen() {
	return (
		<div className={styles.container}>
			<div className={styles.title} style={{ color: "#d4a830" }}>
				Acquiring Data…
			</div>
			<div className={styles.subtitle} style={{ color: "#99bbdd" }}>
				Fetching conditions for your location
			</div>
		</div>
	);
}
