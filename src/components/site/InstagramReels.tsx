import { useState, useRef, useEffect } from "react";

const reels = [
  { video: "/videos/reel-01.mp4", url: "https://www.instagram.com/reel/DXnh0eujkbr/" },
  { video: "/videos/reel-02.mp4", url: "https://www.instagram.com/reel/DXfU0FhCax4/" },
  { video: "/videos/reel-03.mp4", url: "https://www.instagram.com/reel/DXk-G4QDmP5/" },
  { video: "/videos/reel-04.mp4", url: "https://www.instagram.com/reel/DXWuvwnjjIX/" },
];

const INSTAGRAM_PROFILE = "https://www.instagram.com/tonyspainting_remodeling/";

const IgIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="white" strokeWidth="2" />
    <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2" />
    <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
  </svg>
);

const ReelCard = ({ reel }: { reel: typeof reels[0] }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onClick={() => window.open(reel.url, "_blank", "noopener,noreferrer")}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#000",
        position: "relative",
        cursor: "pointer",
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
      }}
    >
      <video
        ref={videoRef}
        src={reel.video}
        muted
        loop
        playsInline
        preload="metadata"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "5px 10px",
          borderRadius: "999px",
          background: "rgba(0,0,0,0.55)",
          color: "#FFFFFF",
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 600,
          fontSize: "11px",
          letterSpacing: "0.02em",
          backdropFilter: "blur(6px)",
          pointerEvents: "none",
        }}
      >
        <IgIcon />
        Reel
      </div>
    </div>
  );
};

const InstagramReels = () => {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    const onScroll = () => setActive(Math.round(el.scrollLeft / el.offsetWidth));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const Avatar = (
    <a
      href={INSTAGRAM_PROFILE}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-block",
        padding: "3px",
        borderRadius: "50%",
        background:
          "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
        flexShrink: 0,
      }}
      aria-label="Open Instagram profile"
    >
      <div
        className="ig-avatar-inner"
        style={{
          borderRadius: "50%",
          padding: "2px",
          background: "#F5F1EB",
        }}
      >
        <img
          src="/favicon.ico"
          alt="Tony's Painting Instagram"
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    </a>
  );

  const FollowBtn = (
    <a
      href={INSTAGRAM_PROFILE}
      target="_blank"
      rel="noopener noreferrer"
      className="ig-follow-btn"
      style={{
        background: "#0095F6",
        color: "#FFFFFF",
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 600,
        fontSize: "12px",
        padding: "5px 12px",
        borderRadius: "6px",
        textDecoration: "none",
        whiteSpace: "nowrap",
        flexShrink: 0,
        lineHeight: 1.2,
      }}
    >
      Follow
    </a>
  );

  return (
    <section
      className="bg-background"
      style={{ padding: "80px 0" }}
      aria-label="Instagram Reels"
    >
      {/* HEADER */}
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "32px",
          gap: "12px",
        }}
      >
        {Avatar}
        <div style={{ minWidth: 0, flex: 1 }}>
          <a
            href={INSTAGRAM_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="ig-handle"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              color: "#1A1A1A",
              textDecoration: "none",
              display: "block",
              lineHeight: 1.2,
              whiteSpace: "nowrap",
            }}
          >
            @tonyspainting_remodeling
          </a>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "4px",
              flexWrap: "nowrap",
            }}
          >
            <span
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "12px",
                color: "#6B6560",
                whiteSpace: "nowrap",
              }}
            >
              Follow us on Instagram
            </span>
            {FollowBtn}
          </div>
        </div>
      </div>

      {/* DESKTOP: 4 colunas */}
      <div className="ig-desktop">
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            maxWidth: "80%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {reels.map((r, i) => (
            <div key={i} style={{ aspectRatio: "9/16" }}>
              <ReelCard reel={r} />
            </div>
          ))}
        </div>
      </div>

      {/* MOBILE: slider 1 por vez */}
      <div className="ig-mobile">
        <div
          ref={sliderRef}
          style={{
            display: "flex",
            overflowX: "scroll",
            overflowY: "hidden",
            overscrollBehavior: "contain",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            gap: "16px",
            padding: "0 24px",
          }}
        >
          {reels.map((r, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0,
                width: "calc((100vw - 48px) * 0.8)",
                marginLeft: i === 0 ? "calc((100vw - 48px) * 0.1)" : 0,
                marginRight: i === reels.length - 1 ? "calc((100vw - 48px) * 0.1)" : 0,
                scrollSnapAlign: "center",
                aspectRatio: "9/16",
                maxHeight: "60vh",
              }}
            >
              <ReelCard reel={r} />
            </div>
          ))}
        </div>

        {/* Dots */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "6px",
            marginTop: "16px",
          }}
        >
          {reels.map((_, i) => (
            <div
              key={i}
              style={{
                width: active === i ? "20px" : "6px",
                height: "6px",
                borderRadius: active === i ? "3px" : "50%",
                background: active === i ? "#C4291C" : "rgba(0,0,0,0.18)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramReels;
