import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import PageLayout from "@/components/site/PageLayout";
import InnerHero from "@/components/site/InnerHero";
import FadeUpSection from "@/components/site/FadeUpSection";
import RippleButton from "@/components/site/RippleButton";

const services = [
  {
    name: 'Interior Painting',
    description: 'Refined interior finishes for every room, from a single accent wall to your entire home.',
    href: '/services/interior-painting',
    image: '/images/interior-04.jpg',
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
    image: '/images/remodeling-02.jpg',
  },
  {
    name: 'Flooring',
    description: 'Hardwood installation, refinishing and restoration that transforms any space.',
    href: '/services/flooring',
    image: '/images/flooring-01.jpg',
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
  {
    name: 'General Carpentry',
    description: 'Trim, moldings, built-ins and structural wood repairs done with care and precision.',
    href: '/services/carpentry',
    image: '/images/flooring-02.jpg',
  },
  {
    name: 'Plastering',
    description: 'Crack repair, skim coating and plaster restoration for walls that look brand new.',
    href: '/services/plastering',
    image: '/images/interior-01.jpg',
  },
  {
    name: 'Handyman Services',
    description: 'Small repairs and fixes done right. No job is too small for our experienced team.',
    href: '/services/handyman',
    image: '/images/project-09.jpg',
  },
  {
    name: 'Fence',
    description: 'Wood and vinyl fence installation and repair that stands strong through any season.',
    href: '/services/fence',
    image: '/images/project-14.jpg',
  },
  {
    name: 'Countertop',
    description: 'Kitchen and bathroom countertop installation with precise measurement and clean finish.',
    href: '/services/countertop',
    image: '/images/interior-02.jpg',
  },
  {
    name: 'Construction Cleaning',
    description: 'Post-construction cleanup for residential spaces. Ready to use from day one.',
    href: '/services/construction-cleaning',
    image: '/images/interior-05.jpg',
  },
];

const Services = () => {
  return (
    <PageLayout>
      <SEO
        title="Painting and Remodeling Services in New England"
        description="From interior and exterior painting to flooring, tile, carpentry and remodeling. Tony's serves New England. Free estimates."
        canonical="/services"
        keywords="painting services New England, remodeling contractor New England, interior exterior painters New England, flooring tile carpentry New England"
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Painting and Remodeling Services",
          provider: {
            "@type": "LocalBusiness",
            name: "Tony's Painting and Remodeling",
            telephone: "+15089829675",
          },
          areaServed: "New England, USA",
          description:
            "Professional painting and remodeling services including interior painting, exterior painting, flooring, tile, carpentry and more.",
          offers: {
            "@type": "Offer",
            availability: "https://schema.org/InStock",
            priceCurrency: "USD",
          },
        }}
      />
      <FadeUpSection>
        <InnerHero
          title="Everything your space needs."
          subtitle="From a fresh coat of paint to a full remodel, we handle it all."
          crumbs={[{ label: "Home", to: "/" }, { label: "Services" }]}
        />
      </FadeUpSection>

      <section className="bg-background">
        <div className="container py-16 md:py-24">
          <div className="services-page-grid">
            {services.map((service, i) => (
              <FadeUpSection key={service.href} delay={i * 0.05}>
                <Link to={service.href} className="service-image-card-link">
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
                      <h2 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 700,
                        fontSize: '18px',
                        color: '#1A1A1A',
                        margin: 0,
                      }}>
                        {service.name}
                      </h2>
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
                      <span style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#C4291C',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '4px',
                      }}>
                        Learn more →
                      </span>
                    </div>
                  </article>
                </Link>
              </FadeUpSection>
            ))}
          </div>
        </div>

        <style>{`
          .service-image-card-link {
            display: block;
            text-decoration: none;
            height: 100%;
          }
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
          .services-page-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
          }
          @media (min-width: 768px) {
            .services-page-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          @media (min-width: 1024px) {
            .services-page-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }
        `}</style>
      </section>

      <section className="bg-dark">
        <div className="container py-16 md:py-24 text-center">
          <FadeUpSection>
            <h2 className="font-display text-3xl md:text-5xl text-background leading-tight max-w-2xl mx-auto">
              Not sure which service you need? We can help.
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
    </PageLayout>
  );
};

export default Services;
