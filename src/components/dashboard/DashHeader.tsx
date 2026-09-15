import { LogOut } from "lucide-react";

interface DashHeaderProps {
  title: string;
  onSignOut?: () => void;
}

const DashHeader = ({ title, onSignOut }: DashHeaderProps) => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header
      style={{
        height: 64,
        background: "#FFFFFF",
        borderBottom: "1px solid #E8E2D8",
        position: "sticky",
        top: 0,
        zIndex: 10,
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <h1
        style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          fontSize: 20,
          color: "#1A1A1A",
          margin: 0,
        }}
      >
        {title}
      </h1>
      <div
        className="dash-header-date"
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 400,
          fontSize: 13,
          color: "#9CA3AF",
        }}
      >
        {today}
      </div>
      {onSignOut && (
        <button
          className="dash-header-signout"
          onClick={onSignOut}
          aria-label="Sign out"
          style={{
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            background: "transparent",
            border: "none",
            color: "#6B6560",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <LogOut size={20} />
        </button>
      )}
    </header>
  );
};

export default DashHeader;
