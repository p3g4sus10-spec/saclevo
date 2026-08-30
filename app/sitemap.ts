import { MetadataRoute } from "next";
import { RUNTIME_GATES } from "@/config/gates";
import { absoluteUrl } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!RUNTIME_GATES.publicDomain.approved) {
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
