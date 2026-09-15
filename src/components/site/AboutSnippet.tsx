import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import FadeUpSection from "@/components/site/FadeUpSection";
import otonielSantos from "@/assets/otoniel-santos-founder.png";
import marcelaCoCeo from "@/assets/marcela-co-ceo.jpeg.asset.json";

const people = [
  {
    image: otonielSantos,
    name: "Otoniel Santos",
    role: "Founder and CEO",
  },
  {
    image: marcelaCoCeo.url,
    name: "Marcela S.",
    role: "Co-CEO",
  },
];

const DURATION = 5000;
const FADE_MS = 700;

const AboutPhotoSlideshow = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (index: number) => {
    setCurrent(index % people.length);
  };

  useEffect(() => {
    if (paused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % people.length);
    }, DURATION);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="flex flex-col items-center gap-[14px]"
    >
      {/* Stack de imagens: TODAS sempre no DOM, so opacity muda */}
      <div
        className="about-slideshow-photo relative w-[200px] h-[250px] md:w-[300px] md:h-[370px]"
        style={{
          borderRadius: "8px",
          overflow: "hidden",
          border: "2px solid #C4291C",
          animation: "glowPulse 2s ease-in-out infinite",
        }}
      >
        {people.map((person, index) => (
          <img
            key={index}
            src={person.image}
            alt={person.name}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
              opacity: current === index ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease`,
              willChange: "opacity",
              zIndex: current === index ? 2 : 1,
            }}
          />
        ))}
      </div>

      {/* Nome e cargo: fade via CSS transition */}
      <div className="relative text-center w-full" style={{ minHeight: "48px" }}>
        {people.map((person, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              inset: 0,
              opacity: current === index ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease`,
              willChange: "opacity",
            }}
          >
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                fontSize: "18px",
                color: "#1A1A1A",
                margin: "0 0 5px",
              }}
            >
              {person.name}
            </p>
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
                fontSize: "12px",
                color: "#C4291C",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: 0,
              }}
            >
              {person.role}
            </p>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex gap-[8px] justify-center">
        {people.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: current === i ? "20px" : "6px",
              height: "6px",
              borderRadius: current === i ? "3px" : "50%",
              background: current === i ? "#C4291C" : "rgba(0,0,0,0.20)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const AboutSnippet = () => {
  return (
    <section id="about" className="bg-stone overflow-hidden">
      <div className="container py-20 md:py-28 flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* TOP PANEL ON MOBILE / LEFT PANEL ON DESKTOP */}
        <div className="w-full order-1 lg:order-none flex justify-center lg:justify-start">
          <FadeUpSection className="w-full">
            <AboutPhotoSlideshow />
          </FadeUpSection>
        </div>

        {/* BOTTOM PANEL ON MOBILE / RIGHT PANEL ON DESKTOP */}
        <FadeUpSection
          delay={0.1}
          className="w-full flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-none"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4 w-full">About Us</p>
          <h2 className="font-display text-[28px] md:text-5xl text-foreground leading-tight">
            Built on trust, proven by results.
          </h2>
          <p className="mt-6 text-sm md:text-lg text-muted-foreground leading-relaxed max-w-full md:max-w-xl">
            Tony started this company in 2004 with one goal: to do the work right. Two decades later,
            that standard still defines every brushstroke and every project we deliver.
          </p>

          <Button
            asChild
            variant="outline"
            className="mt-8 rounded-sm h-12 px-8 border-foreground text-foreground hover:bg-foreground hover:text-background w-full md:w-auto flex justify-center items-center"
          >
            <a href="/about">Read our story</a>
          </Button>
        </FadeUpSection>
      </div>
    </section>
  );
};

export default AboutSnippet;
