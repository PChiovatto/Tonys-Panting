import { describe, expect, it } from "vitest";
import { newYorkDay, newYorkTimeToISO } from "./calendarTime";

describe("New York appointments", () => {
  it("uses EST in winter and EDT in summer", () => {
    expect(newYorkTimeToISO("2026-01-15", "09:00")).toBe("2026-01-15T14:00:00.000Z");
    expect(newYorkTimeToISO("2026-07-15", "09:00")).toBe("2026-07-15T13:00:00.000Z");
  });
  it("handles both sides of the DST transition", () => {
    expect(newYorkTimeToISO("2026-03-08", "01:30")).toBe("2026-03-08T06:30:00.000Z");
    expect(newYorkTimeToISO("2026-03-08", "03:30")).toBe("2026-03-08T07:30:00.000Z");
    expect(() => newYorkTimeToISO("2026-03-08", "02:30")).toThrow("does not exist");
    expect(newYorkTimeToISO("2026-11-01", "01:30")).toBe("2026-11-01T05:30:00.000Z");
  });
  it("groups an appointment by its New York day", () => {
    expect(newYorkDay("2026-09-15T01:00:00Z")).toBe("2026-09-14");
  });
  it("rejects invalid input", () => {
    expect(() => newYorkTimeToISO("2026-02-30", "09:00")).toThrow();
    expect(() => newYorkTimeToISO("2026-02-20", "25:00")).toThrow();
  });
});
