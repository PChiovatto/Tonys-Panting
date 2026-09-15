import { useState, useRef, useEffect } from "react";
import FadeUpSection from "@/components/site/FadeUpSection";

const projects = [
  { name: "Luxury Kitchen Interior", type: "Interior", src: "/images/interior-04.jpg", alt: "Luxury white kitchen interior painting and remodeling, New England" },
  { name: "Open Plan Living Space", type: "Interior", src: "/images/interior-03.jpg", alt: "Open plan kitchen and living room interior, Martha's Vineyard" },
  { name: "Hardwood Floor Refinishing", type: "Remodeling", src: "/images/flooring-01.jpg", alt: "Hardwood floor refinishing and restoration, New England" },
  { name: "Kitchen Remodel", type: "Remodeling", src: "/images/remodeling-02.jpg", alt: "Full kitchen remodel with subway tile and custom cabinets" },
  { name: "Kitchen Detail", type: "Interior", src: "/images/interior-01.jpg", alt: "White kitchen cabinets and island interior painting" },
  { name: "Floor Restoration", type: "Remodeling", src: "/images/flooring-03.jpg", alt: "Dark hardwood floor restoration, Boston area" },
];

const PortfolioPreview = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeDesktopSlide, setActiveDesktopSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const desktopScrollRef = useRef<HTMLDivElement>(null);

  const fixedProjects = projects.slice(0, 3);
  const sliderProjects = projects.slice(3);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const index = Math.round(el.scrollLeft / el.offsetWidth);
      setActiveSlide(index);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const el = desktopScrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const slideWidth = el.offsetWidth / 3;
      const index = Math.round(el.scrollLeft / slideWidth);
      setActiveDesktopSlide(index);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="portfolio" className="bg-stone overflow-hidden" style={{ contain: "layout" }}>
      <div className="container py-20 md:py-28">
        <FadeUpSection className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">Selected Work</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground leading-tight">
              A portfolio shaped by care.
            </h2>
          </div>
          <a
            href="/portfolio"
            className="text-sm font-medium text-foreground border-b border-foreground/30 hover:text-primary hover:border-primary transition-colors pb-0.5 self-start md:self-auto"
          >
            View full portfolio
          </a>
        </FadeUpSection>

        {/* Desktop Layout: 2 rows de 3 fixas */}
        <div className="portfolio-desktop-layout">
          <div className="grid grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <FadeUpSection
                key={p.name}
                delay={(i % 3) * 0.1}
                as="article"
                className="portfolio-item group relative aspect-[4/5] bg-background overflow-hidden"
              >
                <img
                  src={p.src}
                  alt={p.alt}
                  loading={i < 2 ? "eager" : "lazy"}
                  // @ts-expect-error fetchpriority is valid HTML
                  fetchpriority={i < 2 ? "high" : undefined}
                  decoding="async"
                  style={{ objectPosition: "center" }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="portfolio-overlay absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <div className="portfolio-caption">
                    <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">{p.type}</p>
                    <h3 className="font-display text-2xl md:text-3xl text-background">{p.name}</h3>
                  </div>
                </div>
              </FadeUpSection>
            ))}
          </div>
        </div>

        {/* Mobile Layout — sem alteracao */}
        <div className="portfolio-mobile-layout md:hidden -mx-6">
          <div
            ref={scrollRef}
            className="portfolio-slider"
          >
            {projects.map((p, i) => (
              <div
                key={p.name}
                className="portfolio-slide"
              >
                <img
                  src={p.src}
                  alt={p.alt}
                  loading={i < 2 ? "eager" : "lazy"}
                  // @ts-expect-error fetchpriority is valid HTML
                  fetchpriority={i < 2 ? "high" : undefined}
                  decoding="async"
                  style={{ objectPosition: "center" }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4">
                  <h3 className="font-sans font-semibold text-white text-[14px]">
                    {p.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center items-center gap-2 mt-4">
            {projects.map((_, i) => (
              <div
                key={i}
                className={`transition-all duration-300 ${
                  activeSlide === i
                    ? "bg-[#C4291C] w-[20px] h-[6px] rounded-[3px]"
                    : "bg-black/20 w-[6px] h-[6px] rounded-full"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .portfolio-desktop-layout {
          display: block;
        }
        .portfolio-mobile-layout {
          display: none;
        }

        .portfolio-desktop-slider {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          gap: 24px;
        }
        .portfolio-desktop-slider::-webkit-scrollbar {
          display: none;
        }
        .portfolio-desktop-slide {
          flex-shrink: 0;
          width: calc((100% - 48px) / 3);
          scroll-snap-align: start;
        }

        @media (max-width: 767px) {
          .portfolio-desktop-layout {
            display: none !important;
          }
          .portfolio-mobile-layout {
            display: block !important;
          }

          .portfolio-slider {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
            -ms-overflow-style: none;
            padding: 0 24px;
            gap: 16px;
          }
          
          .portfolio-slider::-webkit-scrollbar {
            display: none;
          }

          .portfolio-slide {
            width: calc(100vw - 64px);
            flex-shrink: 0;
            scroll-snap-align: center;
            border-radius: 12px;
            overflow: hidden;
            height: 260px;
            position: relative;
          }
        }
      `}</style>
    </section>
  );
};

export default PortfolioPreview;