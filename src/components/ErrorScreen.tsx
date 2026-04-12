import styles from "./ErrorScreen.module.scss";

interface Props {
	onRetry: () => void;
}

export function ErrorScreen({ onRetry }: Props) {
	return (
		<div className={styles.container}>
			<div className={styles.title} style={{ color: "#dd2200" }}>
				Unable to Load Weather
			</div>
			<div className={styles.subtitle} style={{ color: "#99bbdd" }}>
				Check your connection and try again.
			</div>
			<button
				onClick={onRetry}
				className={styles.retryButton}
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
