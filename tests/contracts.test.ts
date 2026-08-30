import { afterEach, describe, expect, it, vi } from "vitest";
import { metadata as privacyMetadata } from "@/app/privacidad/page";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { RUNTIME_GATES } from "@/config/gates";
import {
  formatMxn,
  PHANTOM_30,
  PRICING_POLICY,
  PRODUCT_ROUTES,
  SCALE_BASIC,
  SCALE_FULL,
  SCALE_FULL_PREREQUISITES,
} from "@/config/offers";
import { FAQ_ITEMS } from "@/config/faq";
import {
  BOOKING,
  isIndexableEnvironment,
  normalizeSiteUrl,
} from "@/config/site";
import {
  ANALYTICS_IMPLEMENTATION_STATUS,
  buildEntryAttribution,
  captureEntryAttribution,
  claimSessionEvent,
  classifyAttribution,
  createAnalyticsPayload,
  sanitizeEventProperties,
  SECTION_IDS,
  track,
  validateAnalyticsEvent,
} from "@/lib/analytics";
import { getValidatedCalendlyEvent } from "@/lib/calendly";

const SAFE_TAX_DISCLOSURE =
  "El impuesto aplicable y el total se confirmarán antes de contratar.";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("publication and privacy gates", () => {
  it("normalizes only HTTPS origins without paths or credentials", () => {
    expect(normalizeSiteUrl("https://example.com/")).toBe("https://example.com");

    for (const value of [
      "http://example.com",
      "not-a-url",
      "https://example.com/path",
      "https://example.com/?query=1",
      "https://user:secret@example.com",
    ]) {
      expect(() => normalizeSiteUrl(value)).toThrow();
    }
  });

  it("keeps publication fail-closed even in a production-shaped environment", () => {
    const previous = process.env.VERCEL_ENV;
    process.env.VERCEL_ENV = "production";

    try {
      expect(RUNTIME_GATES.publication).toMatchObject({
        state: "preview_only",
        productionAuthorized: false,
      });
      expect(isIndexableEnvironment()).toBe(false);
      expect(robots()).toEqual({
        rules: { userAgent: "*", allow: undefined, disallow: "/" },
        sitemap: undefined,
      });
    } finally {
      if (previous === undefined) delete process.env.VERCEL_ENV;
      else process.env.VERCEL_ENV = previous;
    }
  });

  it("keeps the unapproved privacy route noindex and outside the sitemap", () => {
    expect(RUNTIME_GATES.privacyNotice).toMatchObject({
      state: "draft_not_approved",
      approved: false,
    });
    expect(privacyMetadata.robots).toMatchObject({
      index: false,
      follow: false,
    });

    const sitemapPaths = sitemap().map((entry) => new URL(entry.url).pathname);
    expect(sitemapPaths).not.toContain("/privacidad");
  });
});

describe("canonical offer and tax-safe copy", () => {
  it("keeps the unresolved tax treatment centralized on the safe branch", () => {
    expect(PRICING_POLICY).toEqual({
      currency: "MXN",
      domesticIvaTreatment: "open",
      internationalIvaTreatment: "per_case_only",
      publicMode: "base_before_iva",
      safeDisclosure: SAFE_TAX_DISCLOSURE,
      publicTaxRate: null,
    });
  });

  it("defines SCALE BASIC as five business days, advisory and no production", () => {
    expect(SCALE_BASIC).toMatchObject({
      durationBusinessDays: 5,
      priceBase: 7_500,
      includesProduction: false,
      disclosure: SAFE_TAX_DISCLOSURE,
    });
    expect(SCALE_BASIC.description).toContain("5 días hábiles");
    expect(SCALE_BASIC.terms).toContain("5 días hábiles");
    expect(SCALE_BASIC.terms).toContain(`${formatMxn(7_500)} antes de IVA`);
    expect(SCALE_BASIC.terms).toContain("advisory, sin producción");
  });

  it("keeps PHANTOM 30 economics and finished-video scope unambiguous", () => {
    expect(PHANTOM_30.price).toMatchObject({
      base: 9_000,
      firstInstallment: 4_500,
      baseBalance: 4_500,
      currency: "MXN",
      disclosure: SAFE_TAX_DISCLOSURE,
    });
    expect(PHANTOM_30.consolidatedRevisionRounds).toBe(1);
    expect(PHANTOM_30.description).toContain("cuatro videos terminados");
    expect(PHANTOM_30.deliverables.flatMap((group) => group.items)).toEqual(
      expect.arrayContaining([
        "Concepto, guion y preproducción",
        "Grabación ligera acordada y dirección creativa",
        "Edición y entrega final",
      ]),
    );
    expect(PHANTOM_30.price.terms).toContain(
      `${formatMxn(9_000)} antes de IVA`,
    );
    expect(PHANTOM_30.price.terms).toContain(
      `${formatMxn(4_500)} antes de IVA incluida dentro de esos $9,000`,
    );
    expect(PHANTOM_30.price.note).toContain("forma parte de ese precio");
    expect(PHANTOM_30.price.note).toContain("no se suma");
    expect(PHANTOM_30.durationCondition).toContain(
      "condiciones de activación definidas por escrito",
    );
    expect(PHANTOM_30.scopeNote).toContain("Raw");
    expect(PHANTOM_30.scopeNote).toContain("project files");
    expect(PHANTOM_30.scopeNote).toContain("no están incluidos");
    expect(PHANTOM_30.claimsDisclosure).toContain("No se garantizan ventas");
  });

  it("defines SCALE FULL with proposed cycle, monthly base and onboarding", () => {
    expect(SCALE_FULL).toMatchObject({
      monthlyFrom: 72_000,
      onboarding: 15_000,
      proposedInitialCycleDays: 90,
      disclosure: SAFE_TAX_DISCLOSURE,
    });
    expect(SCALE_FULL.terms).toContain("Ciclo inicial propuesto de 90 días");
    expect(SCALE_FULL.terms).toContain(
      `desde ${formatMxn(72_000)}/mes + ${formatMxn(15_000)} de onboarding`,
    );
    expect(SCALE_FULL.terms).toContain("ambos antes de IVA");
    expect(SCALE_FULL.cycleReason).toContain(
      "ciclo inicial propuesto de 90 días",
    );
    expect(SCALE_FULL.scopeDisclosure).toContain(
      "sujeto a validación comercial",
    );
    expect(SCALE_FULL.terms).not.toMatch(/90\s+días\s+mínimo/i);
    expect(SCALE_FULL_PREREQUISITES).toContain(
      "una persona responsable dentro del negocio",
    );
  });

  it("keeps the ladder and FAQ aligned with the canonical values", () => {
    expect(PRODUCT_ROUTES.map((route) => route.id)).toEqual([
      "scale-basic",
      "phantom-30",
      "scale-full",
    ]);

    const faqById = Object.fromEntries(
      FAQ_ITEMS.map((item) => [item.id, item.a]),
    );
    expect(faqById["que-incluye"]).toContain("cuatro videos terminados");
    expect(faqById["precio-phantom-30"]).toContain(
      `${formatMxn(9_000)} antes de IVA`,
    );
    expect(faqById["precio-phantom-30"]).toContain(
      `${formatMxn(4_500)} antes de IVA`,
    );
    expect(faqById["precio-phantom-30"]).toContain("no se suma");
    expect(faqById["precio-phantom-30"]).toContain(SAFE_TAX_DISCLOSURE);
    expect(faqById["scale-basic"]).toContain("cinco días hábiles");
    expect(faqById["scale-basic"]).toContain("no incluye producción");
    expect(faqById["scale-full"]).toContain(formatMxn(72_000));
    expect(faqById["scale-full"]).toContain(formatMxn(15_000));
    expect(faqById["scale-full"]).toContain("onboarding");
    expect(faqById["scale-full"]).toContain("ciclo inicial propuesto de 90 días");
    expect(faqById["clientes-internacionales"]).toContain(
      "no garantiza IVA a tasa 0%",
    );
    expect(faqById["garantia-de-resultados"]).toMatch(/^No\./);
  });
});

describe("Calendly and analytics privacy boundaries", () => {
  it("keeps the official 30-minute booking reference disabled", () => {
    expect(BOOKING).toMatchObject({
      url: "https://calendly.com/scalevo-mx/30min",
      durationMinutes: 30,
      enabled: false,
      state: "disabled_pending_privacy",
    });
  });

  it("is a runtime NO-OP even if a provider-like global is present", () => {
    const provider = vi.fn();
    const setItem = vi.fn();
    vi.stubGlobal("window", {
      __scalevo_analytics: provider,
      location: {
        href: "https://site.example/?utm_source=test",
        pathname: "/",
        hostname: "site.example",
      },
    });
    vi.stubGlobal("document", { referrer: "https://referrer.example/path" });
    vi.stubGlobal("sessionStorage", {
      getItem: vi.fn(() => null),
      setItem,
    });

    expect(ANALYTICS_IMPLEMENTATION_STATUS).toContain("NO-OP");
    expect(RUNTIME_GATES.analytics.enabled).toBe(false);
    captureEntryAttribution();
    track("page_view");
    expect(setItem).not.toHaveBeenCalled();
    expect(provider).not.toHaveBeenCalled();
    expect(claimSessionEvent("page_view")).toBe(false);
  });

  it("builds attribution only from allowlisted inputs", () => {
    const result = buildEntryAttribution(
      "https://site.example/?utm_source=instagram&utm_medium=dm&asset_id=reel-07&product_route=phantom-30&email=private@example.com",
      "https://partner.example/path?secret=1",
    );
    expect(result).toMatchObject({
      utm_source: "instagram",
      utm_medium: "dm",
      source: "instagram",
      referrer_domain: "partner.example",
      attribution: "assisted_outbound",
    });
    expect(result).not.toHaveProperty("asset_id");
    expect(result).not.toHaveProperty("route_interest");
    expect(result).not.toHaveProperty("email");
    expect(JSON.stringify(result)).not.toContain("secret=1");
  });

  it.each([
    [{ utm_medium: "organic" }, "pure_organic"],
    [{ utm_medium: "outbound" }, "outbound"],
    [{ utm_medium: "email" }, "assisted_outbound"],
    [{ referrer_domain: "example.com" }, "referral"],
    [{}, "unknown"],
  ] as const)("classifies attribution", (input, expected) => {
    expect(classifyAttribution(input)).toBe(expected);
  });

  it("drops PII, provider payloads and arbitrary event keys", () => {
    const sanitized = sanitizeEventProperties({
      placement: "hero",
      cta_id: "hero_primary",
      email: "private@example.com",
      nombre: "Persona",
      payload: "booking details",
      arbitrary: "not allowed",
    });
    expect(sanitized).toEqual({
      placement: "hero",
      cta_id: "hero_primary",
    });
    expect(
      createAnalyticsPayload(
        { section_id: "product_ladder" },
        { source: "direct", hostname: "site.example" },
      ),
    ).toEqual({
      source: "direct",
      hostname: "site.example",
      section_id: "product_ladder",
    });
  });

  it("validates event requirements, IDs and enums", () => {
    expect(
      validateAnalyticsEvent("cta_click", {
        cta_id: "hero_primary",
        placement: "hero_primary",
        destination_type: "calendly",
      }),
    ).toEqual({ valid: true, errors: [] });

    expect(
      validateAnalyticsEvent("cta_click", {
        cta_id: "hero-primary",
        placement: "hero_primary",
        destination_type: "invalid",
      }),
    ).toEqual({
      valid: false,
      errors: ["invalid:destination_type", "invalid:cta_id"],
    });
    expect(validateAnalyticsEvent("booking_complete", {})).toEqual({
      valid: false,
      errors: ["missing:placement", "missing:source"],
    });
  });

  it("keeps the section ID contract and pure deduplication utility", () => {
    expect(SECTION_IDS).toEqual([
      "perception_gap",
      "phantom_system",
      "product_ladder",
      "phantom_30",
      "principles",
      "method",
      "qualification",
      "faq",
      "diagnostic",
    ]);
    expect(
      validateAnalyticsEvent("section_view", { section_id: "diagnostic" }),
    ).toEqual({ valid: true, errors: [] });
    expect(
      validateAnalyticsEvent("section_view", { section_id: "not_valid" }),
    ).toEqual({ valid: false, errors: ["invalid:section_id"] });

    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    };
    expect(claimSessionEvent("section_view:faq", storage)).toBe(true);
    expect(claimSessionEvent("section_view:faq", storage)).toBe(false);
    expect(claimSessionEvent("section_view:diagnostic", storage)).toBe(true);
  });

  it("accepts only an allowlisted Calendly message from the expected iframe", () => {
    const expectedSource = {} as MessageEventSource;
    const validMessage = {
      origin: "https://calendly.com",
      source: expectedSource,
      data: {
        event: "calendly.event_scheduled",
        payload: { invitee: "intentionally ignored" },
      },
    };

    expect(getValidatedCalendlyEvent(validMessage, expectedSource)).toBe(
      "calendly.event_scheduled",
    );
    expect(
      getValidatedCalendlyEvent(
        { ...validMessage, origin: "https://evil.example" },
        expectedSource,
      ),
    ).toBeNull();
    expect(
      getValidatedCalendlyEvent(validMessage, {} as MessageEventSource),
    ).toBeNull();
    expect(
      getValidatedCalendlyEvent(
        { ...validMessage, data: { event: "unknown", payload: {} } },
        expectedSource,
      ),
    ).toBeNull();
    expect(
      getValidatedCalendlyEvent(
        {
          ...validMessage,
          data: { event: "calendly.event_scheduled", payload: "PII" },
        },
        expectedSource,
      ),
    ).toBeNull();
  });
});
