import { Link } from "react-router-dom";
import { Star, Shield, Calendar, Home, Check } from "lucide-react";
import LPForm from "./LPForm";
import LPMiniForm from "./LPMiniForm";
import PartnersSection from "@/components/site/PartnersSection";

interface Review {
  name: string;
  text: string;
}

interface IncludedItem {
  title: string;
  description: string;
}

export interface LandingTemplateProps {
  tag: string;
  headline: string;
  subline: string;
  service: string;
  heroReview: Review;
  reviews: [Review, Review, Review];
  included: IncludedItem[];
  portfolioLocations: string[];
  portfolioImages?: string[];
  heroImage?: string;
}

const TRUST_SIGNALS = [
  "Licensed and Insured",
  "Free Estimates, No Commitment",
  "5-Star Rated on Google",
  "Serving New England since 2004",
  "Response within one business day",
];

const STEPS = [
  {
    n: "01",
    title: "You reach out",
    desc: "Fill out the form or call us directly. We will get back to you within one business day.",
  },
  {
    n: "02",
    title: "We visit and estimate",
    desc: "A member of our team visits your space, evaluates the work and provides a free detailed estimate.",
  },
  {
    n: "03",
    title: "We get to work",
    desc: "Once you approve the estimate, we schedule the job and deliver the finished result on time.",
  },
];

const Stars5 = ({ size = 14 }: { size?: number }) => (
  <div className="flex gap-0.5" aria-label="5 star rating">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={size} style={{ color: "#C4291C", fill: "#C4291C" }} />
    ))}
  </div>
);

const LandingTemplate = ({
  tag,
  headline,
  subline,
  service,
  heroReview,
  reviews,
  included,
  portfolioLocations,
  portfolioImages,
  heroImage,
}: LandingTemplateProps) => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F5F1EB" }}>
      {/* SECTION 1: Fixed header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{ backgroundColor: "#2C2C2A", padding: "14px 24px" }}
      >
        <Link
          to="/"
          className="font-display"
          style={{ fontWeight: 900, fontSize: "18px", color: "#F5F1EB", letterSpacing: "-0.02em" }}
        >
          Tony&apos;s <span style={{ color: "#C4291C" }}>Painting</span>
        </Link>
        <div className="flex items-center gap-2" style={{ fontSize: "13px" }}>
          <span style={{ color: "#9CA3AF" }} className="hidden sm:inline">Call now:</span>
          <a href="tel:+15089829675" style={{ color: "#C4291C", fontWeight: 600 }}>
            508 982 9675
          </a>
        </div>
      </header>

      {/* SECTION 2: Hero with form */}
      <section
        className="grid grid-cols-1 md:grid-cols-[55fr_45fr] min-h-screen"
        style={{ paddingTop: "56px" }}
      >
        {/* Left column */}
        <div
          className="px-6 py-12 md:px-[60px] md:py-[80px] flex flex-col justify-center gap-7"
          style={{ 
            backgroundColor: "#1A1A1A",
            backgroundImage: heroImage ? `linear-gradient(rgba(26, 26, 26, 0.7), rgba(26, 26, 26, 0.7)), url(${heroImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div>
            <span
              className="inline-block uppercase"
              style={{ color: "#C4291C", fontSize: "11px", letterSpacing: "0.1em", fontWeight: 600 }}
            >
              {tag}
            </span>
            <h1
              className="font-display mt-4"
              style={{
                fontWeight: 900,
                fontSize: "clamp(36px, 4vw, 52px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "#F5F1EB",
              }}
            >
              {headline}
            </h1>
            <p
              className="mt-5"
              style={{ color: "#9CA3AF", fontSize: "16px", lineHeight: 1.7, maxWidth: "460px" }}
            >
              {subline}
            </p>
          </div>

          {/* Trust signals */}
          <ul className="space-y-2.5">
            {TRUST_SIGNALS.map((s) => (
              <li key={s} className="flex items-center gap-3" style={{ color: "#E8E2D8", fontSize: "14px" }}>
                <span
                  aria-hidden="true"
                  className="rounded-full"
                  style={{ width: "6px", height: "6px", backgroundColor: "#C4291C", flexShrink: 0 }}
                />
                {s}
              </li>
            ))}
          </ul>

          {/* Featured review (hidden on mobile per spec) */}
          <div
            className="hidden md:block"
            style={{ backgroundColor: "#2C2C2A", borderRadius: "8px", padding: "20px" }}
          >
            <Stars5 size={16} />
            <p className="mt-2 italic" style={{ color: "#E8E2D8", fontSize: "13px", lineHeight: 1.6 }}>
              &ldquo;{heroReview.text}&rdquo;
            </p>
            <p className="mt-2" style={{ color: "#9CA3AF", fontSize: "12px", fontWeight: 500 }}>
              {heroReview.name}
            </p>
          </div>
        </div>

        {/* Right column: form */}
        <div
          className="px-6 py-12 md:px-12 md:py-[60px] flex flex-col justify-center"
          style={{ backgroundColor: "#F5F1EB" }}
        >
          <div className="w-full max-w-md mx-auto">
            <LPForm service={service} />
          </div>
        </div>
      </section>

      {/* SECTION 3: Credentials bar */}
      <section style={{ backgroundColor: "#2C2C2A" }} className="px-6 md:px-10" >
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-5"
          style={{ padding: "20px 0" }}
        >
          {[
            { icon: Shield, label: "Licensed and Insured" },
            { icon: Calendar, label: "Est. 2004" },
            { icon: Home, label: "500+ Projects Completed" },
            { icon: Star, label: "5-Star Google Rating" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center justify-center gap-2">
              <Icon size={20} style={{ color: "#C4291C" }} />
              <span style={{ color: "#F5F1EB", fontSize: "14px", fontWeight: 500 }}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: What's included */}
      <section style={{ backgroundColor: "#F5F1EB", padding: "80px 24px" }}>
        <div className="max-w-6xl mx-auto">
          <h2
            className="font-display"
            style={{
              fontWeight: 900,
              fontSize: "clamp(32px, 4vw, 40px)",
              color: "#1A1A1A",
              letterSpacing: "-0.02em",
            }}
          >
            What&apos;s included.
          </h2>
          <p style={{ color: "#6B6560", fontSize: "16px", marginTop: "8px" }}>
            Everything you need from one experienced team.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
            {included.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E8E2D8",
                  borderRadius: "8px",
                  padding: "20px",
                }}
              >
                <Check size={18} style={{ color: "#C4291C", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <p style={{ color: "#1A1A1A", fontSize: "15px", fontWeight: 600 }}>{item.title}</p>
                  {item.description && (
                    <p style={{ color: "#6B6560", fontSize: "13px", marginTop: "2px" }}>
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: How it works */}
      <section style={{ backgroundColor: "#E8E2D8", padding: "80px 24px" }}>
        <div className="max-w-6xl mx-auto">
          <h2
            className="font-display text-center"
            style={{
              fontWeight: 900,
              fontSize: "clamp(32px, 4vw, 40px)",
              color: "#1A1A1A",
              letterSpacing: "-0.02em",
            }}
          >
            How it works.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
            {STEPS.map((s) => (
              <div key={s.n}>
                <div
                  className="font-display"
                  style={{
                    fontWeight: 900,
                    fontSize: "64px",
                    color: "#C4291C",
                    opacity: 0.3,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {s.n}
                </div>
                <h3
                  className="mt-2"
                  style={{ color: "#1A1A1A", fontSize: "18px", fontWeight: 700 }}
                >
                  {s.title}
                </h3>
                <p style={{ color: "#6B6560", fontSize: "14px", marginTop: "8px", lineHeight: 1.6 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners and certifications */}
      <PartnersSection />

      {/* SECTION 6: Reviews */}
      <section style={{ backgroundColor: "#FFFFFF", padding: "80px 24px" }}>
        <div className="max-w-6xl mx-auto">
          <h2
            className="font-display"
            style={{
              fontWeight: 900,
              fontSize: "clamp(32px, 4vw, 40px)",
              color: "#1A1A1A",
              letterSpacing: "-0.02em",
            }}
          >
            What our clients say.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {reviews.map((r) => (
              <div
                key={r.name}
                style={{
                  backgroundColor: "#F5F1EB",
                  border: "1px solid #E8E2D8",
                  borderRadius: "8px",
                  padding: "24px",
                }}
              >
                <Stars5 />
                <p
                  className="mt-3"
                  style={{ color: "#1A1A1A", fontSize: "14px", lineHeight: 1.7 }}
                >
                  &ldquo;{r.text}&rdquo;
                </p>
                <p className="mt-3" style={{ color: "#6B6560", fontSize: "13px", fontWeight: 600 }}>
                  {r.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: Recent work */}
      <section style={{ backgroundColor: "#F5F1EB", padding: "80px 24px" }}>
        <div className="max-w-6xl mx-auto">
          <h2
            className="font-display"
            style={{
              fontWeight: 900,
              fontSize: "clamp(32px, 4vw, 40px)",
              color: "#1A1A1A",
              letterSpacing: "-0.02em",
            }}
          >
            Recent work.
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-10">
            {portfolioLocations.map((loc, i) => (
              <div key={`${loc}-${i}`}>
                <div
                  style={{
                    backgroundColor: "#E8E2D8",
                    aspectRatio: "4 / 3",
                    borderRadius: "6px",
                    overflow: "hidden"
                  }}
                >
                  {portfolioImages && portfolioImages[i] && (
                    <img src={portfolioImages[i]} alt={`Tony's ${service} project in ${loc}`} className="w-full h-full object-cover" loading="lazy" />
                  )}
                </div>
                <p style={{ color: "#6B6560", fontSize: "12px", marginTop: "8px" }}>{loc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: Final CTA */}
      <section style={{ backgroundColor: "#1A1A1A", padding: "100px 24px" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="font-display"
            style={{
              fontWeight: 900,
              fontSize: "clamp(36px, 5vw, 48px)",
              color: "#F5F1EB",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Ready to get started?
          </h2>
          <p
            className="mt-4"
            style={{ color: "#9CA3AF", fontSize: "16px", lineHeight: 1.6 }}
          >
            Get in touch today and we will take care of the rest.
          </p>
          <div className="mt-10">
            <LPMiniForm service={service} idPrefix="lpcta" />
          </div>
        </div>
      </section>

      {/* Minimal footer */}
      <footer style={{ backgroundColor: "#2C2C2A" }} className="px-6 md:px-10">
        <p
          className="text-center"
          style={{ color: "#6B6560", fontSize: "11px", padding: "16px 0" }}
        >
          Copyright 2024, Tony&apos;s Painting. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingTemplate;
