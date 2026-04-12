import styles from "./ErrorScreen.module.scss";

interface Props {
	onRetry: () => void;
}

export function ErrorScreen({ onRetry }: Props) {
	return (
		<div className={styles.container}>
			<div className={styles.title}>Unable to Load Weather</div>
			<div className={styles.subtitle}>
				Check your connection and try again.
			</div>
			<button onClick={onRetry} className={styles.retryButton}>
				Retry
			</button>
		</div>
	);
}
