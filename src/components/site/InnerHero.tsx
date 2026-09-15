import { Link } from "react-router-dom";

interface Crumb {
  label: string;
  to?: string;
}

interface InnerHeroProps {
  title: string;
  subtitle?: string;
  crumbs: Crumb[];
  variant?: "stone" | "image";
  /** Optional override (kept for back-compat). Ignored for the new compact layout. */
  height?: string;
  /** Use compact layout (160px tall, smaller type). Defaults to true. */
  compact?: boolean;
}

const InnerHero = ({
  title,
  subtitle,
  crumbs,
  variant = "stone",
  compact = true,
}: InnerHeroProps) => {
  const isImage = variant === "image";

  return (
    <section
      style={{
        position: "relative",
        background: isImage ? "#2C2C2A" : "#E8E2D8",
        paddingTop: 80,
        paddingBottom: 40,
      }}
      className="px-6 md:px-20"
    >
      {isImage && <div className="absolute inset-0 bg-dark/55" aria-hidden />}

      <div className="container relative" style={{ padding: 0 }}>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              listStyle: "none",
              padding: 0,
              margin: "0 0 12px",
              flexWrap: "wrap",
              fontFamily: "Montserrat, sans-serif",
              fontSize: 12,
            }}
          >
            {crumbs.map((c, i) => {
              const isLast = i === crumbs.length - 1;
              return (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {c.to && !isLast ? (
                    <Link
                      to={c.to}
                      style={{
                        color: isImage ? "rgba(255,255,255,0.7)" : "#9CA3AF",
                        fontSize: 12,
                        textDecoration: "none",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {c.label}
                    </Link>
                  ) : (
                    <span
                      style={{
                        color: isImage ? "#FFFFFF" : "#1A1A1A",
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      {c.label}
                    </span>
                  )}
                  {!isLast && (
                    <span
                      aria-hidden
                      style={{
                        color: isImage ? "rgba(255,255,255,0.5)" : "#C4B8B0",
                        fontSize: 12,
                      }}
                    >
                      ›
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Title */}
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: compact ? "clamp(28px, 3.5vw, 40px)" : "clamp(32px, 5vw, 60px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: isImage ? "#FFFFFF" : "#1A1A1A",
            margin: 0,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              marginTop: 8,
              maxWidth: 640,
              fontFamily: "Montserrat, sans-serif",
              fontSize: 14,
              lineHeight: 1.55,
              color: isImage ? "rgba(255,255,255,0.8)" : "#6B6560",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default InnerHero;
