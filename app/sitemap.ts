import { MetadataRoute } from "next";
import { RUNTIME_GATES } from "@/config/gates";
import { absoluteUrl, isIndexableEnvironment } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexableEnvironment()) {
    return [];
  }

  const routes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  if (RUNTIME_GATES.privacyNotice.approved) {
    routes.push({
      url: absoluteUrl("/privacidad"),
      changeFrequency: "yearly",
      priority: 0.2,
    });
  }

  return routes;
}
