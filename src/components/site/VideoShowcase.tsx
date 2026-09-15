import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FadeUpSection from "./FadeUpSection";

const VideoShowcase = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const hasAutoPlayedRef = useRef(false);

  const handlePlay = () => {
    videoRef.current?.play();
    setPlaying(true);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAutoPlayedRef.current && videoRef.current) {
            hasAutoPlayedRef.current = true;
            videoRef.current.muted = true;
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => setPlaying(true))
                .catch(() => {
                  hasAutoPlayedRef.current = false;
                });
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
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
              Watch how we approach every project with precision, care and attention to detail.
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
              ref={videoRef}
              src="/videos/tonys-showreel.mp4"
              controls
              muted
              preload="none"
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
            {!playing && (
              <div
                onClick={handlePlay}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.30)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 10,
                }}
              >
                <button
                  type="button"
                  aria-label="Play video"
                  onClick={handlePlay}
                  className="video-play-button"
                  style={{
                    width: 64,
                    height: 64,
                    background: "rgba(196,41,28,0.90)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 20px rgba(196,41,28,0.40)",
                    border: "none",
                    transition: "background 0.2s ease, transform 0.2s ease",
                  }}
                >
                  <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12L0.75 23.6913L0.75 0.308657L21 12Z" fill="#FFFFFF" />
                  </svg>
                </button>
              </div>
            )}
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
