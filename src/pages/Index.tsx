import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import TrustBar from "@/components/site/TrustBar";
import VideoShowcase from "@/components/site/VideoShowcase";
import ServicesPreview from "@/components/site/ServicesPreview";
import PortfolioPreview from "@/components/site/PortfolioPreview";
import PartnersSection from "@/components/site/PartnersSection";

import AboutSnippet from "@/components/site/AboutSnippet";
import InstagramReels from "@/components/site/InstagramReels";
import FinalCTA from "@/components/site/FinalCTA";
import Footer from "@/components/site/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Painting & Remodeling in MA, NH & RI | Tony's"
        description="Painting, finish carpentry and remodeling in MA, NH and RI, including Martha's Vineyard. Serving homeowners since 2004. Request a free estimate."
        canonical="/"
        keywords="painting company New England, house painters New England, interior exterior painting New England, painting remodeling contractor New England, Tony's Painting"
        schema={{
          "@context": "https://schema.org",
          "@type": "HomeAndConstructionBusiness",
          "@id": "https://tonyspaintingmv.com/#business",
          name: "Tony's Painting and Remodeling",
          description:
            "Professional painting and remodeling services serving New England since 2004.",
          url: "https://tonyspaintingmv.com",
          telephone: "+15089829675",
          email: "Tonyspainting11@gmail.com",
          foundingDate: "2004",
          founder: { "@type": "Person", name: "Otoniel Santos" },
          address: {
            "@type": "PostalAddress",
            streetAddress: "11 Cook Rd",
            addressLocality: "Vineyard Haven",
            postalCode: "02568",
            addressRegion: "MA",
            addressCountry: "US",
          },
          areaServed: [
            { "@type": "State", name: "Massachusetts" },
            { "@type": "State", name: "New Hampshire" },
            { "@type": "State", name: "Rhode Island" },
            { "@type": "Place", name: "Martha's Vineyard" },
          ],
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
            opens: "07:00",
            closes: "18:00",
          },
          priceRange: "$$",
          image: "https://tonyspaintingmv.com/images/project-02.jpg",
          sameAs: [
            "https://www.instagram.com/tonyspainting_remodeling/",
            "https://www.facebook.com/tonyspainting11",
          ],
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Painting and Remodeling Services",
            itemListElement: [
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Interior Painting" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Exterior Painting" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Remodeling" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Deck and Stairs" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Flooring" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ceramic Tile" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Plastering" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "General Carpentry" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Finish Carpentry" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Fence" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Countertop" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Construction Cleaning" } },
            ],
          },
        }}
      />
      <Navbar />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[120] focus:bg-background focus:p-3">Skip to content</a>
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <TrustBar />
        <VideoShowcase />
        <ServicesPreview />
        <PortfolioPreview />
        <PartnersSection />
        <InstagramReels />
        <AboutSnippet />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
