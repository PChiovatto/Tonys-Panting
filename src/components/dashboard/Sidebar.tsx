import { LayoutGrid, Users, Calendar, BarChart3, LogOut } from "lucide-react";
import tonysLogo from "@/assets/tonys-logo.png";

export type DashTab = "overview" | "leads" | "calendar" | "analytics";

interface SidebarProps {
  activeTab: DashTab;
  onTabChange: (tab: DashTab) => void;
  newLeadsCount: number;
  onSignOut: () => void;
}

const items: { id: DashTab; label: string; Icon: typeof LayoutGrid }[] = [
  { id: "overview", label: "Overview", Icon: LayoutGrid },
  { id: "leads", label: "Leads", Icon: Users },
  { id: "calendar", label: "Calendar", Icon: Calendar },
  { id: "analytics", label: "Analytics", Icon: BarChart3 },
];

const Sidebar = ({ activeTab, onTabChange, newLeadsCount, onSignOut }: SidebarProps) => {
  return (
    <aside
      className="dash-sidebar"
      style={{
        width: 240,
        flexShrink: 0,
        background: "#1A1A1A",
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        position: "sticky",
        top: 0,
      }}
    >
      <div style={{ padding: "8px 16px 16px" }}>
        <img
          src={tonysLogo}
          alt="Tony's Remodeling - Painting and Carpentry"
          style={{ height: 42, width: "auto", objectFit: "contain", display: "block" }}
        />
        <div
          style={{
            display: "inline-block",
            marginTop: 6,
            padding: "2px 8px",
            background: "rgba(196,41,28,0.2)",
            color: "#C4291C",
            fontSize: 10,
            borderRadius: 4,
            fontWeight: 600,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          Staff Portal
        </div>
      </div>

      <nav style={{ flex: 1, paddingTop: 8 }}>
        {items.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 16px",
                borderRadius: 8,
                cursor: "pointer",
                margin: "2px 8px",
                width: "calc(100% - 16px)",
                background: active ? "rgba(255,255,255,0.08)" : "transparent",
                color: active ? "#FFFFFF" : "rgba(255,255,255,0.55)",
                border: "none",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                textAlign: "left",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
            >
              <Icon size={18} color={active ? "#FFFFFF" : "rgba(255,255,255,0.40)"} />
              <span style={{ flex: 1 }}>{label}</span>
              {id === "leads" && newLeadsCount > 0 && (
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "#C4291C",
                    color: "#FFFFFF",
                    fontSize: 10,
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

      <button
        onClick={onSignOut}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 16px",
          margin: "8px",
          border: "none",
          background: "transparent",
          color: "rgba(255,255,255,0.40)",
          cursor: "pointer",
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 13,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 0,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.70)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.40)")}
      >
        <LogOut size={16} />
        Sign Out
      </button>
    </aside>
  );
};

export default Sidebar;
