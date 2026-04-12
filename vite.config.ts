import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import ogPlugin from "vite-plugin-open-graph";
import { VitePWA } from "vite-plugin-pwa";

const env = loadEnv(
	process.env.NODE_ENV as string,
	path.resolve(__dirname, ".."),
	"VITE_",
);

export default defineConfig({
	resolve: {
		alias: [
			{ find: "@", replacement: new URL("./src", import.meta.url).pathname },
		],
	},
	plugins: [
		react(),
		ogPlugin({
			basic: {
				title: "Weatherscan",
				description:
					"Your local weather at a glance — a modern take on the classic Weatherscan channel.",
				url: env.VITE_DEPLOY_URL,
				image: env.VITE_OG_IMAGE_URL,
			},
		}),
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: ["favicon.svg", "icons/*.png", "music/*.mp3"],
			manifest: {
				name: "Weatherscan",
				short_name: "Weatherscan",
				description:
					"Local weather at a glance — a modern take on the classic Weatherscan channel.",
				theme_color: "#003366",
				background_color: "#001133",
				display: "standalone",
				orientation: "landscape",
				icons: [
					{
						src: "icons/icon-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "icons/icon-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
					{
						src: "icons/icon-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
				],
			},
			workbox: {
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/i,
						handler: "StaleWhileRevalidate",
						options: {
							cacheName: "open-meteo-cache",
							expiration: { maxAgeSeconds: 300 },
						},
					},
					{
						urlPattern: /^https:\/\/api\.weather\.gov\/.*/i,
						handler: "StaleWhileRevalidate",
						options: {
							cacheName: "nws-cache",
							expiration: { maxAgeSeconds: 300 },
						},
					},
					{
						urlPattern: /^https:\/\/api\.rainviewer\.com\/.*/i,
						handler: "StaleWhileRevalidate",
						options: {
							cacheName: "rainviewer-cache",
							expiration: { maxAgeSeconds: 300 },
						},
					},
				],
			},
		}),
	],
});
