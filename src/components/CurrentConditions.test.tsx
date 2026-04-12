import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CURRENT, CURRENT_CALM } from "@/test/fixtures";
import { CurrentConditions } from "./CurrentConditions";

describe("CurrentConditions", () => {
	it("renders the temperature", () => {
		render(<CurrentConditions data={CURRENT} />);
		expect(
			screen.getByText(String(CURRENT.temperatureF)),
		).toBeInTheDocument();
	});

	it("renders the condition label", () => {
		render(<CurrentConditions data={CURRENT} />);
		expect(screen.getByText("Partly Cloudy")).toBeInTheDocument();
	});

	it("renders humidity", () => {
		render(<CurrentConditions data={CURRENT} />);
		expect(screen.getByText(`${CURRENT.humidityPct}%`)).toBeInTheDocument();
	});

	it("renders dew point", () => {
		render(<CurrentConditions data={CURRENT} />);
		expect(
			screen.getByText(String(CURRENT.dewpointF)),
		).toBeInTheDocument();
	});

	it("renders pressure with trend indicator", () => {
		render(<CurrentConditions data={CURRENT} />);
		expect(
			screen.getByText(`${CURRENT.pressureInHg} ↓`),
		).toBeInTheDocument();
	});

	it("renders wind direction and speed", () => {
		render(<CurrentConditions data={CURRENT} />);
		expect(screen.getByText(/W 12/)).toBeInTheDocument();
	});

	it('renders "Calm" when wind speed is zero', () => {
		render(<CurrentConditions data={CURRENT_CALM} />);
		expect(screen.getByText("Calm")).toBeInTheDocument();
	});

	it("renders gust speed when present", () => {
		render(<CurrentConditions data={CURRENT} />);
		expect(screen.getByText("18")).toBeInTheDocument();
	});

	it('renders "none" for gusts when windGustMph is null', () => {
		render(<CurrentConditions data={CURRENT_CALM} />);
		expect(screen.getByText("none")).toBeInTheDocument();
	});

	it("renders wind chill / feels-like", () => {
		render(<CurrentConditions data={CURRENT} />);
		expect(
			screen.getByText(String(CURRENT.feelsLikeF)),
		).toBeInTheDocument();
	});

	it("renders a weather icon", () => {
		render(<CurrentConditions data={CURRENT} />);
		expect(screen.getByRole("img")).toBeInTheDocument();
	});
});
