import { useEffect, useRef, useState } from "react";
import { useCountUp } from "@/hooks/useCountUp";

const trustItems = [
  { number: "20+", label: "Years Experience" },
  { number: "500+", label: "Projects Completed" },
  { number: "5★", label: "5-Star Rated" },
];

const TrustBar = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const years = useCountUp(20, 2000, visible);
  const projects = useCountUp(500, 2000, visible);

  // Mobile slider state
  const [activeItem, setActiveItem] = useState(0);
  const [slideVisible, setSlideVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideVisible(false);
      setTimeout(() => {
        setActiveItem((prev) => (prev + 1) % trustItems.length);
        setSlideVisible(true);
      }, 400);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-stone border-y border-border" ref={ref}>
      {/* Desktop */}
      <div className="trust-bar-desktop container grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
        <div className="py-10 md:py-12 text-center">
          <div className="font-display text-4xl md:text-5xl text-foreground tabular-nums">
            {years}+
          </div>
          <div className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Years Experience
          </div>
        </div>
        <div className="py-10 md:py-12 text-center">
          <div className="font-display text-4xl md:text-5xl text-foreground tabular-nums">
            {projects}+
          </div>
          <div className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Projects Completed
          </div>
        </div>
        <div
          className={`py-10 md:py-12 text-center transition-opacity duration-700 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="font-display text-4xl md:text-5xl text-foreground">5★</div>
          <div className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            5-Star Rated
          </div>
        </div>
      </div>

      {/* Mobile slider */}
      <div className="trust-bar-mobile container py-10 flex-col items-center justify-center gap-6">
        <div
          className="text-center transition-all duration-400 ease-out"
          style={{
            opacity: slideVisible ? 1 : 0,
            transform: slideVisible ? "translateY(0)" : "translateY(8px)",
          }}
        >
          <div className="font-display text-5xl text-foreground tabular-nums" style={{ fontWeight: 900 }}>
            {trustItems[activeItem].number}
          </div>
          <div className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {trustItems[activeItem].label}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-2">
          {trustItems.map((_, i) => (
            <span
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === activeItem ? 20 : 6,
                height: 6,
                backgroundColor:
                  i === activeItem ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.4)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
