import { COLORS } from "@/lib/constants";

interface Props {
	title: string;
	city?: string;
	/** When true, renders in alert-red rather than the standard gold. */
	alert?: boolean;
}

export function SlideHeader({ title, city, alert = false }: Props) {
	return (
		<div
			className="relative flex items-center justify-between px-3 py-1.5 shrink-0 overflow-hidden"
			style={{
				background: alert ? "#3a0808" : COLORS.panelDark,
				borderBottom: `2px solid ${alert ? COLORS.red : COLORS.gold}`,
			}}
		>
			<span
				className="font-bold text-base tracking-wide"
				style={{ color: "#ffffff" }}
			>
				{title}
			</span>

			{city && (
				<span
					className="font-bold text-base"
					style={{ color: "#ffffff", paddingRight: "2.5rem" }}
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
