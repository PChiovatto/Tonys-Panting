import { Instagram, Facebook } from "lucide-react";
import SEO from "@/components/SEO";
import PageLayout from "@/components/site/PageLayout";
import InnerHero from "@/components/site/InnerHero";
import ContactForm from "@/components/site/ContactForm";
import { Separator } from "@/components/ui/separator";

const contactBlocks = [
  {
    label: "Phone",
    value: "508 982 9675",
    href: "tel:+15089829675",
  },
  {
    label: "Email",
    value: "Tonyspainting11@gmail.com",
    href: "mailto:Tonyspainting11@gmail.com",
  },
  {
    label: "Service Area",
    value: "New England",
    href: null,
  },
];

const trustItems = [
  "Licensed and Insured",
  "Free Estimates",
  "20 Years of Transforming Homes & Experiences",
];

const Contact = () => {
  return (
    <PageLayout>
      <SEO
        title="Get a Free Painting Estimate in New England"
        description="Contact Tony's Painting and Remodeling for a free estimate. Serving New England. Call 508 982 9675 or fill out the form."
        canonical="/contact"
        keywords="free painting estimate New England, painting quote New England, contact painters New England, hire painting contractor MA"
        schema={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Get a Free Estimate",
          description: "Request a free painting and remodeling estimate from Tony's team.",
          mainEntity: {
            "@type": "LocalBusiness",
            name: "Tony's Painting and Remodeling",
            telephone: "+15089829675",
            email: "Tonyspainting11@gmail.com",
            address: {
              "@type": "PostalAddress",
              addressLocality: "New England",
              addressRegion: "MA",
              addressCountry: "US",
            },
          },
        }}
      />
      <InnerHero
        title="Let's talk about your project."
        subtitle="Tell us what you need and we will get back to you within one business day."
        crumbs={[{ label: "Home", to: "/" }, { label: "Contact" }]}
      />

      <section className="bg-background">
        <div
          className="contact-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 40,
            alignItems: "start",
            padding: "40px 80px",
            maxWidth: 1280,
            margin: "0 auto",
          }}
        >
          {/* Form card */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8E2D8",
              borderRadius: 8,
              padding: 20,
            }}
          >
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: 18,
                color: "#1A1A1A",
                margin: 0,
              }}
            >
              Request a Consultation
            </h2>
            <p
              style={{
                marginTop: 4,
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12,
                color: "#6B6560",
              }}
            >
              No commitment. We will review your request and reach out to schedule a visit.
            </p>
            <div style={{ marginTop: 16 }}>
              <ContactForm compact />
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: 22,
                color: "#1A1A1A",
                margin: 0,
              }}
            >
              Prefer to call?
            </h2>

            <div className="mt-6 space-y-5">
              {contactBlocks.map((b) => (
                <div key={b.label} className="flex items-start gap-3">
                  <span
                    className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0"
                    aria-hidden
                  />
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      {b.label}
                    </div>
                    {b.href ? (
                      <a
                        href={b.href}
                        className="mt-1 block text-foreground hover:text-primary transition-colors text-base"
                      >
                        {b.value}
                      </a>
                    ) : (
                      <div className="mt-1 text-foreground text-base">{b.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <p className="text-sm text-muted-foreground leading-relaxed">
              We typically respond within one business day. For urgent requests, please call directly.
            </p>

            <div className="mt-5 flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook size={20} />
              </a>
            </div>
          </aside>
        </div>

        {/* Mobile stack override */}
        <style>{`
          @media (max-width: 767px) {
            .contact-grid {
              grid-template-columns: 1fr !important;
              padding: 24px !important;
              gap: 24px !important;
            }
          }
        `}</style>
      </section>


      {/* Trust strip */}
      <section className="bg-stone py-10">
        <div className="container flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12">
          {trustItems.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden />
              <span className="text-sm md:text-base text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
};

export default Contact;
