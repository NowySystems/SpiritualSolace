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

  test("role login entrances are real server-backed login screens without placeholder records", async ({ page }) => {
    for (const route of ["/requester-login", "/facility-login", "/partner-login"]) {
      await page.goto(route);
      await expect(page).toHaveURL(new RegExp(`${route}$`));
      await expect(page.getByRole("heading", { name: /login/i }).first()).toBeVisible();
      await expect(page.getByLabel("Email")).toBeVisible();
      await expect(page.getByLabel("Password")).toBeVisible();
      await expect(page.getByText("server auth", { exact: false })).toHaveCount(0);
      await expect(page.getByText("ChurchWork internal access")).toHaveCount(0);
      await expect(page.getByText("Private pilot access")).toHaveCount(0);
      await expect(page.getByText("Jane", { exact: false })).toHaveCount(0);
      await expect(page.getByText("John", { exact: false })).toHaveCount(0);
      await expect(page.getByText("Grandview", { exact: false })).toHaveCount(0);
      await expect(page.getByText("Hope Church", { exact: false })).toHaveCount(0);
      await expectNoHorizontalOverflow(page);
    }
  });

  test("all portal roles can create public accounts", async ({ page }) => {
    const accounts = [
      { route: "/requester-login", trigger: "New requester? Create an account", heading: "Create requester account" },
      { route: "/facility-login", trigger: "New facility? Create an account", heading: "Create facility account" },
      { route: "/partner-login", trigger: "New care partner? Create an account", heading: "Create care partner account" },
    ];

    for (const account of accounts) {
      await page.goto(account.route);
      await expect(page.getByRole("button", { name: account.trigger })).toBeVisible();
      await page.getByRole("button", { name: account.trigger }).click();
      await expect(page.getByRole("heading", { name: account.heading })).toBeVisible();
      await expect(page.getByRole("button", { name: account.heading })).toBeVisible();
    }
  });

  test("role login submits through the server auth bridge", async ({ page }) => {
    const requests: string[] = [];
    await page.route("/api/role-auth", async (route) => {
      requests.push(route.request().url());
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, email: "requester@example.com", role: "requester", roleVerified: true, message: "Signed in through server auth bridge." })
      });
    });

    await page.goto("/requester-login");
    await page.getByLabel("Email").fill("requester@example.com");
    await page.getByLabel("Password").fill("testing-password");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByRole("heading", { name: "Requester workspace" })).toBeVisible();
    await expect(page.getByText("requester@example.com")).toBeVisible();
    expect(requests.length).toBe(1);
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
