import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import SEO from "@/components/SEO";
import PageLayout from "@/components/site/PageLayout";
import InnerHero from "@/components/site/InnerHero";
import FadeUpSection from "@/components/site/FadeUpSection";
import RippleButton from "@/components/site/RippleButton";
import { cn } from "@/lib/utils";

type Category = "All Projects" | "Interior" | "Exterior" | "Remodeling" | "Commercial";

interface Project {
  id: number | string;
  title: string;
  category: Exclude<Category, "All Projects">;
  location: string;
  src: string;
}

const PROJECTS: Project[] = [
  { id: 'int-luxury-01', title: "Luxury Kitchen Renovation", category: "Interior", location: "Martha's Vineyard", src: "/images/interior-04.jpg" },
  { id: 1, title: "Coastal Residence", category: "Exterior", location: "New England", src: "/images/project-02.jpg" },
  { id: 'int-luxury-02', title: "Open Plan Living Space", category: "Interior", location: "Martha's Vineyard", src: "/images/interior-03.jpg" },
  { id: 2, title: "Colonial Restoration", category: "Exterior", location: "New England", src: "/images/project-12.jpg" },
  { id: 'floor-01', title: "Hardwood Floor Refinishing", category: "Remodeling", location: "New England", src: "/images/flooring-01.jpg" },
  { id: 3, title: "Waterfront Deck", category: "Exterior", location: "New England", src: "/images/project-08.jpg" },
  { id: 'int-luxury-03', title: "White Kitchen Interior", category: "Interior", location: "New England", src: "/images/interior-05.jpg" },
  { id: 4, title: "Master Bath Remodel", category: "Remodeling", location: "New England", src: "/images/project-04.jpg" },
  { id: 'remodel-kitchen', title: "Full Kitchen Remodel", category: "Remodeling", location: "Boston Area", src: "/images/remodeling-02.jpg" },
  { id: 5, title: "Wood Siding Project", category: "Exterior", location: "New England", src: "/images/project-14.jpg" },
  { id: 'int-luxury-04', title: "Classic Kitchen Cabinetry", category: "Interior", location: "Boston Area", src: "/images/interior-01.jpg" },
  { id: 6, title: "Shingle Style Residence", category: "Exterior", location: "New England", src: "/images/project-06.jpg" },
  { id: 'floor-02', title: "Built-in Cabinetry", category: "Interior", location: "Boston Area", src: "/images/flooring-02.jpg" },
  { id: 7, title: "Outdoor Deck Build", category: "Exterior", location: "New England", src: "/images/project-07.jpg" },
  { id: 'int-luxury-05', title: "Kitchen Island Detail", category: "Interior", location: "Martha's Vineyard", src: "/images/interior-02.jpg" },
  { id: 8, title: "Modern Interior", category: "Interior", location: "New England", src: "/images/project-05.jpg" },
  { id: 'floor-03', title: "Dark Hardwood Restoration", category: "Remodeling", location: "New England", src: "/images/flooring-03.jpg" },
  { id: 9, title: "Classic Colonial", category: "Exterior", location: "New England", src: "/images/project-13.jpg" },
  { id: 10, title: "Custom Closet Remodel", category: "Remodeling", location: "New England", src: "/images/project-15.jpg" },
  { id: 11, title: "Kitchen Remodel", category: "Remodeling", location: "New England", src: "/images/project-16.jpg" },
  { id: 12, title: "Cedar Deck Refinish", category: "Exterior", location: "New England", src: "/images/project-09.jpg" },
];

const FILTERS: Category[] = ["All Projects", "Interior", "Exterior", "Remodeling", "Commercial"];

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState<Category>("All Projects");
  const [lightboxId, setLightboxId] = useState<number | string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeFilter === "All Projects"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeFilter);
  const mobileSliderPages: Project[][] = [];
  for (let i = 0; i < filtered.length; i += 4) {
    mobileSliderPages.push(filtered.slice(i, i + 4));
  }

  const lightboxIndex = lightboxId != null ? filtered.findIndex((p) => p.id === lightboxId) : -1;
  const currentProject = lightboxIndex >= 0 ? filtered[lightboxIndex] : null;

  const closeLightbox = () => setLightboxId(null);
  const showPrev = () => {
    if (lightboxIndex < 0) return;
    const next = (lightboxIndex - 1 + filtered.length) % filtered.length;
    setLightboxId(filtered[next].id);
  };
  const showNext = () => {
    if (lightboxIndex < 0) return;
    const next = (lightboxIndex + 1) % filtered.length;
    setLightboxId(filtered[next].id);
  };

  useEffect(() => {
    if (lightboxId == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxId, activeFilter]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const slide = el.firstElementChild as HTMLElement | null;
      const gap = parseFloat(window.getComputedStyle(el).columnGap || "0");
      const slideWidth = slide ? slide.offsetWidth + gap : el.offsetWidth;
      const index = slideWidth > 0 ? Math.round(el.scrollLeft / slideWidth) : 0;
      setActiveSlide(index);
    };

    setActiveSlide(0);
    el.scrollTo({ left: 0 });
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [activeFilter]);

  return (
    <PageLayout>
      <SEO
        title="Painting and Remodeling Portfolio | New England Projects"
        description="Browse our work across New England. Interior, exterior, remodeling and deck projects since 2004."
        canonical="/portfolio"
        keywords="painting portfolio New England, painting projects New England, before after painting New England, remodeling projects MA"
      />
      <InnerHero
        title="Our work speaks for itself."
        subtitle="20 years of projects across New England."
        crumbs={[{ label: "Home", to: "/" }, { label: "Portfolio" }]}
      />

      {/* Filters */}
      <section className="bg-background border-b border-border sticky top-16 md:top-20 z-30">
        <div className="container">
          <div className="flex gap-2 md:gap-3 overflow-x-auto py-4 md:py-6 -mx-6 px-6 scrollbar-none">
            {FILTERS.map((f) => {
              const active = f === activeFilter;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={cn(
                    "shrink-0 px-5 py-2 text-sm font-medium border rounded-full transition-colors whitespace-nowrap",
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-foreground border-border hover:border-primary hover:text-primary",
                  )}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-background">
        <div className="container py-12 md:py-16">
          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <FadeUpSection key={p.id} delay={(i % 3) * 0.1}>
                <button
                  onClick={() => setLightboxId(p.id)}
                  className="portfolio-item group relative aspect-[4/3] overflow-hidden text-left w-full"
                >
                  <img
                    src={p.src}
                    alt={`${p.title}, ${p.location}`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="portfolio-overlay absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <div className="portfolio-caption">
                      <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">
                        {p.category}
                      </p>
                      <h3 className="font-display text-2xl md:text-3xl text-background">
                        {p.title}
                      </h3>
                      <p className="text-sm text-background/70 mt-1">{p.location}</p>
                    </div>
                  </div>
                </button>
              </FadeUpSection>
            ))}
          </div>

          {/* Mobile 2x2 Slider */}
          <div className="md:hidden -mx-6">
            <div
              ref={scrollRef}
              className="flex overflow-x-auto snap-x snap-mandatory gap-3 px-6 scrollbar-none"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {mobileSliderPages.map((page, pageIdx) => (
                <div
                  key={pageIdx}
                  className="grid grid-cols-2 gap-3 shrink-0 snap-center"
                  style={{ width: 'calc(100vw - 48px)' }}
                >
                  {page.map((p, itemIdx) => (
                    <button
                      key={p.id}
                      type="button"
                      className="relative aspect-square overflow-hidden rounded-[10px] text-left"
                      onClick={() => setLightboxId(p.id)}
                    >
                      <img
                        src={p.src}
                        alt={`${p.title}, ${p.location}`}
                        loading={pageIdx === 0 && itemIdx < 2 ? "eager" : "lazy"}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div
                        className="absolute inset-x-0 bottom-0 flex min-h-[42%] flex-col justify-end p-3"
                        style={{
                          background:
                            "linear-gradient(to top, hsl(var(--foreground) / 0.58) 0%, hsl(var(--foreground) / 0.18) 58%, transparent 100%)",
                        }}
                      >
                        <h3 className="font-sans text-[12px] font-semibold leading-tight text-background">
                          {p.title}
                        </h3>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Dots */}
            <div className="flex justify-center items-center gap-2 mt-4">
              {mobileSliderPages.map((_, i) => (
                <div
                  key={i}
                  className={`transition-all duration-300 ${
                    activeSlide === i 
                      ? "h-[6px] w-[20px] rounded-[3px] bg-primary" 
                      : "h-[6px] w-[6px] rounded-full bg-foreground/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dark">
        <div className="container py-16 md:py-24 text-center">
          <FadeUpSection>
            <h2 className="font-display text-3xl md:text-5xl text-background leading-tight max-w-2xl mx-auto">
              Like what you see? Let&apos;s talk about your project.
            </h2>
            <RippleButton
              asChild
              size="lg"
              className="mt-8 bg-primary text-primary-foreground hover:bg-primary-dark rounded-sm h-12 px-10"
            >
              <Link to="/contact">Request a Consultation</Link>
            </RippleButton>
          </FadeUpSection>
        </div>
      </section>

      {/* Lightbox */}
      {currentProject && (
        <div
          className="fixed inset-0 z-[100] bg-foreground/95 flex items-center justify-center p-4 md:p-8 animate-fade-in"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={closeLightbox}
            aria-label="Close"
            className="absolute top-4 right-4 md:top-6 md:right-6 text-background/80 hover:text-primary transition-colors p-2"
          >
            <X size={28} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Previous"
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-background/80 hover:text-primary transition-colors p-2"
          >
            <ChevronLeft size={36} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Next"
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-background/80 hover:text-primary transition-colors p-2"
          >
            <ChevronRight size={36} />
          </button>

          <div
            className="w-full max-w-[900px] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentProject.src}
              alt={`${currentProject.title}, ${currentProject.location}`}
              className="w-full aspect-[4/3] object-cover"
            />
            <div className="mt-6 text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-primary mb-2">
                {currentProject.category}
              </p>
              <h3 className="font-display text-2xl md:text-4xl text-background">
                {currentProject.title}
              </h3>
              <p className="text-sm text-background/70 mt-2">{currentProject.location}</p>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Portfolio;