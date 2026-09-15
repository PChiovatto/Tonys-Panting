import { Link } from "react-router-dom";
import FadeUpSection from "./FadeUpSection";

const VideoShowcase = () => {
  return (
    <section
      className="w-full video-section"
      style={{ background: "#1A1A1A" }}
    >
      <div
        className="mx-auto video-showcase-container"
      >
        <div className="video-text-panel">
          <FadeUpSection className="flex flex-col items-start" style={{ gap: 16 }}>
            <div
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 400,
                fontSize: 11,
                color: "#C4291C",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              See us in action
            </div>
            <h2
              className="video-showcase-title"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                color: "#F5F1EB",
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              The work speaks for itself.
            </h2>
            <p
              className="video-showcase-subline"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 400,
                color: "rgba(255,255,255,0.60)",
                lineHeight: 1.7,
              }}
            >
              Explore our painting and remodeling projects, completed with precision, care and attention to detail.
            </p>
          </FadeUpSection>

          <FadeUpSection delay={0.3} className="video-cta-container-desktop">
            <Link
              to="/contact"
              className="video-showcase-cta"
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "#C4291C",
                color: "#FFFFFF",
                padding: "13px 26px",
                borderRadius: 8,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                transition: "background 0.2s ease",
              }}
            >
              Request a Consultation →
            </Link>
          </FadeUpSection>
        </div>

        <div className="video-visual-panel">
          <FadeUpSection
            delay={0.2}
            className="video-element-container"
          >
            <video
              src="/videos/tonys-showreel.mp4"
              poster="/images/project-02.jpg"
              aria-label="Tony's Painting project showcase"
              controls
              preload="none"
              playsInline
              className="h-full w-full object-cover"
            >
              <a href="/videos/tonys-showreel.mp4">Watch our project showcase</a>
            </video>
          </FadeUpSection>

          <FadeUpSection delay={0.3} className="video-cta-container">
            <Link
              to="/contact"
              className="video-showcase-cta"
              style={{
                display: "flex",
                alignItems: "center",
                background: "#C4291C",
                color: "#FFFFFF",
                padding: "13px 26px",
                borderRadius: 8,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                transition: "background 0.2s ease",
              }}
            >
              Request a Consultation →
            </Link>
          </FadeUpSection>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
