import SEO from "@/components/SEO";
import LandingTemplate from "@/components/lp/LandingTemplate";

const LPInteriorPainting = () => (
  <>
    <SEO
      title="Interior Painting in New England"
      description="Professional interior painters serving New England since 2004. Licensed, insured, 5-star rated. Get your free estimate today."
      canonical="/lp/interior-painting"
      keywords="interior painting New England, interior painters New England, interior house painting MA"
    />
    <LandingTemplate
    tag="INTERIOR PAINTING"
    headline="Professional interior painting in New England."
    subline="Clean work, on schedule, with attention to every detail. Residential and commercial."
    service="Interior Painting"
    heroReview={{
      name: "Shane Sanders",
      text: "Tony and his team just finished painting the entire inside of our house. Very professional and detail oriented. The quality of work was top notch.",
    }}
    reviews={[
      {
        name: "Shane Sanders",
        text: "Tony and his team just finished painting the entire inside of our house. Very professional and detail oriented. The quality of work was top notch.",
      },
      {
        name: "OB Resident",
        text: "Tony and his team just finished painting our home. We could not be happier with the results. His team clearly wanted to exceed expectations and they did.",
      },
      {
        name: "Cathy Sclafani",
        text: "Tony and his crew were fabulous. So professional and did an excellent job.",
      },
    ]}
    included={[
      { title: "Living rooms and bedrooms", description: "" },
      { title: "Kitchens and bathrooms", description: "" },
      { title: "Ceilings and trim", description: "" },
      { title: "Accent walls", description: "" },
      { title: "Commercial offices", description: "" },
      { title: "New construction interiors", description: "" },
      { title: "Color consultation", description: "" },
      { title: "Surface prep and priming", description: "" },
    ]}
    portfolioLocations={[
      "New England",
      "New England",
      "New England",
      "New England",
      "New England",
      "New England",
    ]}
    portfolioImages={[
      "/images/interior-04.jpg",
      "/images/interior-03.jpg",
      "/images/interior-05.jpg",
      "/images/interior-01.jpg",
      "/images/interior-02.jpg",
      "/images/project-05.jpg"
    ]}
  />
  </>
);

export default LPInteriorPainting;