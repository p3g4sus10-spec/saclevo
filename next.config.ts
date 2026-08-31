import type { NextConfig } from "next";
import { RUNTIME_GATES } from "./config/gates";

const devEval = process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'";
const calendlyEnabled = RUNTIME_GATES.calendly.enabled;
const isIndexable =
  RUNTIME_GATES.publicDomain.approved &&
  RUNTIME_GATES.publication.productionAuthorized &&
  process.env.VERCEL_ENV === "production";
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${devEval}${calendlyEnabled ? " https://assets.calendly.com" : ""}`,
  `style-src 'self' 'unsafe-inline'${calendlyEnabled ? " https://assets.calendly.com" : ""}`,
  "font-src 'self' data:",
  "img-src 'self' data: blob:",
  "media-src 'self' blob: data:",
  `connect-src 'self'${calendlyEnabled ? " https://calendly.com https://assets.calendly.com" : ""}`,
  calendlyEnabled ? "frame-src https://calendly.com" : "frame-src 'none'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  `form-action 'self'${calendlyEnabled ? " https://calendly.com" : ""}`,
].join("; ");

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), browsing-topics=(), gyroscope=()",
  },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  ...(!isIndexable
    ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
    : []),
];

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_RELEASE_SHA:
      process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GITHUB_SHA ?? "local",
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
