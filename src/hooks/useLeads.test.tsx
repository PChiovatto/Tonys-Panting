import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ load: vi.fn(), save: vi.fn(), remove: vi.fn(), toast: vi.fn() }));
vi.mock("sonner", () => ({ toast: { error: mocks.toast } }));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({
      select: () => ({ order: mocks.load }),
      update: () => ({ eq: () => ({ select: () => ({ single: mocks.save }) }) }),
      delete: () => ({ eq: () => ({ select: () => ({ single: mocks.remove }) }) }),
    }),
    channel: () => ({ on: () => ({ subscribe: () => ({}) }) }),
    removeChannel: vi.fn(),
  },
}));
import { useLeads } from "./useLeads";

describe("lead persistence", () => {
  const lead = { id: "lead-1", name: "Jane", status: "new", notes: "original" };
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.load.mockResolvedValue({ data: [lead], error: null });
  });
  it("keeps original data when a save is rejected", async () => {
    mocks.save.mockResolvedValue({ data: null, error: { message: "denied" } });
    const { result } = renderHook(() => useLeads());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => { expect(await result.current.updateLead(lead.id, { notes: "changed" })).toBe(false); });
    expect(result.current.leads[0].notes).toBe("original");
    expect(mocks.toast).toHaveBeenCalled();
  });
  it("does not hide a lead when deletion affects no row", async () => {
    mocks.remove.mockResolvedValue({ data: null, error: null });
    const { result } = renderHook(() => useLeads());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => { expect(await result.current.deleteLead(lead.id)).toBe(false); });
    expect(result.current.leads).toHaveLength(1);
  });
  it("updates the UI with the persisted row", async () => {
    mocks.save.mockResolvedValue({ data: { ...lead, notes: "saved" }, error: null });
    const { result } = renderHook(() => useLeads());
    await waitFor(() => expect(result.current.loading).toBe(false));
    mocks.load.mockResolvedValue({ data: [{ ...lead, notes: "saved" }], error: null });
    await act(async () => { expect(await result.current.updateLead(lead.id, { notes: "saved" })).toBe(true); });
    expect(result.current.leads[0].notes).toBe("saved");
  });
  it("does not let a read started before a save overwrite the saved row", async () => {
    const { result } = renderHook(() => useLeads());
    await waitFor(() => expect(result.current.loading).toBe(false));
    let finishOldRead: (value: unknown) => void;
    mocks.load.mockReturnValueOnce(new Promise((resolve) => { finishOldRead = resolve; }));
    let oldRead: Promise<void>;
    act(() => { oldRead = result.current.reload(); });
    mocks.save.mockResolvedValue({ data: { ...lead, notes: "latest" }, error: null });
    mocks.load.mockResolvedValue({ data: [{ ...lead, notes: "latest" }], error: null });
    await act(async () => { await result.current.updateLead(lead.id, { notes: "latest" }); });
    await act(async () => { finishOldRead({ data: [lead], error: null }); await oldRead; });
    expect(result.current.leads[0].notes).toBe("latest");
  });
  it("exposes a load failure instead of silently showing an empty CRM", async () => {
    mocks.load.mockResolvedValue({ data: null, error: { message: "offline" } });
    const { result } = renderHook(() => useLeads());
    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(result.current.loading).toBe(false);
  });
});
