import { describe, it, expect } from "vitest";
import { uvLabel, formatAlertTime } from "./format";

describe("uvLabel", () => {
	it("0 → Low", () => expect(uvLabel(0)).toBe("0 Low"));
	it("1 → Low", () => expect(uvLabel(1)).toBe("1 Low"));
	it("2 → Low", () => expect(uvLabel(2)).toBe("2 Low"));
	it("3 → Moderate", () => expect(uvLabel(3)).toBe("3 Moderate"));
	it("5 → Moderate", () => expect(uvLabel(5)).toBe("5 Moderate"));
	it("6 → High", () => expect(uvLabel(6)).toBe("6 High"));
	it("7 → High", () => expect(uvLabel(7)).toBe("7 High"));
	it("8 → V.High", () => expect(uvLabel(8)).toBe("8 V.High"));
	it("10 → V.High", () => expect(uvLabel(10)).toBe("10 V.High"));
	it("11 → Extreme", () => expect(uvLabel(11)).toBe("11 Extreme"));
	it("20 → Extreme", () => expect(uvLabel(20)).toBe("20 Extreme"));
});

describe("formatAlertTime", () => {
	it('returns "--" for null', () => expect(formatAlertTime(null)).toBe("--"));

	it("includes time in AM/PM format", () => {
		const d = new Date("2024-06-01T14:30:00Z");
		const result = formatAlertTime(d);
		expect(result).toMatch(/[AP]M/);
	});

	it("includes a month abbreviation", () => {
		const d = new Date("2024-06-01T14:30:00Z");
		const result = formatAlertTime(d);
		expect(result).toMatch(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/);
	});

	it("includes a weekday abbreviation", () => {
		const d = new Date("2024-06-03T12:00:00Z"); // Monday
		const result = formatAlertTime(d);
		expect(result).toMatch(/Sun|Mon|Tue|Wed|Thu|Fri|Sat/);
	});

	it("includes the day number", () => {
		const d = new Date("2024-06-15T12:00:00Z");
		const result = formatAlertTime(d);
		expect(result).toContain("15");
	});

	it("produces consistent output for the same input", () => {
		const d = new Date("2024-01-20T08:00:00Z");
		expect(formatAlertTime(d)).toBe(formatAlertTime(d));
	});
});
