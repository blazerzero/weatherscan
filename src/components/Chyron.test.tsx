import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ALERT } from "@/test/fixtures";
import { Chyron } from "./Chyron";

// The Chyron uses useNationalHeadlines which calls TanStack Query.
// Wrap with a QueryClient that has no data so it shows fallback.
function wrapper({ children }: { children: React.ReactNode }) {
	const client = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});
	return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

// Also stub the fetch for the national headlines query
vi.stubGlobal(
	"fetch",
	vi.fn().mockResolvedValue({
		ok: false, // so headlines come back empty
	}),
);

describe("Chyron", () => {
	it("renders the location badge when there are no alerts", () => {
		render(<Chyron localAlerts={[]} locationName="Philadelphia" />, {
			wrapper,
		});
		expect(screen.getByText(/PHILAD/)).toBeInTheDocument(); // truncated to 8 chars
	});

	it("renders the ALERT badge when alerts are present", () => {
		render(<Chyron localAlerts={[ALERT]} locationName="Philadelphia" />, {
			wrapper,
		});
		expect(screen.getByText(/ALERT/)).toBeInTheDocument();
	});

	it("renders the scrolling track element", () => {
		const { container } = render(
			<Chyron localAlerts={[]} locationName="Philadelphia" />,
			{ wrapper },
		);
		expect(container.querySelector(".chyron-track")).toBeInTheDocument();
	});

	it("includes alert event name in the scrolling text when alerts present", () => {
		render(<Chyron localAlerts={[ALERT]} locationName="Philadelphia" />, {
			wrapper,
		});
		expect(screen.getByText(/Tornado Watch/)).toBeInTheDocument();
	});

	it("shows fallback headlines when there are no local alerts or national data", () => {
		render(<Chyron localAlerts={[]} locationName="Philadelphia" />, {
			wrapper,
		});
		// The chyron-track should contain the fallback text
		const track = document.querySelector(".chyron-track");
		expect(track?.textContent).toContain("WeatherScan");
	});

	it("doubles the text for seamless looping", () => {
		render(<Chyron localAlerts={[ALERT]} locationName="Philadelphia" />, {
			wrapper,
		});
		// The doubled text should appear at least twice in the track
		const track = document.querySelector(".chyron-track");
		const count = (track?.textContent?.match(/Tornado Watch/g) ?? []).length;
		expect(count).toBeGreaterThanOrEqual(2);
	});
});
