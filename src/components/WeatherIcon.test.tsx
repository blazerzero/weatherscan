import { render, screen, waitFor } from "@testing-library/react";
import lottie from "lottie-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { WeatherIcon } from "./WeatherIcon";

vi.mock("@meteocons/lottie/fill/clear-day.json", () => ({ default: {} }));
vi.mock("@meteocons/lottie/fill/clear-night.json", () => ({ default: {} }));
vi.mock("@meteocons/lottie/fill/partly-cloudy-day.json", () => ({
	default: {},
}));
vi.mock("@meteocons/lottie/fill/overcast.json", () => ({ default: {} }));
vi.mock("@meteocons/lottie/fill/snow.json", () => ({ default: {} }));
vi.mock("@meteocons/lottie/fill/thunderstorms-day.json", () => ({
	default: {},
}));

describe("WeatherIcon", () => {
	beforeEach(() => {
		vi.mocked(lottie.loadAnimation).mockClear();
	});

	it('renders a div with role="img"', () => {
		render(<WeatherIcon code={0} isDay />);
		expect(screen.getByRole("img")).toBeInTheDocument();
	});

	it("includes an aria-label with the condition code", () => {
		render(<WeatherIcon code={2} isDay />);
		expect(screen.getByRole("img")).toHaveAttribute(
			"aria-label",
			"weather condition 2",
		);
	});

	it("applies a custom className", () => {
		const { container } = render(
			<WeatherIcon code={0} isDay className="custom-size" />,
		);
		expect(container.firstChild).toHaveClass("custom-size");
	});

	it("loads clear-day animation for code 0 daytime", async () => {
		render(<WeatherIcon code={0} isDay />);
		await waitFor(() => {
			expect(lottie.loadAnimation).toHaveBeenCalledWith(
				expect.objectContaining({ loop: true, autoplay: true }),
			);
		});
	});

	it("loads a different animation for night vs day", async () => {
		const { unmount } = render(<WeatherIcon code={0} isDay />);
		await waitFor(() => expect(lottie.loadAnimation).toHaveBeenCalledTimes(1));
		unmount();

		vi.mocked(lottie.loadAnimation).mockClear();
		render(<WeatherIcon code={0} isDay={false} />);
		await waitFor(() => expect(lottie.loadAnimation).toHaveBeenCalledTimes(1));
	});

	it("loads overcast animation for code 3", async () => {
		render(<WeatherIcon code={3} isDay />);
		await waitFor(() => {
			expect(lottie.loadAnimation).toHaveBeenCalledWith(
				expect.objectContaining({ animationData: {} }),
			);
		});
	});

	it("loads snow animation for code 71", async () => {
		render(<WeatherIcon code={71} isDay />);
		await waitFor(() => {
			expect(lottie.loadAnimation).toHaveBeenCalledWith(
				expect.objectContaining({ animationData: {} }),
			);
		});
	});

	it("loads thunderstorms-day animation for code 95", async () => {
		render(<WeatherIcon code={95} isDay />);
		await waitFor(() => {
			expect(lottie.loadAnimation).toHaveBeenCalledWith(
				expect.objectContaining({ animationData: {} }),
			);
		});
	});

	it("uses svg renderer", async () => {
		render(<WeatherIcon code={0} isDay />);
		await waitFor(() => {
			expect(lottie.loadAnimation).toHaveBeenCalledWith(
				expect.objectContaining({ renderer: "svg" }),
			);
		});
	});
});
