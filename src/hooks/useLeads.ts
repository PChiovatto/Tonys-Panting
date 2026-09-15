import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Lead } from "@/types/lead";

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);
  const mounted = useRef(false);
  const reload = useCallback(async () => {
    const id = ++requestId.current;
    try {
      const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      if (!mounted.current || id !== requestId.current) return;
      setLeads(data as Lead[]);
      setError(null);
    } catch {
      if (mounted.current && id === requestId.current) setError("Unable to load leads. Please try again.");
    } finally {
      if (mounted.current && id === requestId.current) setLoading(false);
    }
  }, []);
  useEffect(() => {
    mounted.current = true;
    if ("clearAppBadge" in navigator) void navigator.clearAppBadge().catch(() => undefined);
    void reload();
    const channel = supabase.channel("leads-changes").on(
      "postgres_changes", { event: "*", schema: "public", table: "leads" },
      (payload) => {
        void reload();
        if (payload.eventType === "INSERT") window.dispatchEvent(new CustomEvent("new-lead", { detail: payload.new }));
      },
    ).subscribe((status) => {
      if (status === "SUBSCRIBED") void reload();
    });
    return () => {
      mounted.current = false;
      void supabase.removeChannel(channel);
    };
  }, [reload]);

  const updateLead = async (id: string, updates: Partial<Lead>): Promise<boolean> => {
    try {
      const { data, error } = await supabase.from("leads").update(updates).eq("id", id).select().single();
      if (error) throw error;
      ++requestId.current;
      setLoading(false);
      setLeads((prev) => prev.map((lead) => lead.id === id ? data as Lead : lead));
      void reload();
      return true;
    } catch {
      toast.error("Lead was not saved. Please try again.");
      return false;
    }
  };
  const deleteLead = async (id: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.from("leads").delete().eq("id", id).select("id").single();
      if (error || !data) throw error ?? new Error("Lead was not deleted");
      ++requestId.current;
      setLoading(false);
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
      void reload();
      return true;
    } catch {
      toast.error("Lead was not deleted. Check your access and try again.");
      return false;
    }
  };
  return { leads, loading, error, reload, updateLead, deleteLead };
};
