import { test, expect } from "@playwright/test";

const routes: { path: string; title: RegExp }[] = [
  { path: "/", title: /Sofia's Visual Archive/ },
  { path: "/about", title: /About/ },
  { path: "/contact", title: /Contact/ },
  { path: "/impressum", title: /Impressum/ },
  { path: "/datenschutz", title: /Datenschutz/ },
];

for (const route of routes) {
  test(`${route.path} loads with expected title`, async ({ page }) => {
    const response = await page.goto(route.path);
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveTitle(route.title);
  });
}

test("navigation overlay opens and closes", async ({ page }) => {
  await page.goto("/");

  const openMenu = page.getByRole("button", { name: "Open menu" });
  await openMenu.click();

  const nav = page.getByRole("dialog", { name: "Site navigation" });
  await expect(nav).toBeVisible();
  await expect(page.getByRole("link", { name: "About" })).toBeVisible();

  await nav.getByRole("button", { name: "Close menu" }).click();
  await expect(nav).toBeHidden();
});

test("collection is keyboard-accessible and lightbox opens/closes", async ({ page }) => {
  await page.goto("/");

  const firstPhotoButton = page.locator(".gallery-keyboard-list button").first();
  await firstPhotoButton.focus();
  await page.keyboard.press("Enter");

  const lightbox = page.getByRole("dialog", { name: /./ }).last();
  await expect(lightbox).toBeVisible();
  await expect(page.locator(".lightbox-image")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.locator(".lightbox")).toHaveCount(0);
  await expect(firstPhotoButton).toBeFocused();
});

test("light theme is the default and the toggle switches to dark and persists", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("html")).not.toHaveAttribute("data-theme", "dark");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(217, 217, 217)");

  const toggle = page.getByRole("button", { name: /switch to dark mode/i });
  await toggle.evaluate((el: HTMLButtonElement) => el.click());

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(9, 9, 9)");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("contact form requires name, email and message", async ({ page }) => {
  await page.goto("/contact");

  const nameInput = page.locator('input[name="name"]');
  const emailInput = page.locator('input[name="email"]');
  const messageInput = page.locator('textarea[name="message"]');
  const submit = page.getByRole("button", { name: "Send inquiry" });

  await submit.click();
  const isNameValid = await nameInput.evaluate((el: HTMLInputElement) => el.validity.valid);
  expect(isNameValid).toBe(false);

  await nameInput.fill("Test User");
  await emailInput.fill("test@example.com");
  await messageInput.fill("Hello, this is a smoke test message.");

  const honeypot = page.locator('input[name="botcheck"]');
  await expect(honeypot).toHaveCSS("opacity", "0");
  await expect(honeypot).toHaveAttribute("aria-hidden", "true");
});

test("contact form shows a success message on a successful submission", async ({ page }) => {
  await page.route("https://api.web3forms.com/submit", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) })
  );

  await page.goto("/contact");
  await page.locator('input[name="name"]').fill("Test User");
  await page.locator('input[name="email"]').fill("test@example.com");
  await page.locator('textarea[name="message"]').fill("Hello, this is a smoke test message.");
  await page.getByRole("button", { name: "Send inquiry" }).click();

  await expect(page.locator(".form-status")).toHaveText(/thank you/i);
});

test("contact form shows an error message when the request fails", async ({ page }) => {
  await page.route("https://api.web3forms.com/submit", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: false }) })
  );

  await page.goto("/contact");
  await page.locator('input[name="name"]').fill("Test User");
  await page.locator('input[name="email"]').fill("test@example.com");
  await page.locator('textarea[name="message"]').fill("Hello, this is a smoke test message.");
  await page.getByRole("button", { name: "Send inquiry" }).click();

  await expect(page.locator(".form-status")).toHaveText(/something went wrong/i);
});

test("navigation overlay closes on Escape and restores focus", async ({ page }) => {
  await page.goto("/");

  const openMenu = page.getByRole("button", { name: "Open menu" });
  await openMenu.click();
  await expect(page.getByRole("dialog", { name: "Site navigation" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Site navigation" })).toBeHidden();
  await expect(openMenu).toBeFocused();
});

test("navigation overlay traps focus", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();

  const closeButton = page.getByRole("dialog", { name: "Site navigation" }).getByLabel("Close menu");
  await expect(closeButton).toBeFocused();

  // Shift+Tab from the first focusable element wraps to the last.
  await page.keyboard.press("Shift+Tab");
  const lastLink = page.getByRole("link", { name: "Contact" });
  await expect(lastLink).toBeFocused();

  // Tab from the last focusable element wraps back to the first.
  await page.keyboard.press("Tab");
  await expect(closeButton).toBeFocused();
});

test("lightbox traps focus", async ({ page }) => {
  await page.goto("/");
  await page.locator(".gallery-keyboard-list button").first().focus();
  await page.keyboard.press("Enter");

  const closeButton = page.getByRole("button", { name: "Close" });
  await expect(closeButton).toBeFocused();

  await page.keyboard.press("Shift+Tab");
  const nextArrow = page.getByRole("button", { name: "Next artwork" });
  await expect(nextArrow).toBeFocused();

  await page.keyboard.press("Tab");
  await expect(closeButton).toBeFocused();
});

test("theme toggle exposes an accessible action label, not just a state", async ({ page }) => {
  await page.goto("/");

  const toggle = page.getByRole("button", { name: /switch to dark mode/i });
  await expect(toggle).not.toHaveAttribute("aria-pressed");

  await toggle.evaluate((el: HTMLButtonElement) => el.click());
  await expect(page.getByRole("button", { name: /switch to light mode/i })).toBeVisible();
});

test("falls back to a plain grid when WebGL is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    // Simulate no WebGL support the same way FloatingGallery's own
    // checkWebglSupport() probes for it.
    HTMLCanvasElement.prototype.getContext = () => null;
  });

  await page.goto("/");

  await expect(page.locator(".gallery-fallback")).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);

  // The hero title and "Drag to explore" hint only make sense over the
  // draggable 3D sphere; they shouldn't sit on top of the scrollable grid.
  await expect(page.locator(".hero-title")).toHaveCount(0);
  await expect(page.locator(".drag-hint")).toHaveCount(0);

  const firstItem = page.locator(".gallery-fallback-item").first();
  await firstItem.click();
  await expect(page.locator(".lightbox-image")).toBeVisible();
});

test("falls back when WebGL1 exists but WebGL2 is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    // three.js (r163+) requires WebGL2; a device offering only WebGL1
    // must still be treated as unsupported.
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, contextId: string, ...args: unknown[]) {
      if (contextId === "webgl2") return null;
      if (contextId === "webgl" || contextId === "experimental-webgl") return {};
      return (original as (...a: unknown[]) => unknown).apply(this, [contextId, ...args]);
    } as typeof HTMLCanvasElement.prototype.getContext;
  });

  await page.goto("/");

  await expect(page.locator(".gallery-fallback")).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
});

test.describe("no JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the collection is still browsable via the noscript fallback", async ({ page }) => {
    await page.goto("/");

    const items = page.locator(".gallery-fallback-item");
    await expect(items).toHaveCount(16);
    await expect(items.first()).toHaveAttribute("href", /\/artworks\/.+\.webp$/);
  });
});

test.describe("mobile viewport", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("collection and navigation are usable on a phone-sized screen", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".gallery-canvas")).toBeVisible();

    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("dialog", { name: "Site navigation" })).toBeVisible();
    await expect(page.getByRole("link", { name: "About" })).toBeVisible();
  });
});

test("prefers-reduced-motion: hero title is visible immediately instead of animating in", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".hero-title > *").first()).toHaveCSS("opacity", "1");
});
