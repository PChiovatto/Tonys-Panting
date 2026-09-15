import { describe, expect, it, vi, beforeEach } from "vitest";
const { insert } = vi.hoisted(() => ({ insert: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { from: () => ({ insert }) } }));
import { submitLead, validateContactDetails } from "./leadSubmission";

describe("lead submission", () => {
  beforeEach(() => { insert.mockReset(); });
  it("accepts formatted phone numbers and trimmed contacts", () => {
    expect(validateContactDetails({ fullName: " Jane ", phone: "+1 (508) 555-0123", email: " jane@example.com " })).toEqual({});
  });
  it("rejects whitespace names, invalid phone numbers and malformed email", () => {
    expect(Object.keys(validateContactDetails({ fullName: " ", phone: "abc123", email: "bad" }))).toEqual(["fullName", "phone", "email"]);
  });
  it("normalizes values before insertion", async () => {
    insert.mockResolvedValue({ error: null });
    expect(await submitLead({ name: " Jane ", email: " jane@example.com " })).toEqual({ error: null });
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ name: "Jane", email: "jane@example.com" }));
  });
  it("reports both server and network failures", async () => {
    insert.mockResolvedValue({ error: { message: "denied" } });
    expect((await submitLead({ name: "Jane" })).error).toBeTruthy();
    insert.mockRejectedValue(new Error("offline"));
    expect((await submitLead({ name: "Jane" })).error).toBeTruthy();
  });
});
