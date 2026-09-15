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
        title="Painting and Remodeling You Can Trust | New England"
        description="Tony's Painting and Remodeling has served New England since 2004. Interior, exterior, remodeling and more. Free estimates."
        canonical="/"
        keywords="painting company New England, house painters New England, interior exterior painting New England, painting remodeling contractor New England, Tony's Painting"
        schema={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Tony's Painting and Remodeling",
          description:
            "Professional painting and remodeling services serving New England since 2004.",
          url: "https://tonyspaintingcmv.com",
          telephone: "+15089829675",
          email: "Tonyspainting11@gmail.com",
          foundingDate: "2004",
          founder: { "@type": "Person", name: "Otoniel Santos" },
          address: {
            "@type": "PostalAddress",
            addressLocality: "New England",
            addressRegion: "MA",
            addressCountry: "US",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 41.3805,
            longitude: -70.6453,
          },
          areaServed: [
            { "@type": "Place", name: "New England" },
            { "@type": "Place", name: "Massachusetts" },
            { "@type": "Place", name: "Connecticut" },
            { "@type": "Place", name: "Rhode Island" },
            { "@type": "Place", name: "New Hampshire" },
          ],
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
            opens: "07:00",
            closes: "18:00",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "5",
            reviewCount: "9",
            bestRating: "5",
          },
          priceRange: "$$",
          image: "https://tonyspaintingcmv.com/og-image.jpg",
          sameAs: [
            "https://www.instagram.com/tonyspainting_remodeling/",
            "https://www.facebook.com/tonyspaintingmvLLC/",
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
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Fence" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Countertop" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Construction Cleaning" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Handyman Services" } },
            ],
          },
        }}
      />
      <Navbar />
      <main>
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
