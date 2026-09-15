import SEO from "@/components/SEO";
import LandingTemplate from "@/components/lp/LandingTemplate";

const LPRemodeling = () => (
  <>
    <SEO
      title="Home Remodeling in New England"
      description="Flooring, tile, carpentry and more. One team for every job in New England. Licensed and insured. Free estimate."
      canonical="/lp/remodeling"
      keywords="remodeling New England, home remodeling New England, flooring tile carpentry MA"
    />
    <LandingTemplate
    tag="REMODELING"
    headline="Flooring, tile, carpentry and more. One team for every job."
    subline="You should not need to coordinate multiple contractors for your project. We handle it all."
    service="Remodeling"
    heroReview={{
      name: "Alicat91141",
      text: "He not only painted the interior but also finished the hardwood floors throughout the house. The estimate of time was spot on.",
    }}
    reviews={[
      {
        name: "Alicat91141",
        text: "He not only painted the interior but also finished the hardwood floors throughout the house. The estimate of time was spot on.",
      },
      {
        name: "Meghan Rayner",
        text: "Amazing quality work. They were so flexible and easy to work with. Will definitely use Tony's again.",
      },
      {
        name: "Roberta Staula",
        text: "Very professional and efficient.",
      },
    ]}
    included={[
      { title: "Hardwood and vinyl flooring", description: "" },
      { title: "Ceramic and porcelain tile", description: "" },
      { title: "Plastering and drywall", description: "" },
      { title: "General carpentry", description: "" },
      { title: "Countertop installation", description: "" },
      { title: "Finish work and moldings", description: "" },
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
      "/images/remodeling-02.jpg",
      "/images/flooring-01.jpg",
      "/images/project-04.jpg",
      "/images/project-16.jpg",
      "/images/project-15.jpg",
      "/images/project-08.jpg"
    ]}
  />
  </>
);

export default LPRemodeling;