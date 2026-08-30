import { MetadataRoute } from "next";
import { absoluteUrl, isIndexableEnvironment } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const isProduction = isIndexableEnvironment();
  return {
    rules: {
      userAgent: "*",
      allow: isProduction ? "/" : undefined,
      disallow: isProduction ? undefined : "/",
    },
    sitemap: isProduction ? absoluteUrl("/sitemap.xml") : undefined,
  };
}
