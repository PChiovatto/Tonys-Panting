import { useState } from "react";

interface PremiumMapProps {
  variant?: "footer" | "contact";
}

const LOCATIONS = [
  {
    id: "vineyard",
    label: "Vineyard Haven",
    address: "11 Cook Rd, Vineyard Haven, MA 02568",
    query: "11 Cook Rd, Vineyard Haven, MA 02568",
  },
  {
    id: "pocasset",
    label: "Pocasset",
    address: "2 Williams Ave, Pocasset, MA",
    query: "2 Williams Ave, Pocasset, MA",
  },
  {
    id: "bridgewater",
    label: "West Bridgewater",
    address: "240 W Center St, West Bridgewater, MA 02379",
    query: "240 W Center St, West Bridgewater, MA 02379",
  },
];

const PremiumMap = ({ variant = "footer" }: PremiumMapProps) => {
  const isFooter = variant === "footer";
  const [activeId, setActiveId] = useState(LOCATIONS[0].id);
  const active = LOCATIONS.find((l) => l.id === activeId) ?? LOCATIONS[0];
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(active.query)}&output=embed`;
  const directionsHref = `https://maps.google.com/?q=${encodeURIComponent(active.query)}`;

  return (
    <div
      className="footer-map"
      style={{
        width: "100%",
        overflow: "hidden",
        background: isFooter ? "#1A1A1A" : "#FFFFFF",
        border: isFooter ? "none" : "1px solid #E8E2D8",
        borderRadius: isFooter ? 0 : 12,
        boxShadow: isFooter ? "none" : "0 8px 32px rgba(0,0,0,0.06)",
      }}
    >
      {/* Location selector tabs */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          padding: "10px 12px",
          background: isFooter ? "#1A1A1A" : "#F5F1EB",
          borderBottom: isFooter
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid #E8E2D8",
          overflowX: "auto",
        }}
      >
        {LOCATIONS.map((loc) => {
          const isActive = loc.id === activeId;
          return (
            <button
              key={loc.id}
              type="button"
              onClick={() => setActiveId(loc.id)}
              style={{
                flexShrink: 0,
                padding: "6px 12px",
                borderRadius: "999px",
                fontFamily: "Inter, sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
                border: isActive
                  ? "1px solid #C4291C"
                  : isFooter
                    ? "1px solid rgba(255,255,255,0.12)"
                    : "1px solid #E8E2D8",
                background: isActive
                  ? "#C4291C"
                  : isFooter
                    ? "transparent"
                    : "#FFFFFF",
                color: isActive
                  ? "#FFFFFF"
                  : isFooter
                    ? "#F5F1EB"
                    : "#1A1A1A",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
            >
              {loc.label}
            </button>
          );
        })}
      </div>

      {/* Google Maps Embed */}
      <div style={{ position: "relative", width: "100%" }}>
        <iframe
          key={active.id}
          title={`Tony's Painting location - ${active.label}`}
          src={mapSrc}
          width="100%"
          height={isFooter ? 220 : 360}
          style={{
            border: 0,
            display: "block",
            filter: isFooter
              ? "grayscale(100%) invert(92%) contrast(85%)"
              : "grayscale(40%) contrast(95%)",
          }}
          loading="lazy"
          allowFullScreen={false}
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Overlay com info da empresa */}
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            left: "12px",
            background: isFooter ? "rgba(26,26,26,0.88)" : "rgba(255,255,255,0.95)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderRadius: "10px",
            padding: "10px 14px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            border: isFooter
              ? "1px solid rgba(255,255,255,0.1)"
              : "1px solid rgba(0,0,0,0.06)",
            maxWidth: "240px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#C4291C",
                flexShrink: 0,
                boxShadow: "0 0 0 2px rgba(196,41,28,0.25)",
              }}
            />
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "13px",
                color: isFooter ? "#F5F1EB" : "#1A1A1A",
                lineHeight: 1.2,
              }}
            >
              Tony's Painting
            </span>
          </div>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "11px",
              color: isFooter ? "#9CA3AF" : "#6B6560",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {active.address}
          </p>
        </div>
      </div>

      {/* Barra inferior com CTA */}
      <div
        style={{
          background: isFooter ? "#1A1A1A" : "#F5F1EB",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          borderTop: isFooter
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid #E8E2D8",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              color: isFooter ? "#9CA3AF" : "#6B6560",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Serving Martha's Vineyard and New England
          </p>
        </div>
        <a
          href={directionsHref}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            background: "#C4291C",
            color: "white",
            padding: "7px 14px",
            borderRadius: "6px",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "11px",
            textDecoration: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Get Directions
        </a>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .footer-map iframe { height: 160px !important; }
        }
      `}</style>
    </div>
  );
};

export default PremiumMap;
