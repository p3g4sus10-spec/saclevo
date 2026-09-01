import { expect, test } from "@playwright/test";

test("serves a noindex preview with restrictive security headers", async ({
  page,
  request,
}) => {
  const response = await page.goto("/");
  const serverResponse = await request.get("/");
  const serverHeaders = serverResponse.headers();

  expect(response?.status()).toBe(200);
  expect(serverResponse.status()).toBe(200);
  const csp = serverHeaders["content-security-policy"] ?? "";
  expect(csp).toContain("object-src 'none'");
  expect(csp).toContain("frame-src 'none'");
  expect(csp).not.toContain("calendly.com");
  expect(serverHeaders["x-robots-tag"]).toBe("noindex, nofollow");
  expect(serverHeaders["x-frame-options"]).toBe("DENY");
  expect(serverHeaders["x-content-type-options"]).toBe("nosniff");
  expect(serverHeaders["referrer-policy"]).toBe(
    "strict-origin-when-cross-origin",
  );
  expect(serverHeaders["permissions-policy"]).toContain("gyroscope=()");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex, nofollow/,
  );
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(
    await page.locator('script[type="application/ld+json"]').textContent(),
  ).toContain('"@type":"ItemList"');
});

test("keeps robots, sitemap and privacy fail-closed", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Disallow: /");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).not.toContain("<url>");

  const privacy = await request.get("/privacidad");
  expect(privacy.status()).toBe(404);
});

test("keeps booking internal and makes no Calendly request while gated", async ({
  page,
}) => {
  const calendlyRequests: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).hostname.endsWith("calendly.com")) {
      calendlyRequests.push(request.url());
    }
  });

  await page.goto("/");
  await expect(page.locator("#floating-cta")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  const bookingLinks = page.locator('[data-booking-enabled="false"]');
  expect(await bookingLinks.count()).toBeGreaterThan(0);
  for (const href of await bookingLinks.evaluateAll((links) =>
    links.map((link) => link.getAttribute("href")),
  )) {
    expect(href).toBe("#diagnostic");
  }

  await page.locator("#phantom-system").scrollIntoViewIfNeeded();
  await expect(page.locator("#floating-cta")).toHaveAttribute(
    "aria-hidden",
    "false",
  );
  await page.locator("#floating-cta").click();
  await expect(page).toHaveURL(/#diagnostic$/);
  await expect(page.locator("#diagnostic")).toBeInViewport();
  await page.waitForTimeout(250);
  expect(calendlyRequests).toEqual([]);
  expect(
    await page.locator('script[src*="analytics"], script[src*="gtag"]').count(),
  ).toBe(0);
});

test("supports mobile navigation without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const menuButton = page.locator("#mobile-menu-toggle");
  await expect(menuButton).toHaveAccessibleName("Abrir menú");
  await menuButton.click();
  await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  await expect(menuButton).toHaveAccessibleName("Cerrar menú");
  await expect(page.getByRole("dialog", { name: "Menú de navegación móvil" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  await expect(menuButton).toBeFocused();

  await menuButton.click();
  await expect(menuButton).toHaveAttribute("aria-expanded", "true");

  await page.getByRole("dialog").getByRole("link", { name: "Rutas" }).click();
  await expect(page).toHaveURL(/#product-ladder$/);
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");

  const layout = await page.evaluate(() => ({
    overflow:
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
    offenders: [...document.querySelectorAll<HTMLElement>("body *")]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          element: `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ""}${element.className && typeof element.className === "string" ? `.${element.className.trim().replace(/\s+/g, ".")}` : ""}`,
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        };
      })
      .filter(({ left, right, width }) => width > 0 && (left < -1 || right > innerWidth + 1))
      .slice(0, 20),
  }));
  expect(layout.overflow, JSON.stringify(layout.offenders)).toBeLessThanOrEqual(1);
});

test("keeps the mobile hero concise and readable at 320px, 390px and 430px", async ({
  page,
}) => {
  for (const viewport of [
    { width: 320, height: 800 },
    { width: 390, height: 844 },
    { width: 430, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      /TU NEGOCIO YA PUEDE SER MEJOR\.\s*ONLINE TODAVÍA NO LO PARECE\./,
    );

    const heroLayout = await page.evaluate(() => {
      const hero = document.querySelector<HTMLElement>(".hero-section");
      const headline = document.querySelector<HTMLElement>(".hero-h1");
      const cta = document.querySelector<HTMLElement>("#hero-cta-primary");
      const lines = [
        ...document.querySelectorAll<HTMLElement>(".hero-h1 .line-inner"),
      ]
        .map((line) => {
          const range = document.createRange();
          range.selectNodeContents(line);
          return range.getClientRects().length;
        })
        .reduce((total, count) => total + count, 0);

      return {
        heroHeight: hero?.getBoundingClientRect().height ?? 0,
        headlineLines: lines,
        headlineFontSize: Number.parseFloat(
          headline ? getComputedStyle(headline).fontSize : "0",
        ),
        ctaHeight: cta?.getBoundingClientRect().height ?? 0,
        overflow:
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      };
    });

    const context = `${viewport.width}px hero layout`;
    expect(heroLayout.heroHeight, context).toBeLessThanOrEqual(781);
    expect(heroLayout.headlineLines, context).toBeLessThanOrEqual(4);
    expect(heroLayout.headlineFontSize, context).toBeLessThanOrEqual(40);
    expect(heroLayout.ctaHeight, context).toBeGreaterThanOrEqual(44);
    expect(heroLayout.ctaHeight, context).toBeLessThanOrEqual(60);
    expect(heroLayout.overflow, context).toBeLessThanOrEqual(1);
  }
});

test("adapts density across tablet, laptop and cinematic desktop", async ({
  page,
}) => {
  test.setTimeout(120_000);

  for (const viewport of [
    { width: 768, height: 1024 },
    { width: 1280, height: 550 },
    { width: 1280, height: 650 },
    { width: 1280, height: 720 },
    { width: 1366, height: 768 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const layout = await page.evaluate(() => {
      const rect = (selector: string) =>
        document.querySelector<HTMLElement>(selector)?.getBoundingClientRect();
      const headlineLines = [
        ...document.querySelectorAll<HTMLElement>(".hero-h1 .line-inner"),
      ].reduce((total, line) => {
        const range = document.createRange();
        range.selectNodeContents(line);
        return total + range.getClientRects().length;
      }, 0);

      return {
        overflow:
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
        headlineLines,
        hero: rect(".hero-section"),
        content: rect(".hero-content"),
        navbar: rect(".navbar"),
        cta: rect("#hero-cta-primary"),
        perceptionPadding: Number.parseFloat(
          getComputedStyle(
            document.querySelector<HTMLElement>(".perception-section")!,
          ).paddingTop,
        ),
      };
    });

    const context = `${viewport.width}x${viewport.height}`;
    expect(layout.overflow, context).toBeLessThanOrEqual(1);
    expect(layout.hero?.height, context).toBeGreaterThanOrEqual(viewport.height);

    if (viewport.width >= 1280) {
      expect(layout.headlineLines, context).toBeLessThanOrEqual(2);
    }

    if (viewport.width >= 769 && viewport.height <= 780) {
      expect(layout.content!.top, context).toBeGreaterThan(
        layout.navbar!.bottom + 8,
      );
      expect(layout.cta!.bottom, context).toBeLessThan(viewport.height - 32);
      expect(layout.perceptionPadding, context).toBeLessThanOrEqual(73);
    }
  }
});

test("restores the three-phrase lateral narrative without clipping or pinning", async ({
  page,
}) => {
  test.setTimeout(180_000);

  for (const viewport of [
    { width: 320, height: 800 },
    { width: 390, height: 844 },
    { width: 430, height: 900 },
    { width: 768, height: 1024 },
    { width: 1280, height: 650 },
    { width: 1280, height: 720 },
    { width: 1366, height: 768 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const kinetic = page.locator(".kinetic-section");
    await kinetic.scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);

    const layout = await page.evaluate(() => ({
      overflow:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
      pinSpacers: document.querySelectorAll(".pin-spacer").length,
      words: [
        ...document.querySelectorAll<HTMLElement>(".kinetic-word"),
      ].map((word) => {
        const rect = word.getBoundingClientRect();
        const style = getComputedStyle(word);
        return {
          text: word.textContent?.trim(),
          left: rect.left,
          right: rect.right,
          opacity: Number.parseFloat(style.opacity),
        };
      }),
    }));

    const context = `${viewport.width}x${viewport.height}`;
    expect(layout.pinSpacers, context).toBe(0);
    expect(layout.overflow, context).toBeLessThanOrEqual(1);
    expect(layout.words.map(({ text }) => text), context).toEqual([
      "NO HACEMOS CONTENIDO POR HACERLO.",
      "CADA PIEZA TIENE UN PROPÓSITO.",
      "NO ES SUERTE. ES SISTEMA.",
    ]);
    for (const word of layout.words) {
      expect(word.opacity, `${context}: ${word.text}`).toBeGreaterThanOrEqual(
        0.99,
      );
      expect(word.left, `${context}: ${word.text}`).toBeGreaterThanOrEqual(-1);
      expect(word.right, `${context}: ${word.text}`).toBeLessThanOrEqual(
        viewport.width + 1,
      );
    }
  }
});

test("settles selected micro-motion into a readable final state", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");

  await page.locator("#perception-gap").scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await expect(page.locator(".pg-col")).toHaveCount(2);

  await page.locator("#phantom-system").scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  expect(
    await page.locator(".phantom-stage-id").evaluateAll((ids) =>
      ids.every((id) => Number.parseFloat(getComputedStyle(id).opacity) >= 0.99),
    ),
  ).toBe(true);

  await page.locator(".product-ladder-list").scrollIntoViewIfNeeded();
  await page.waitForTimeout(750);
  expect(
    await page.locator(".product-ladder-list").evaluate((list) =>
      Number.parseFloat(
        getComputedStyle(list).getPropertyValue("--ladder-progress"),
      ),
    ),
  ).toBeGreaterThanOrEqual(0.99);

  await page.locator(".p30-founding-card").scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  expect(
    await page.locator(".p30-founding-status").evaluate((status) =>
      Number.parseFloat(getComputedStyle(status).opacity),
    ),
  ).toBeGreaterThanOrEqual(0.99);

  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
});

test("shows the canonical four-slot Founding state without fake urgency", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText("4 CUPOS FOUNDING DISPONIBLES", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("FASE FOUNDING · SOLO 4 CUPOS DISPONIBLES", {
      exact: true,
    }),
  ).toBeAttached();
  await expect(
    page.getByRole("heading", {
      name: "Founding cambia la tarifa, no el alcance.",
    }),
  ).toBeAttached();
  await expect(page.locator("body")).not.toContainText(/countdown|solo hoy/i);
});

test("opens FAQ controls with native keyboard activation", async ({ page }) => {
  await page.goto("/");
  const question = page.getByRole("button", { name: "¿Qué es PHANTOM 30?" });
  await question.scrollIntoViewIfNeeded();
  await question.focus();
  await page.keyboard.press("Enter");
  await expect(question).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Space");
  await expect(question).toHaveAttribute("aria-expanded", "false");
});

test("keeps essential hero guidance visible with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.locator(".hero-content")).toBeVisible();
  await expect(page.locator(".hero-scroll-indicator")).toBeVisible();
  await expect(page.locator("#hero-canvas")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  expect(
    await page.locator("#hero-canvas").evaluate((canvas) => ({
      width: (canvas as HTMLCanvasElement).width,
      height: (canvas as HTMLCanvasElement).height,
    })),
  ).toEqual({ width: 300, height: 150 });

  const reducedStates = await page.evaluate(() => {
    const selectors = [
      ".kinetic-word",
      ".section-label",
      ".phantom-stage",
      ".product-route",
      ".p30-founding-card",
    ];
    return {
      elements: selectors.flatMap((selector) =>
        [...document.querySelectorAll<HTMLElement>(selector)].map((element) => {
          const style = getComputedStyle(element);
          return {
            selector,
            opacity: Number.parseFloat(style.opacity),
            transform: style.transform,
          };
        }),
      ),
      ladderProgress: Number.parseFloat(
        getComputedStyle(
          document.querySelector<HTMLElement>(".product-ladder-list")!,
        ).getPropertyValue("--ladder-progress"),
      ),
    };
  });

  expect(reducedStates.ladderProgress).toBe(1);
  for (const state of reducedStates.elements) {
    expect(state.opacity, state.selector).toBeGreaterThanOrEqual(0.99);
    expect(state.transform, state.selector).toBe("none");
  }
});

test("fails closed for privacy and renders the custom 404", async ({ page }) => {
  const privacyResponse = await page.goto("/privacidad");
  expect(privacyResponse?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "404" })).toBeVisible();

  const missingResponse = await page.goto("/ruta-inexistente-e2e");
  expect(missingResponse?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "404" })).toBeVisible();
});
