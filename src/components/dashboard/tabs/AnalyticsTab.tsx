import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { type Lead, type LeadStatus, getStatusBadge } from "@/types/lead";

interface Props {
  leads: Lead[];
}

const COLORS = [
  "#C4291C",
  "#8B1A10",
  "#D4837A",
  "#E8A89E",
  "#F0C4C0",
  "#1A1A1A",
  "#6B6560",
];

const cardStyle: React.CSSProperties = {
  background: "#FFFFFF",
  borderRadius: 12,
  border: "0.5px solid #E8E2D8",
  padding: 20,
};

const cardTitle: React.CSSProperties = {
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 600,
  fontSize: 15,
  color: "#1A1A1A",
  marginBottom: 20,
};

const tooltipStyle: React.CSSProperties = {
  background: "#1A1A1A",
  border: "none",
  borderRadius: 8,
  color: "white",
  fontSize: 12,
};

const EmptyState = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px 20px",
      textAlign: "center",
    }}
  >
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#E8E2D8"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M7 16V9" />
      <path d="M12 16v-5" />
      <path d="M17 16V6" />
    </svg>
    <p
      style={{
        marginTop: 16,
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 500,
        fontSize: 16,
        color: "#9CA3AF",
      }}
    >
      No data yet.
    </p>
    <p
      style={{
        marginTop: 4,
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 400,
        fontSize: 13,
        color: "#C4B8B0",
      }}
    >
      Leads will appear here once submitted.
    </p>
  </div>
);

const AnalyticsTab = ({ leads }: Props) => {
  if (leads.length === 0) {
    return (
      <div style={{ padding: 24 }}>
        <div style={cardStyle}>
          <EmptyState />
        </div>
      </div>
    );
  }

  const statusData = Object.entries(
    leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([status, count]) => ({
    name: getStatusBadge(status as LeadStatus).label,
    count,
    fill: getStatusBadge(status as LeadStatus).color,
  }));

  const serviceData = Object.entries(
    leads.reduce((acc, lead) => {
      const key = lead.service_type || "Other";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return {
      month: d.toLocaleString("en-US", { month: "short", year: "2-digit" }),
      year: d.getFullYear(),
      monthIndex: d.getMonth(),
    };
  });

  const monthlyData = last6Months.map(({ month, year, monthIndex }) => ({
    month,
    count: leads.filter((l) => {
      const d = new Date(l.created_at);
      return d.getFullYear() === year && d.getMonth() === monthIndex;
    }).length,
  }));

  return (
    <div
      className="analytics-wrap"
      style={{
        padding: 24,
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <style>{`
        .analytics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .analytics-grid .full-row { grid-column: 1 / -1; }
        @media (max-width: 767px) {
          .analytics-wrap { padding: 16px !important; }
          .analytics-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>

      <div className="analytics-grid">
        <div style={cardStyle}>
          <h3 style={cardTitle}>Leads by Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9CA3AF" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitle}>Leads by Service</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={serviceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {serviceData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#6B6560" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={cardStyle} className="full-row">
          <h3 style={cardTitle}>Leads in the last 6 months</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
              <Bar dataKey="count" fill="#C4291C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
