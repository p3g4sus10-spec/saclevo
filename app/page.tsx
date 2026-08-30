import type { Metadata } from "next";
import HomeExperience from "@/components/HomeExperience";
import { absoluteUrl, OG_IMAGE, SITE } from "@/config/site";
import { RUNTIME_GATES } from "@/config/gates";

export const metadata: Metadata = {
  title: { absolute: SITE.title },
  description: SITE.description,
  alternates: RUNTIME_GATES.publicDomain.approved
    ? { canonical: absoluteUrl("/") }
    : undefined,
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: RUNTIME_GATES.publicDomain.approved ? absoluteUrl("/") : undefined,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    images: RUNTIME_GATES.publicDomain.approved
      ? [
          {
            url: OG_IMAGE.url,
            width: OG_IMAGE.width,
            height: OG_IMAGE.height,
            alt: OG_IMAGE.alt,
          },
        ]
      : undefined,
  },
  twitter: {
    card: RUNTIME_GATES.publicDomain.approved
      ? "summary_large_image"
      : "summary",
    title: SITE.title,
    description: SITE.description,
    images: RUNTIME_GATES.publicDomain.approved ? [OG_IMAGE.url] : undefined,
  },
};

export default function HomePage() {
  return <HomeExperience />;
}
