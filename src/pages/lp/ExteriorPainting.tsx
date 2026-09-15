import SEO from "@/components/SEO";
import LandingTemplate from "@/components/lp/LandingTemplate";

const LPExteriorPainting = () => (
  <>
    <SEO
      title="Exterior Painting in New England"
      description="Exterior painting built for New England weather. Serving New England since 2004. Benjamin Moore certified. Free estimate."
      canonical="/lp/exterior-painting"
      keywords="exterior painting New England, exterior painters New England, exterior house painting MA"
    />
    <LandingTemplate
    tag="EXTERIOR PAINTING"
    headline="Exterior painting built to handle New England weather."
    subline="We prep every surface properly and use premium paints that hold up season after season."
    service="Exterior Painting"
    heroReview={{
      name: "Mark Duffy",
      text: "Tony's Painting is the real deal. They flawlessly transformed my 1920s home with Benjamin Moore paint. Punctuality and work ethic were impressive.",
    }}
    reviews={[
      {
        name: "Mark Duffy",
        text: "Tony's Painting is the real deal. They flawlessly transformed my 1920s home with Benjamin Moore paint. Punctuality and work ethic were impressive.",
      },
      {
        name: "Curtis Highsmith",
        text: "Clean, reliable, and professional. If you are looking for a master painter, call Tony's Painting.",
      },
      {
        name: "Edwina Hawes",
        text: "Excellent painting for any circumstance. Tony's team of professionals gets it done right.",
      },
    ]}
    included={[
      { title: "Full exterior walls and siding", description: "" },
      { title: "Porches and decks", description: "" },
      { title: "Fences and gates", description: "" },
      { title: "Trim and shutters", description: "" },
      { title: "Commercial buildings", description: "" },
      { title: "Power washing and surface prep", description: "" },
      { title: "Benjamin Moore premium paints", description: "" },
      { title: "Multi-season durability guarantee", description: "" },
    ]}
    portfolioLocations={[
      "New England",
      "New England",
      "New England",
      "New England",
      "New England",
      "New England",
    ]}
    heroImage="/images/project-02.jpg"
    portfolioImages={[
      "/images/project-12.jpg",
      "/images/project-14.jpg",
      "/images/project-13.jpg",
      "/images/project-03.jpg",
      "/images/project-11.jpg",
      "/images/project-01.jpg"
    ]}
  />
  </>
);

export default LPExteriorPainting;