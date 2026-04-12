import cn from "classnames";
import type { ReactNode } from "react";
import styles from "./SlideHeader.module.scss";

interface Props {
	title: ReactNode;
	/** When true, renders in alert-red rather than the standard gold. */
	alert?: boolean;
}

export function SlideHeader({ title, alert = false }: Props) {
	return (
		<div className={cn(styles.header, alert && styles.alert)}>
			<span className={styles.title}>{title}</span>

			{/* Gold / red diagonal corner triangle */}
			<div className={cn(styles.triangle, alert && styles.alert)} />
		</div>
	);
}
