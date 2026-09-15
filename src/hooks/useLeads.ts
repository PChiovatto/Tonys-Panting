import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Lead } from "@/types/lead";

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Limpar badge ao abrir o dashboard
  useEffect(() => {
    if ('clearAppBadge' in navigator) {
      navigator.clearAppBadge()
    }
  }, [])

  useEffect(() => {
    let mounted = true;

    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!mounted) return;
        setLeads((data as unknown as Lead[]) || []);
        setLoading(false);
      });

    const channel = supabase
      .channel("leads-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "leads" },
        (payload) => {
          const newLead = payload.new as unknown as Lead;
          setLeads((prev) => [newLead, ...prev]);
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("new-lead", { detail: newLead }));
          }
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "leads" },
        (payload) => {
          setLeads((prev) =>
            prev.map((l) =>
              l.id === (payload.new as { id: string }).id
                ? (payload.new as unknown as Lead)
                : l,
            ),
          );
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "leads" },
        (payload) => {
          const oldId = (payload.old as { id: string }).id;
          setLeads((prev) => prev.filter((l) => l.id !== oldId));
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    );
    await supabase.from("leads").update(updates).eq("id", id);
  };

  const deleteLead = async (id: string) => {
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (!error) {
      setLeads((prev) => prev.filter((l) => l.id !== id));
    }
  };

  return { leads, loading, updateLead, deleteLead };
};
