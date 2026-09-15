import RippleButton from "@/components/site/RippleButton";
import FadeUpSection from "@/components/site/FadeUpSection";

const FinalCTA = () => {
  return (
    <section id="contact" className="bg-dark">
      <div className="container py-20 md:py-32 text-center">
        <FadeUpSection>
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-6">Get Started</p>
          <h2 className="font-display text-4xl md:text-6xl text-background leading-tight max-w-3xl mx-auto">
            Ready to transform your space?
          </h2>
          <p className="mt-6 text-background/70 max-w-xl mx-auto leading-relaxed">
            Tell us about your project. We will respond within one business day with a free estimate.
          </p>
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
  );
};

export default FinalCTA;
