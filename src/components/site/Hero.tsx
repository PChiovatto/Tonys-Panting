import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Shield, Star, CheckCircle2 } from "lucide-react";
import TwoStepInquiryForm from "./TwoStepInquiryForm";

import heroBgDesktop from "@/assets/hero-bg-desktop.jpg";
import heroBgMobile from "@/assets/hero-bg-mobile.jpg";

const HERO_IMAGE = heroBgMobile;
const HERO_IMAGE_DESKTOP = heroBgDesktop;

const Hero = () => {
  const reduce = useReducedMotion();

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();
    // IMPORTANT: do NOT listen to `resize` on mobile — the browser fires resize
    // every time the URL bar shows/hides during scroll, which would recalculate
    // the hero height and cause the page to "jump" back to the top.
    // Only recalc on orientation change (real viewport change).
    const onOrientation = () => setVh();
    window.addEventListener('orientationchange', onOrientation);
    return () => window.removeEventListener('orientationchange', onOrientation);
  }, []);

  const fadeUp = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: "easeOut" as const },
        };

  const imageMotion = reduce
    ? {}
    : {
        initial: { scale: 1.06 },
        animate: { scale: 1 },
        transition: { duration: 1.4, ease: "easeOut" as const },
      };

  const stats = [
    { icon: <Shield size={20} />, title: "20+ Years", desc: "Experience" },
    { icon: <Star size={20} />, title: "5-Star Rated", desc: "Local Company" },
    { icon: <CheckCircle2 size={20} />, title: "Quality Work", desc: "You Can Trust" },
  ];

  return (
    <section
      id="top"
      className="hero-section"
    >
      {/* Background Image */}
      <motion.picture {...imageMotion} className="hero-bg-image" style={{ willChange: "transform" }}>
        <source media="(min-width: 768px)" srcSet={HERO_IMAGE_DESKTOP} />
        <img
          src={HERO_IMAGE}
          alt="Tony's Painting professional painting exterior"
          loading="eager"
          decoding="async"
          // @ts-expect-error fetchpriority is valid HTML attr
          fetchpriority="high"
          className="hero-bg-image"
          style={{ willChange: "transform" }}
        />
      </motion.picture>
      {/* Overlays */}
      <div className="hero-overlay-main" />
      <div className="hero-overlay-top" />

      {/* Layout Container */}
      <div className="hero-layout-container">
        {/* Left/Main Content Panel */}
        <div className="hero-content">
          <h1 className="hero-headline">
            <span className="desktop-only">
              Transforming homes<br />
              with intention and detail.
            </span>
            <span className="mobile-only">
              Transforming<br />
              homes with<br />
              intention<br />
              and detail.
            </span>
          </h1>

          <motion.p
            {...fadeUp(0.3)}
            className="hero-subline"
          >
            Since 2004, Tony's team has brought precision and care to every project in the region.
          </motion.p>

          {/* Mobile CTA */}
          <motion.a
            {...fadeUp(0.6)}
            href="/contact"
            className="mobile-only hero-mobile-btn"
          >
            Request a Consultation
          </motion.a>

          {/* Stats Container */}
          <motion.div
            {...fadeUp(0.7)}
            className="hero-stats"
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="hero-stat">
                <div className="hero-stat-icon">{stat.icon}</div>
                <div>
                  <span className="hero-stat-title">{stat.title}</span>
                  <span className="hero-stat-sub">{stat.desc}</span>
                </div>
                {idx < stats.length - 1 && (
                  <div className="hero-stat-divider desktop-only" />
                )}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Desktop Right Panel (Form) */}
        <div className="hero-form-panel desktop-only">
          <motion.div {...fadeUp(0.5)}>
            <TwoStepInquiryForm dark />
          </motion.div>
        </div>
      </div>

      <style>{`
        .desktop-only { display: block; }
        .mobile-only { display: none; }
        
        .hero-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          background-color: #1A1A1A;
          display: flex;
          align-items: center;
        }

        .hero-bg-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 30%;
          z-index: 0;
        }

        .hero-overlay-main {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0.20) 70%, rgba(0,0,0,0.05) 100%);
        }

        .hero-overlay-top {
          position: absolute;
          inset: 0;
          z-index: 3;
          background: linear-gradient(to bottom, rgba(0,0,0,0.40) 0%, transparent 20%);
        }

        /* Second desktop overlay */
        .hero-section::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 40%);
          pointer-events: none;
        }

        .hero-layout-container {
          position: relative;
          z-index: 10;
          width: 100%;
          display: flex;
          padding: 0 80px;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
        }

        .hero-content {
          flex: 1;
          max-width: 600px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .hero-headline {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(36px, 4.2vw, 64px);
          line-height: 1.02;
          letter-spacing: -0.025em;
          color: #F5F1EB;
          margin: 0;
        }

        .hero-subline {
          font-family: 'Montserrat', sans-serif;
          font-size: 16px;
          font-weight: 400;
          color: rgba(255,255,255,0.72);
          line-height: 1.7;
          max-width: 500px;
          margin: 0;
        }

        .hero-stats {
          display: flex;
          align-items: center;
          gap: 28px;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.12);
        }

        .hero-stat {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .hero-stat > div:nth-child(2) {
          display: flex;
          flex-direction: column;
        }

        .hero-stat-icon {
          color: #C4291C;
          display: flex;
        }

        .hero-stat-title {
          color: white;
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
          font-size: 15px;
          line-height: 1;
        }

        .hero-stat-sub {
          color: rgba(255,255,255,0.45);
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          margin-top: 2px;
        }

        .hero-stat-divider {
          width: 1px;
          height: 28px;
          background: rgba(255,255,255,0.12);
        }

        .hero-form-panel {
          width: 380px;
          flex-shrink: 0;
        }

        .hero-form-panel input::placeholder,
        .hero-form-panel textarea::placeholder {
          color: #FFFFFF !important;
          opacity: 1;
        }
        .hero-form-panel select:invalid {
          color: #FFFFFF;
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .hero-form-panel { display: none !important; }
          .hero-layout-container { padding: 100px 24px 60px; }
          .hero-content { max-width: 640px; margin: auto; min-width: 0; padding: 0 !important; }
          .hero-mobile-btn { display: inline-flex !important; align-self: flex-start; align-items: center; min-height: 48px; padding: 12px 24px; background: #C4291C; color: white; border-radius: 8px; font-weight: 600; }
          .hero-stats { flex-wrap: wrap; }
        }
        @media (max-width: 767px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: block !important; }

          .hero-section {
            flex-direction: column;
            justify-content: flex-end;
            min-height: 100dvh;
            min-height: calc(var(--vh, 1vh) * 100);
            padding-top: 0;
            margin-top: 0;
            overflow: hidden;
          }

          .hero-bg-image {
            object-position: 77% 20% !important;
            height: 100dvh;
            height: calc(var(--vh, 1vh) * 100);
          }

          .hero-overlay-main {
            background: linear-gradient(
              to top,
              rgba(0,0,0,0.96) 0%,
              rgba(0,0,0,0.88) 25%,
              rgba(0,0,0,0.55) 50%,
              rgba(0,0,0,0.15) 75%,
              rgba(0,0,0,0.0) 100%
            ) !important;
          }

          .hero-overlay-top {
            background: linear-gradient(
              to bottom,
              rgba(0,0,0,0.55) 0%,
              transparent 18%
            ) !important;
            z-index: 2;
          }

          .hero-section::after {
            display: none;
          }

          .hero-layout-container {
            padding: 0;
            display: block;
          }

          .hero-content {
            gap: 16px;
            padding: 0 24px max(40px, env(safe-area-inset-bottom, 40px)) 24px;
            max-width: 100%;
            margin: 0;
          }

          .hero-headline {
            font-size: clamp(40px, 10.5vw, 56px);
            line-height: 1.0;
            letter-spacing: -0.02em;
            color: #FFFFFF;
          }

          .hero-headline::after {
            content: '';
            display: block;
            width: 48px;
            height: 3px;
            background: #C4291C;
            border-radius: 2px;
            margin-top: 14px;
          }

          .hero-subline {
            font-size: 15px;
            color: rgba(255,255,255,0.72);
            line-height: 1.7;
          }

          .hero-mobile-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            width: 100%;
            height: 58px;
            line-height: 58px;
            padding: 0;
            background: #C4291C;
            border-radius: 10px;
            color: #FFFFFF;
            font-family: 'Montserrat', sans-serif;
            font-weight: 700;
            font-size: 16px;
            text-decoration: none;
            border: none;
            cursor: pointer;
            transition: background 0.2s;
          }

          .hero-mobile-btn:active {
            background: #8B1A10;
          }

          .hero-stats {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding-top: 16px;
            border-top: 1px solid rgba(255,255,255,0.12);
            gap: 0;
          }

          .hero-stat {
            gap: 7px;
          }

          .hero-stat-icon {
            width: 18px;
            height: 18px;
            flex-shrink: 0;
          }

          .hero-stat-title {
            font-size: 12px;
            line-height: 1;
            display: block;
          }

          .hero-stat-sub {
            font-size: 9px;
            margin-top: 2px;
            display: block;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;

