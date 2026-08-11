import { test, expect } from "@playwright/test";

const routes: { path: string; title: RegExp }[] = [
  { path: "/", title: /Sofia's Photography/ },
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
