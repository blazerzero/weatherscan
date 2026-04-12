import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
	},
	test: {
		environment: "happy-dom",
		globals: true,
		setupFiles: ["./src/test/setup.ts"],
		coverage: {
			provider: "v8",
			reporter: ["text", "lcov"],
			include: ["src/**/*.{ts,tsx}"],
			exclude: ["src/main.tsx", "src/vite-env.d.ts", "src/test/**"],
		},
	},
});
