import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { MainPanelSlideType } from "@/types/weather";
import { useSlideRotation } from "./useSlideRotation";

const ALL_SLIDES: MainPanelSlideType[] = [
	"currently",
	"radar",
	"7day",
	"alerts",
];
const THREE_SLIDES: MainPanelSlideType[] = ["currently", "radar", "7day"];

describe("useSlideRotation", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("starts at index 0 with the first slide", () => {
		const { result } = renderHook(() => useSlideRotation(ALL_SLIDES));
		expect(result.current.index).toBe(0);
		expect(result.current.current).toBe("currently");
	});

	it("advance() moves to the next slide", () => {
		const { result } = renderHook(() => useSlideRotation(ALL_SLIDES));
		act(() => result.current.advance());
		expect(result.current.index).toBe(1);
		expect(result.current.current).toBe("radar");
	});

	it("advance() wraps around from last to first slide", () => {
		const { result } = renderHook(() => useSlideRotation(ALL_SLIDES));
		// Advance 3 times to reach index 3 (alerts)
		act(() => result.current.advance());
		act(() => result.current.advance());
		act(() => result.current.advance());
		expect(result.current.current).toBe("alerts");
		// One more advance should wrap to 0
		act(() => result.current.advance());
		expect(result.current.index).toBe(0);
		expect(result.current.current).toBe("currently");
	});

	it("goTo() jumps to a specific index", () => {
		const { result } = renderHook(() => useSlideRotation(ALL_SLIDES));
		act(() => result.current.goTo(2));
		expect(result.current.index).toBe(2);
		expect(result.current.current).toBe("7day");
	});

	it("goTo() wraps via modulo", () => {
		const { result } = renderHook(() => useSlideRotation(ALL_SLIDES));
		act(() => result.current.goTo(4)); // 4 % 4 = 0
		expect(result.current.index).toBe(0);
	});

	it("auto-advances after 15 seconds", () => {
		const { result } = renderHook(() => useSlideRotation(ALL_SLIDES));
		expect(result.current.index).toBe(0);
		act(() => vi.advanceTimersByTime(15_000));
		expect(result.current.index).toBe(1);
	});

	it("auto-advances multiple times over 45 seconds", () => {
		const { result } = renderHook(() => useSlideRotation(ALL_SLIDES));
		act(() => vi.advanceTimersByTime(45_000));
		expect(result.current.index).toBe(3); // advanced 3 times
	});

	it("resets to index 0 if current index is out of bounds after slides shrink", () => {
		let slides: MainPanelSlideType[] = ALL_SLIDES;
		const { result, rerender } = renderHook(() => useSlideRotation(slides));
		act(() => result.current.goTo(3)); // index 3 = alerts
		slides = THREE_SLIDES; // alerts removed
		rerender();
		expect(result.current.index).toBe(0);
		expect(result.current.current).toBe("currently");
	});

	it("does not go negative when index equals slides.length after shrink", () => {
		let slides: MainPanelSlideType[] = ["7day"];
		const { result, rerender } = renderHook(() => useSlideRotation(slides));
		act(() => result.current.goTo(1));
		slides = ["7day"]; // remove second
		rerender();
		expect(result.current.index).toBe(0);
	});

	it("clears the interval on unmount", () => {
		const clearSpy = vi.spyOn(globalThis, "clearInterval");
		const { unmount } = renderHook(() => useSlideRotation(ALL_SLIDES));
		unmount();
		expect(clearSpy).toHaveBeenCalled();
	});
});
