import { LayoutGrid, Users, Calendar, BarChart3 } from "lucide-react";
import type { DashTab } from "./Sidebar";

interface BottomNavProps {
  activeTab: DashTab;
  onTabChange: (tab: DashTab) => void;
  newLeadsCount: number;
}

const items: { id: DashTab; label: string; Icon: typeof LayoutGrid }[] = [
  { id: "overview", label: "Overview", Icon: LayoutGrid },
  { id: "leads", label: "Leads", Icon: Users },
  { id: "calendar", label: "Calendar", Icon: Calendar },
  { id: "analytics", label: "Analytics", Icon: BarChart3 },
];

const BottomNav = ({ activeTab, onTabChange, newLeadsCount }: BottomNavProps) => {
  return (
    <nav
      className="dash-bottom-nav"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "calc(60px + env(safe-area-inset-bottom))",
        paddingBottom: "env(safe-area-inset-bottom)",
        background: "#1A1A1A",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 20,
      }}
    >
      {items.map(({ id, label, Icon }) => {
        const active = activeTab === id;
        const color = active ? "#C4291C" : "rgba(255,255,255,0.45)";
        return (
          <button
            key={id}
            className="dash-bottom-btn"
            onClick={() => onTabChange(id)}
            style={{
              minWidth: 64,
              minHeight: 44,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color,
              position: "relative",
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            <Icon size={20} color={color} />
            <span style={{ fontSize: 10, fontWeight: 500 }}>{label}</span>
            {id === "leads" && newLeadsCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 4,
                  right: "calc(50% - 18px)",
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "#C4291C",
                  color: "#FFFFFF",
                  fontSize: 9,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {newLeadsCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
