import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Lead } from "@/types/lead";

interface ToastItem {
  id: string;
  name: string;
  service: string;
}

const LeadToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const lead = (e as CustomEvent<Lead>).detail;
      const item: ToastItem = {
        id: lead.id,
        name: lead.name,
        service: lead.service_type || "General inquiry",
      };
      setToasts((prev) => [...prev, item]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== item.id));
      }, 5000);
    };
    window.addEventListener("new-lead", handler as EventListener);
    return () => window.removeEventListener("new-lead", handler as EventListener);
  }, []);

  return (
    <>
      <style>{`
        .lead-toast-wrap {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          pointer-events: none;
        }
        .lead-toast-card { width: 300px; pointer-events: auto; }
        @media (max-width: 767px) {
          .lead-toast-wrap {
            bottom: auto;
            top: 80px;
            left: 16px;
            right: 16px;
          }
          .lead-toast-card { width: 100%; }
        }
      `}</style>
      <div className="lead-toast-wrap">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              className="lead-toast-card"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              style={{
                background: "#1A1A1A",
                borderRadius: 12,
                padding: 16,
                borderLeft: "4px solid #C4291C",
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              <div
                style={{
                  fontWeight: 500,
                  fontSize: 11,
                  color: "#C4291C",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                New Lead
              </div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  color: "#FFFFFF",
                  marginTop: 4,
                }}
              >
                {t.name}
              </div>
              <div
                style={{
                  fontWeight: 400,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.65)",
                  marginTop: 2,
                }}
              >
                {t.service}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};

export default LeadToast;
