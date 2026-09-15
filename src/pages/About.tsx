import { Check, Wrench, Handshake } from "lucide-react";
import SEO from "@/components/SEO";
import PageLayout from "@/components/site/PageLayout";
import InnerHero from "@/components/site/InnerHero";
import FadeUpSection from "@/components/site/FadeUpSection";
import RippleButton from "@/components/site/RippleButton";
import otonielSantos from "@/assets/otoniel-santos-founder.png";
import cintiaPhoto from "@/assets/cintia-sales.jpeg.asset.json";
import marcelaPhoto from "@/assets/marcela-co-ceo.jpeg.asset.json";

const values = [
  {
    icon: Check,
    title: "Professionalism",
    description:
      "We treat every home and business as if it were our own. Clean, respectful and always on schedule.",
  },
  {
    icon: Wrench,
    title: "Hard Work",
    description:
      "No shortcuts. We prepare every surface properly and finish every job the way it deserves to be finished.",
  },
  {
    icon: Handshake,
    title: "Honesty",
    description:
      "You get a straight answer from us every time. Fair pricing, clear timelines and no surprises.",
  },
];

const timeline = [
  { year: "2004", text: "Otoniel Santos founds Tony's Painting in New England." },
  { year: "2008", text: "Expands into commercial projects across the region." },
  { year: "2012", text: "Team grows and project volume across New England doubles." },
  { year: "2018", text: "Over 300 projects completed across New England." },
  { year: "2024", text: "20 years, 500 projects and a reputation built one brushstroke at a time." },
];

const About = () => {
  return (
    <PageLayout>
      <SEO
        title="About Tony's Painting and Remodeling | Est. 2004"
        description="Founded in 2004 by Otoniel Santos in New England. 20 years serving New England with professionalism, hard work and honesty."
        canonical="/about"
        keywords="Tony's Painting history, painting company New England, Otoniel Santos painter, painting remodeling New England since 2004"
        schema={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About Tony's Painting and Remodeling",
          description:
            "Founded in 2004 by Otoniel Santos in New England, serving New England for over 20 years.",
          mainEntity: {
            "@type": "LocalBusiness",
            name: "Tony's Painting and Remodeling",
            foundingDate: "2004",
            founder: { "@type": "Person", name: "Otoniel Santos" },
          },
        }}
      />
      <InnerHero
        title="20 years of doing the work right."
        subtitle="Tony started this company with a simple belief: that the quality of your work is the only thing that matters."
        crumbs={[{ label: "Home", to: "/" }, { label: "About Us" }]}
      />

      {/* Leadership */}
      <section className="bg-background">
        <div className="container py-20 md:py-28">
          <FadeUpSection className="max-w-2xl mx-auto text-center mb-12 md:mb-16">
            <h2 className="font-display text-3xl md:text-5xl text-foreground leading-tight">
              The people behind the work.
            </h2>
            <p className="mt-6 text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Tony's Painting was built on a simple belief: show up, do the work right, and treat every client the way you would want to be treated.
            </p>
          </FadeUpSection>

          <div className="relative max-w-[720px] mx-auto grid md:grid-cols-2 gap-12">
            {/* Vertical divider, desktop only */}
            <div
              className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-stone"
              aria-hidden
            />

            {/* Tony */}
            <FadeUpSection className="flex flex-col items-center text-center gap-4">
              <div className="w-[160px] h-[200px] md:w-[260px] md:h-[320px] overflow-hidden rounded-[6px]">
                <img
                  src={otonielSantos}
                  alt="Otoniel Santos, Founder and CEO of Tony's Painting"
                  className="block w-full h-full object-cover object-[top_center]"
                />
              </div>
              <h3 className="font-sans font-semibold text-[15px] md:text-[18px] text-foreground leading-tight mt-2">
                Otoniel Santos
              </h3>
              <p className="text-[10px] md:text-[12px] font-medium uppercase tracking-[0.08em] text-primary">
                Founder and CEO
              </p>
              <p className="text-sm text-muted-foreground leading-[1.7] max-w-[280px]">
                Tony started this company in 2004 with one goal: to do the work right. Two decades later, that standard still defines every project we deliver.
              </p>
            </FadeUpSection>

            {/* Marcela */}
            <FadeUpSection delay={0.1} className="flex flex-col items-center text-center gap-4">
              <div className="w-[160px] h-[200px] md:w-[260px] md:h-[320px] overflow-hidden rounded-[6px]">
                <img
                  src={marcelaPhoto.url}
                  alt="Marcela S., Co-CEO of Tony's Painting"
                  className="block w-full h-full object-cover object-[top_center]"
                />
              </div>
              <h3 className="font-sans font-semibold text-[15px] md:text-[18px] text-foreground leading-tight mt-2">
                Marcela S.
              </h3>
              <p className="text-[10px] md:text-[12px] font-medium uppercase tracking-[0.08em] text-primary">
                Co-CEO
              </p>
              <p className="text-sm text-muted-foreground leading-[1.7] max-w-[280px]">
                Marcela leads operations and client relationships at Tony's, making sure every project runs smoothly from the first call to the final walkthrough.
              </p>
            </FadeUpSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-stone">
        <div className="container py-20 md:py-28">
          <FadeUpSection className="max-w-2xl mb-12 md:mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">Our Values</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground leading-tight">
              What we stand for.
            </h2>
          </FadeUpSection>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <FadeUpSection
                key={v.title}
                delay={i * 0.1}
                className="bg-surface p-8 md:p-10 border border-border"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-stone text-primary mb-6">
                  <v.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-2xl text-foreground mb-3">{v.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{v.description}</p>
              </FadeUpSection>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-background">
        <div className="container py-20 md:py-28">
          <FadeUpSection className="max-w-2xl mb-12 md:mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">Timeline</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground leading-tight">
              Our story.
            </h2>
          </FadeUpSection>

          <ol className="relative max-w-3xl">
            <div
              className="absolute left-[7px] top-2 bottom-2 w-px bg-primary"
              aria-hidden
            />
            {timeline.map((item, i) => (
              <FadeUpSection key={item.year} delay={i * 0.1} as="li" className="relative pl-10 pb-10 last:pb-0 block">
                <span className="absolute left-0 top-2 w-4 h-4 rounded-full bg-primary ring-4 ring-background" />
                <div className="font-display text-2xl md:text-3xl text-primary leading-none">
                  {item.year}
                </div>
                <p className="mt-2 text-base md:text-lg text-foreground leading-relaxed">
                  {item.text}
                </p>
              </FadeUpSection>
            ))}
          </ol>
        </div>
      </section>

      {/* Service areas */}
      <section className="bg-background border-t border-border">
        <div className="container py-20 md:py-28">
          <div className="max-w-2xl mb-12 md:mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">Coverage</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground leading-tight">
              Where we work.
            </h2>
          </div>

          <div className="max-w-2xl">
            <p className="text-base md:text-lg text-foreground leading-relaxed">
              We serve clients across New England, taking on residential and commercial projects throughout the region.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dark">
        <div className="container py-20 md:py-28 text-center">
          <FadeUpSection>
            <h2 className="font-display text-3xl md:text-5xl text-background leading-tight max-w-2xl mx-auto">
              We would love to work on your next project.
            </h2>
            <div className="mt-10">
              <RippleButton
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary-dark rounded-sm h-12 px-10"
              >
                <a href="/contact">Request a Consultation</a>
              </RippleButton>
            </div>
          </FadeUpSection>
        </div>
      </section>

      {/* Meet Our Sales Team */}
      <section style={{
        background: 'white',
        padding: 'clamp(60px, 8vw, 100px) 20px',
        borderTop: '1px solid #E8E2D8',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#C4291C',
              marginBottom: '12px',
            }}>Our People</p>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: 'clamp(32px, 4vw, 48px)',
              color: '#1A1A1A',
              lineHeight: 1.1,
              margin: 0,
            }}>Meet Our Sales Team</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '28px',
            maxWidth: '900px',
            margin: '0 auto',
          }}>

            {/* CINTIA */}
            <div style={{
              background: '#FAFAFA',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid #E8E2D8',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            }}>
              <img
                src={cintiaPhoto.url}
                alt="Cintia, Sales Representative at Tony's Painting"
                style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  display: 'block',
                }}
              />
              <div style={{ padding: '24px' }}>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: '22px',
                  color: '#1A1A1A',
                  margin: '0 0 4px',
                }}>Cintia</h3>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#C4291C',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  margin: '0 0 16px',
                }}>Sales Representative</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <a href="tel:5087449103" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    color: '#1A1A1A',
                    textDecoration: 'none',
                  }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C4291C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.64A2 2 0 012 .99h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                    </svg>
                    (508) 744-9103
                  </a>
                </div>
              </div>
            </div>

            {/* VINICIUS */}
            <div style={{
              background: '#FAFAFA',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid #E8E2D8',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            }}>
              <div style={{
                width: '100%',
                aspectRatio: '1/1',
                background: '#E8E2D8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#9CA3AF',
                }}>Vinicius</span>
              </div>
              <div style={{ padding: '24px' }}>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: '22px',
                  color: '#1A1A1A',
                  margin: '0 0 4px',
                }}>Vinicius</h3>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#C4291C',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  margin: '0 0 16px',
                }}>Director of Sales</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <a href="tel:7748237239" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    color: '#1A1A1A',
                    textDecoration: 'none',
                  }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C4291C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.64A2 2 0 012 .99h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                    </svg>
                    (774) 823-7239
                  </a>
                </div>
              </div>
            </div>

            {/* GUSTAVO */}
            <div style={{
              background: '#FAFAFA',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid #E8E2D8',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            }}>
              <div style={{
                width: '100%',
                aspectRatio: '1/1',
                background: '#E8E2D8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#9CA3AF',
                }}>Gustavo</span>
              </div>
              <div style={{ padding: '24px' }}>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: '22px',
                  color: '#1A1A1A',
                  margin: '0 0 4px',
                }}>Gustavo</h3>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#C4291C',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  margin: '0 0 16px',
                }}>Sales Representative</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <a href="tel:5085601696" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    color: '#1A1A1A',
                    textDecoration: 'none',
                  }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C4291C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.64A2 2 0 012 .99h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                    </svg>
                    (508) 560-1696
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Google Review Section hidden temporarily */}
      {/* <div style={{
        background: '#1A1A1A',
        padding: '64px 40px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', fontFamily: 'Inter', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          20 years of trust
        </p>
        <h2 style={{
          fontFamily: \"'Playfair Display', serif\",
          fontWeight: 900,
          fontSize: 'clamp(24px, 3vw, 36px)',
          color: '#F5F1EB',
          marginBottom: '24px',
          lineHeight: 1.1,
        }}>
          We have earned it.
        </h2>
        <a
          href=\"https://www.google.com/maps/place/?q=place_id:0x89e529970477bc27:0x3d37406d51e5cec&action=write-review\"
          target=\"_blank\"
          rel=\"noopener noreferrer\"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#C4291C',
            color: 'white',
            padding: '13px 28px',
            borderRadius: '8px',
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: '14px',
            textDecoration: 'none',
          }}
        >
          ⭐ Leave a Google Review
        </a>
      </div> */}
    </PageLayout>

  );
};

export default About;
