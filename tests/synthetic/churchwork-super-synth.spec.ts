import { expect, test, type Page } from "@playwright/test";

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 2);
}

test.describe("ChurchWork public navigation and internal boundaries", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { turnstile: Record<string, unknown> }).turnstile = {
        render: (_container: HTMLElement, options: Record<string, unknown>) => {
          const callback = options.callback;
          if (typeof callback === "function") {
            queueMicrotask(() => (callback as (token: string) => void)("synthetic-turnstile-token"));
          }
          return "synthetic-widget";
        },
        reset: () => undefined,
        remove: () => undefined,
      };
    });

    await page.route("https://challenges.cloudflare.com/**", async (route) => {
      await route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
    });
  });
  test("public landing routes users to the three role logins only", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "The right spiritual-care request, in the right hands." })).toBeVisible();
    await expect(page.getByRole("link", { name: "Request Care" }).first()).toHaveAttribute("href", "/request");
    await expect(page.locator('a[href="/facility-login"]').first()).toHaveAttribute("href", "/facility-login");
    await expect(page.locator('a[href="/partner-login"]').first()).toHaveAttribute("href", "/partner-login");

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

  test("requester entry is anonymous and contains no free-text care note", async ({ page }) => {
    await page.route("/api/guest-requests**", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({
          ok: true,
          choices: [{ facility_id: "facility-demo", facility_name: "Grandview Demo Facility", city: "Cookeville", state: "TN", partners: [{ partner_id: "partner-demo", partner_name: "Hope Community Church" }] }],
          requests: [],
          resolvedLocation: null
        }) });
        return;
      }
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, request: { id: "request-demo", support_options: ["Prayer"], status: "submitted", location_label: "406", created_at: new Date().toISOString(), updated_at: new Date().toISOString() } }) });
    });
    await page.goto("/requester-login");
    await expect(page).toHaveURL(/\/request$/);
    await expect(page.locator("textarea")).toHaveCount(0);
    await expect(page.getByText("Every care request is anonymous", { exact: false })).toBeVisible();
    await page.getByLabel(/facility/i).selectOption("facility-demo");
    await page.getByLabel(/room/i).fill("406");
    await page.getByLabel(/care partner/i).selectOption("partner-demo");
    await page.getByRole("button", { name: "Prayer" }).click();
    await expect(page.getByRole("button", { name: "Send request" })).toBeEnabled();
  });

  test("facility and partner login entrances support account creation", async ({ page }) => {
    for (const account of [
      { route: "/facility-login", trigger: "New facility? Create an account", heading: "Create facility account" },
      { route: "/partner-login", trigger: "New care partner? Create an account", heading: "Create care partner account" },
    ]) {
      await page.goto(account.route);
      await expect(page.getByLabel("Email")).toBeVisible();
      await expect(page.getByLabel("Password")).toBeVisible();
      await page.getByRole("button", { name: account.trigger }).click();
      await expect(page.getByRole("heading", { name: account.heading })).toBeVisible();
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
