import styles from "./LoadingScreen.module.scss";

export function LoadingScreen() {
	return (
		<div className={styles.container}>
			<div className={styles.title}>Acquiring Data…</div>
			<div className={styles.subtitle}>
				Fetching conditions for your location
			</div>
		</div>
	);
}
