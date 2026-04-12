import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WeatherIcon } from "./WeatherIcon";

describe("WeatherIcon", () => {
	it('renders a span with role="img"', () => {
		render(<WeatherIcon code={0} isDay />);
		expect(screen.getByRole("img")).toBeInTheDocument();
	});

	it("renders the clear-day symbol for code 0 daytime", () => {
		const { container } = render(<WeatherIcon code={0} isDay />);
		expect(container.textContent).toBe("☀");
	});

	it("renders the star for code 0 night", () => {
		const { container } = render(<WeatherIcon code={0} isDay={false} />);
		expect(container.textContent).toBe("★");
	});

	it("renders cloud for overcast (code 3)", () => {
		const { container } = render(<WeatherIcon code={3} isDay />);
		expect(container.textContent).toBe("☁");
	});

	it("renders snow symbol for code 71", () => {
		const { container } = render(<WeatherIcon code={71} isDay />);
		expect(container.textContent).toBe("❄");
	});

	it("renders thunderstorm symbol for code 95", () => {
		const { container } = render(<WeatherIcon code={95} isDay />);
		expect(container.textContent).toBe("⛈");
	});

	it("applies a custom className", () => {
		const { container } = render(
			<WeatherIcon code={0} isDay className="text-4xl" />,
		);
		expect(container.firstChild).toHaveClass("text-4xl");
	});

	it("includes an aria-label", () => {
		render(<WeatherIcon code={2} isDay />);
		expect(screen.getByRole("img")).toHaveAttribute(
			"aria-label",
			"weather condition 2",
		);
	});
});
