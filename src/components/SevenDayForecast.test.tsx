import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DAILY } from "@/test/fixtures";
import { SevenDayForecast } from "./SevenDayForecast";

describe("SevenDayForecast", () => {
	it("renders exactly 7 day rows", () => {
		render(<SevenDayForecast data={DAILY} />);
		// Each day has a high and a low rendered as bare numbers
		const temps = screen.getAllByText(/^\d+$/);
		// 7 highs + 7 lows = 14 elements
		expect(temps).toHaveLength(14);
	});

	it('labels the first row as "Today"', () => {
		render(<SevenDayForecast data={DAILY} />);
		expect(screen.getByText("Today")).toBeInTheDocument();
	});

	it("renders abbreviated day names for subsequent rows", () => {
		render(<SevenDayForecast data={DAILY} />);
		// Days 2-7 should have weekday abbreviations like "Sun", "Mon", etc.
		const dayLabels = screen.getAllByText(/^(Sun|Mon|Tue|Wed|Thu|Fri|Sat)$/);
		expect(dayLabels.length).toBeGreaterThanOrEqual(6);
	});

	it("renders the high temperature for each day", () => {
		render(<SevenDayForecast data={DAILY} />);
		expect(screen.getByText(`${DAILY[0]!.highF}`)).toBeInTheDocument();
	});

	it("renders the low temperature for each day", () => {
		render(<SevenDayForecast data={DAILY} />);
		expect(screen.getByText(`${DAILY[0]!.lowF}`)).toBeInTheDocument();
	});

	it("renders weather icons for each day", () => {
		render(<SevenDayForecast data={DAILY} />);
		const icons = screen.getAllByRole("img");
		expect(icons).toHaveLength(7);
	});

	it("only uses the first 7 days from a longer array", () => {
		const manyDays = Array.from({ length: 14 }, (_, i) => ({
			...DAILY[0]!,
			date: new Date(Date.UTC(2024, 5, 1 + i)),
		}));
		render(<SevenDayForecast data={manyDays} />);
		// Still only 7 days rendered
		expect(screen.getAllByRole("img")).toHaveLength(7);
	});
});
