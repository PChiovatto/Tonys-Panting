import { useState, useRef, useEffect } from "react";
import FadeUpSection from "@/components/site/FadeUpSection";

const services = [
  {
    name: 'Interior Painting',
    description: 'Refined interior finishes for every room, from a single accent wall to your entire home.',
    href: '/services/interior-painting',
    image: '/images/interior-05.jpg',
  },
  {
    name: 'Exterior Painting',
    description: 'Premium coatings built to handle New England weather, applied with proper prep and care.',
    href: '/services/exterior-painting',
    image: '/images/project-13.jpg',
  },
  {
    name: 'Remodeling',
    description: 'Full-scope remodeling for kitchens, bathrooms and living spaces across New England.',
    href: '/services/remodeling',
    image: '/images/project-15.jpg',
  },
  {
    name: 'Flooring',
    description: 'Hardwood installation, refinishing and restoration that transforms any space.',
    href: '/services/flooring',
    image: '/images/flooring-02.jpg',
  },
  {
    name: 'Ceramic Tile',
    description: 'Precision tile work for bathrooms, kitchens and floors. Clean lines, lasting results.',
    href: '/services/ceramic-tile',
    image: '/images/project-04.jpg',
  },
  {
    name: 'Deck and Stairs',
    description: 'Staining, sealing and repair for decks and stairs built to withstand New England winters.',
    href: '/services/deck-stairs',
    image: '/images/project-07.jpg',
  },
];

const ServiceCard = ({ service }: { service: typeof services[number] }) => (
  <article className="service-image-card">
    <div className="service-image-wrap">
      <img
        src={service.image}
        alt={service.name}
        loading="lazy"
        decoding="async"
      />
    </div>
    <div style={{ height: '2px', background: '#C4291C' }} />
    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <h3 style={{
        fontFamily: "'Playfair Display', serif",
        fontWeight: 700,
        fontSize: '18px',
        color: '#1A1A1A',
        margin: 0,
      }}>
        {service.name}
      </h3>
      <p style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        color: '#6B6560',
        lineHeight: 1.65,
        margin: 0,
        flex: 1,
      }}>
        {service.description}
      </p>
      <a
        href={service.href}
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          fontWeight: 600,
          color: '#C4291C',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          marginTop: '4px',
        }}
      >
        Learn more →
      </a>
    </div>
  </article>
);

const ServicesPreview = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  return (
    <section id="services" className="bg-background">
      <div className="container py-20 md:py-28">
        <FadeUpSection className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">What We Do</p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground leading-tight">
            Craftsmanship for homes that deserve more.
          </h2>
        </FadeUpSection>

        {/* Desktop / Tablet Grid */}
        <div className="services-image-grid mt-12 md:mt-16">
          {services.map((service, i) => (
            <FadeUpSection key={service.href} delay={i * 0.05}>
              <ServiceCard service={service} />
            </FadeUpSection>
          ))}
        </div>

        {/* Mobile Slider */}
        <div className="md:hidden mt-12 -mx-6">
          <div ref={scrollRef} className="services-image-slider">
            {services.map((service) => (
              <div key={service.href} className="services-image-slide">
                <ServiceCard service={service} />
              </div>
            ))}
          </div>

          <div className="services-image-dots">
            {services.map((_, i) => (
              <div key={i} className={`services-image-dot ${activeSlide === i ? "active" : ""}`} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .service-image-card {
          background: #FFFFFF;
          border-radius: 12px;
          border: 0.5px solid #E8E2D8;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.2s ease;
          height: 100%;
        }
        .service-image-wrap {
          position: relative;
          aspect-ratio: 16/9;
          overflow: hidden;
        }
        .service-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          transition: transform 0.4s ease;
        }
        .service-image-card:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.10);
        }
        .service-image-card:hover img {
          transform: scale(1.04);
        }

        @media (min-width: 768px) {
          .services-image-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }
        @media (min-width: 1024px) {
          .services-image-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 767px) {
          .services-image-grid {
            display: none;
          }
          .services-image-slider {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            -ms-overflow-style: none;
            gap: 16px;
            padding: 0 24px;
          }
          .services-image-slider::-webkit-scrollbar {
            display: none;
          }
          .services-image-slide {
            flex-shrink: 0;
            width: calc(100vw - 64px);
            scroll-snap-align: center;
          }
          .services-image-dots {
            display: flex;
            justify-content: center;
            gap: 6px;
            margin-top: 16px;
          }
          .services-image-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: rgba(0,0,0,0.15);
            transition: all 0.3s ease;
          }
          .services-image-dot.active {
            width: 20px;
            height: 6px;
            border-radius: 3px;
            background: #C4291C;
          }
        }
      `}</style>
    </section>
  );
};

export default ServicesPreview;
