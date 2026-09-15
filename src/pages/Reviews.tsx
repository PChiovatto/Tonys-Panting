import { Star } from "lucide-react";
import SEO from "@/components/SEO";
import PageLayout from "@/components/site/PageLayout";
import InnerHero from "@/components/site/InnerHero";
import FadeUpSection from "@/components/site/FadeUpSection";
import RippleButton from "@/components/site/RippleButton";

const reviews = [
  {
    name: "Alicat91141",
    text: "Tony was very accommodating, professional and fair in his price. He not only painted the interior of my house but also finished the hardwood floors. He kept me in the loop and sent pictures. The estimate of time was spot on. I will go to Tony's Painting for any additional work. Highly recommend.",
  },
  {
    name: "Curtis Highsmith",
    text: "The pictures do not do it justice. Tony's Painting did an amazing job. Clean, reliable, and professional. I am in the construction business and have a choice of who I use for subcontractors. If you are looking for a master painter, call Tony's Painting.",
  },
  {
    name: "Shane Sanders",
    text: "Tony and his team just finished painting the entire inside of our house. Very professional and detail oriented. His customer service was exceptional. Both he and his team were very prompt and responsive and the quality of work was top notch. Tony is number 1.",
  },
  {
    name: "OB Resident",
    text: "Tony and his team just finished painting our home. We could not be happier with the results. I told him up front I was picky and expected quality with no mess and he delivered. Any small issues were quickly corrected. His team clearly wanted to exceed expectations and they did.",
  },
  {
    name: "Meghan Rayner",
    text: "Amazing quality work. They were so flexible and easy to work with. Will definitely use Tony's again.",
  },
  {
    name: "Mark Duffy",
    text: "Tony's Painting is the real deal. They flawlessly transformed my 1920s home with Benjamin Moore paint. Tony's collaboration skills are top notch. Despite the heat, his team's punctuality and work ethic were impressive. For any exterior painting project, Tony's Painting is the go-to choice.",
  },
  {
    name: "Roberta Staula",
    text: "Very professional and efficient.",
  },
  {
    name: "Cathy Sclafani",
    text: "Tony and his crew were fabulous. So professional and did an excellent job. Having him work on all of my projects. Thanks Tony.",
  },
  {
    name: "Edwina Hawes",
    text: "Not just island good, but excellent painting for any circumstance. Tony's team of professionals gets it done right. The Hawes Family.",
  },
];

const Stars = ({ size = 16 }: { size?: number }) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={size} className="fill-primary text-primary" />
    ))}
  </div>
);

const Reviews = () => {
  return (
    <PageLayout>
      <SEO
        title="5-Star Reviews | Tony's Painting and Remodeling"
        description="Real Google reviews from clients across New England. See why Tony's is the most trusted painting company in the region."
        canonical="/reviews"
        keywords="Tony's Painting reviews, painting company reviews New England, best painters New England, 5 star painting contractor MA"
      />
      <InnerHero
        title="What our clients say."
        subtitle="Every review below is from a real client on Google. We let the work speak for itself."
        crumbs={[{ label: "Home", to: "/" }, { label: "Reviews" }]}
      />

      {/* Score summary */}
      <section className="bg-dark">
        <div className="container py-20 md:py-28 flex flex-col items-center text-center">
          <FadeUpSection className="flex flex-col items-center">
            <div className="font-display text-7xl md:text-8xl text-background leading-none">
              5.0
            </div>
            <div className="mt-6">
              <Stars size={24} />
            </div>
            <p className="mt-6 text-sm uppercase tracking-[0.25em] text-background/60">
              Based on Google Reviews
            </p>
          </FadeUpSection>
        </div>
      </section>

      {/* Reviews grid */}
      <section className="bg-background">
        <div className="container py-20 md:py-28">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <FadeUpSection
                key={r.name}
                delay={(i % 3) * 0.1}
                as="article"
                className="bg-surface border border-border p-8 md:p-10 flex flex-col"
              >
                <div className="font-semibold text-foreground">{r.name}</div>
                <div className="mt-3">
                  <Stars />
                </div>
                <p
                  className="mt-5 text-muted-foreground"
                  style={{ lineHeight: 1.7 }}
                >
                  {r.text}
                </p>
              </FadeUpSection>
            ))}
          </div>

          {/* Google Review CTA hidden temporarily */}
          {/* <div style={{
            textAlign: 'center',
            marginTop: '48px',
            padding: '40px 24px',
            background: 'white',
            borderRadius: '16px',
            border: '1px solid #E8E2D8',
            maxWidth: '480px',
            margin: '40px auto 0',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px', letterSpacing: '-2px' }}>⭐⭐⭐⭐⭐</div>
            <h3 style={{
              fontFamily: \"'Playfair Display', serif\",
              fontWeight: 700,
              fontSize: '22px',
              color: '#1A1A1A',
              marginBottom: '8px',
            }}>
              Loved working with us?
            </h3>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              color: '#6B6560',
              lineHeight: 1.7,
              marginBottom: '24px',
              maxWidth: '340px',
              margin: '0 auto 24px',
            }}>
              Your review helps other homeowners in New England find us. It takes less than a minute.
            </p>
            <a
              href=\"https://www.google.com/maps/place/?q=place_id:0x89e529970477bc27:0x3d37406d51e5cec&action=write-review\"
              target=\"_blank\"
              rel=\"noopener noreferrer\"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#1A1A1A',
                color: 'white',
                padding: '13px 28px',
                borderRadius: '8px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              Write a Google Review →
            </a>
          </div> */}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dark">
        <div className="container py-20 md:py-28 text-center">
          <FadeUpSection>
            <h2 className="font-display text-3xl md:text-5xl text-background leading-tight max-w-2xl mx-auto">
              Ready to be our next happy client?
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
    </PageLayout>
  );
};

export default Reviews;
