import { expect, test, type Page } from "@playwright/test";

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 2);
}

test.describe("ChurchWork public navigation and internal boundaries", () => {
  test("public landing routes users to the three role logins only", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "The right spiritual-care request, in the right hands." })).toBeVisible();
    await expect(page.getByRole("link", { name: "Requester Login" }).first()).toHaveAttribute("href", "/requester-login");
    await expect(page.getByRole("link", { name: "Facility Login" }).first()).toHaveAttribute("href", "/facility-login");
    await expect(page.getByRole("link", { name: "Partner Login" }).first()).toHaveAttribute("href", "/partner-login");

    await expect(page.locator('a[href="/admin"]')).toHaveCount(0);
    await expect(page.locator('a[href="/mvp"]')).toHaveCount(0);
    await expect(page.locator('a[href="/demo/synthetic"]')).toHaveCount(0);
    await expect(page.locator('a[href="/preview"]')).toHaveCount(0);
    await expect(page.getByText("Guardrails", { exact: true })).toHaveCount(0);
    await expect(page.getByText("No emergency workflow", { exact: true })).toHaveCount(0);
    await expect(page.getByText("No medical records", { exact: true })).toHaveCount(0);
    await expect(page.getByText("No open chat", { exact: true })).toHaveCount(0);
    await expect(page.getByText("Cole", { exact: false })).toHaveCount(0);
    await expect(page.getByText("Sam", { exact: false })).toHaveCount(0);
    await expectNoHorizontalOverflow(page);
  });

  test("role login entrances are real login screens without placeholder records", async ({ page }) => {
    for (const route of ["/requester-login", "/facility-login", "/partner-login"]) {
      await page.goto(route);
      await expect(page).toHaveURL(new RegExp(`${route}$`));
      await expect(page.getByRole("heading", { name: /login/i }).first()).toBeVisible();
      await expect(page.getByLabel("Email")).toBeVisible();
      await expect(page.getByLabel("Password")).toBeVisible();
      await expect(page.getByText("ChurchWork internal access")).toHaveCount(0);
      await expect(page.getByText("Private pilot access")).toHaveCount(0);
      await expect(page.getByText("Jane", { exact: false })).toHaveCount(0);
      await expect(page.getByText("John", { exact: false })).toHaveCount(0);
      await expect(page.getByText("Grandview", { exact: false })).toHaveCount(0);
      await expect(page.getByText("Hope Church", { exact: false })).toHaveCount(0);
      await expectNoHorizontalOverflow(page);
    }
  });

  test("internal backend routes require the internal access gate", async ({ page }) => {
    for (const route of ["/admin", "/mvp", "/synthetic-smoke", "/ai-map"]) {
      await page.goto(route);
      await expect(page).toHaveURL(/\/internal-access/);
      await expect(page.getByRole("heading", { name: "ChurchWork internal access" })).toBeVisible();
      await expect(page.getByLabel("Access key")).toBeVisible();
    }
  });

  test("captures public landing review screenshot", async ({ page }, testInfo) => {
    await page.goto("/");
    await testInfo.attach("churchwork-public-landing.png", {
      body: await page.screenshot({ fullPage: false }),
      contentType: "image/png",
    });
  });
});
