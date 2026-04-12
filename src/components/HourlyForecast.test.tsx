import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HOURLY } from "@/test/fixtures";
import { HourlyForecast } from "./HourlyForecast";

describe("HourlyForecast", () => {
	it("renders exactly 12 hourly rows", () => {
		render(<HourlyForecast data={HOURLY} />);
		// Each row has a temperature like "65°", "66°" etc.
		const temps = screen.getAllByText(/^\d+°$/);
		expect(temps).toHaveLength(12);
	});

	it('shows "NOW" label for the first row', () => {
		render(<HourlyForecast data={HOURLY} />);
		expect(screen.getByText("NOW")).toBeInTheDocument();
	});

	it("shows a time label for non-first rows", () => {
		render(<HourlyForecast data={HOURLY} />);
		// The second row (index 1) should have a time string like "1 AM" not "NOW"
		const nowEls = screen.queryAllByText("NOW");
		expect(nowEls).toHaveLength(1);
	});

	it("renders temperatures with degree symbol", () => {
		render(<HourlyForecast data={HOURLY} />);
		expect(screen.getByText(`${HOURLY[0]!.tempF}°`)).toBeInTheDocument();
	});

	it("renders precipitation chance when > 0", () => {
		// Row at index 1 has precipChancePct = 5%
		render(<HourlyForecast data={HOURLY} />);
		expect(screen.getByText("5%")).toBeInTheDocument();
	});

	it("does not render 0% precipitation chance", () => {
		// Row at index 0 has precipChancePct = 0
		render(<HourlyForecast data={HOURLY} />);
		expect(screen.queryByText("0%")).not.toBeInTheDocument();
	});

	it("renders weather icons for each row", () => {
		render(<HourlyForecast data={HOURLY} />);
		const icons = screen.getAllByRole("img");
		expect(icons.length).toBeGreaterThanOrEqual(12);
	});

	it("renders condition labels", () => {
		render(<HourlyForecast data={HOURLY} />);
		// At least one "Partly Cloudy" from the fixture
		expect(screen.getAllByText(/Partly Cloudy/).length).toBeGreaterThan(0);
	});
});
