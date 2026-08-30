import { expect, test } from "@playwright/test";

test("serves a noindex preview with restrictive security headers", async ({
  page,
}) => {
  const response = await page.goto("/");

  expect(response?.status()).toBe(200);
  const csp = response?.headers()["content-security-policy"] ?? "";
  expect(csp).toContain("object-src 'none'");
  expect(csp).not.toContain("calendly.com");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(
    await page.locator('script[type="application/ld+json"]').textContent(),
  ).toContain('"@type":"ItemList"');
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
  const bookingLinks = page.locator('[data-booking-enabled="false"]');
  expect(await bookingLinks.count()).toBeGreaterThan(0);
  for (const href of await bookingLinks.evaluateAll((links) =>
    links.map((link) => link.getAttribute("href")),
  )) {
    expect(href).toBe("#diagnostic");
  }

  await page.locator("#floating-cta").click();
  await expect(page).toHaveURL(/#diagnostic$/);
  await expect(page.locator("#diagnostic")).toBeInViewport();
  await page.waitForTimeout(250);
  expect(calendlyRequests).toEqual([]);
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
});

test("fails closed for privacy and renders the custom 404", async ({ page }) => {
  const privacyResponse = await page.goto("/privacidad");
  expect(privacyResponse?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "404" })).toBeVisible();

  const missingResponse = await page.goto("/ruta-inexistente-e2e");
  expect(missingResponse?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "404" })).toBeVisible();
});
