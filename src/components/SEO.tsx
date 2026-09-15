import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string;
  schema?: object;
  noindex?: boolean;
}

const BASE_URL = "https://tonyspaintingmv.com";
const COMPANY_NAME = "Tony's Painting and Remodeling";
const DEFAULT_OG_IMAGE = BASE_URL + "/og-image.jpg";

export default function SEO({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  keywords,
  schema,
  noindex = false,
}: SEOProps) {
  const { pathname } = useLocation();
  const fullTitle = title.includes("Tony's")
    ? title
    : title + " | Tony's Painting and Remodeling";

  const canonicalUrl = new URL(canonical || pathname, BASE_URL).href;
  const imageUrl = new URL(ogImage, BASE_URL).href;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? "noindex, follow" : "index, follow, max-image-preview:large"} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={COMPANY_NAME} />
      <meta property="og:site_name" content={COMPANY_NAME} />
      <meta property="og:locale" content="en_US" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={COMPANY_NAME} />
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema).replace(/</g, "\\u003c")}</script>
      )}
    </Helmet>
  );
}
