import FadeUpSection from "@/components/site/FadeUpSection";
import partnersLogos from "@/assets/partners-logos.png";

const PartnersSection = () => {
  return (
    <section
      style={{ backgroundColor: "#323230", contain: "layout style" }}
      className="px-6 py-[60px] md:px-10 md:py-20"
    >
      <div className="mx-auto" style={{ maxWidth: "900px" }}>
        <FadeUpSection delay={0}>
          <p
            className="text-center uppercase"
            style={{
              color: "#6B6560",
              fontSize: "11px",
              letterSpacing: "0.12em",
              marginBottom: "16px",
            }}
          >
            Trusted partners and certifications
          </p>
          <h2
            className="font-display text-center"
            style={{
              fontWeight: 900,
              fontSize: "clamp(28px, 4vw, 40px)",
              color: "#F5F1EB",
              letterSpacing: "-0.02em",
              marginBottom: "16px",
            }}
          >
            We only work with the best materials.
          </h2>
        </FadeUpSection>

        <FadeUpSection delay={0.1}>
          <div
            aria-hidden="true"
            style={{
              width: "40px",
              height: "2px",
              backgroundColor: "#C4291C",
              margin: "0 auto 20px",
            }}
          />
          <p
            className="text-center mx-auto"
            style={{
              color: "#9CA3AF",
              fontSize: "16px",
              lineHeight: 1.7,
              maxWidth: "520px",
              marginBottom: "48px",
            }}
          >
            Every project uses premium paints and materials from trusted brands. That is why our work holds up year after year.
          </p>
        </FadeUpSection>

        <FadeUpSection delay={0.2}>
          <div className="flex justify-center">
            <img
              src={partnersLogos}
              alt="Cabot Stains, Benjamin Moore, Sherwin-Williams, and EPA Lead-Safe Certified Firm"
              loading="lazy"
              className="w-full h-auto"
              style={{
                maxWidth: "560px",
                objectFit: "contain",
              }}
            />
          </div>
        </FadeUpSection>
      </div>
    </section>
  );
};

export default PartnersSection;
