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
  test("public landing exposes requester, facility, partner, and admin access", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "The right spiritual-care request, in the right hands." })).toBeVisible();
    await expect(page.getByRole("link", { name: "Request Care" }).first()).toHaveAttribute("href", "/request");
    await expect(page.locator('a[href="/facility-login"]').first()).toHaveAttribute("href", "/facility-login");
    await expect(page.locator('a[href="/partner-login"]').first()).toHaveAttribute("href", "/partner-login");

    await expect(page.locator('a[href="/admin"]').first()).toHaveAttribute("href", "/admin");
    await expect(page.locator('a[href="/mvp"]')).toHaveCount(0);
    await expect(page.locator('a[href="/demo/synthetic"]')).toHaveCount(0);
    await expect(page.locator('a[href="/preview"]')).toHaveCount(0);
    await expect(page.getByText("Guardrails", { exact: true })).toHaveCount(0);
    await expect(page.getByText("No emergency workflow", { exact: true })).toHaveCount(0);
    await expect(page.getByText("No medical records", { exact: true })).toHaveCount(0);
    await expect(page.getByText("No open chat", { exact: true })).toHaveCount(0);
    await expect(page.getByText("Cole", { exact: false })).toHaveCount(0);
    await expectNoHorizontalOverflow(page);
  });

  test("requester entry submits anonymous care and shows status", async ({ page }) => {
    let submitted = false;
    await page.route("/api/guest-requests**", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({
          ok: true,
          choices: [{ facility_id: "facility-demo", facility_name: "Grandview Demo Facility", city: "Cookeville", state: "TN", partners: [{ partner_id: "partner-demo", partner_name: "Hope Community Church" }] }],
          requests: submitted ? [{ id: "request-demo", support: ["Prayer"], status: "submitted", location_label: "406", created_at: new Date().toISOString() }] : [],
          resolvedLocation: null
        }) });
        return;
      }
      submitted = true;
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, message: "Request submitted.", request: { id: "request-demo", support_options: ["Prayer"], status: "submitted", location_label: "406", created_at: new Date().toISOString(), updated_at: new Date().toISOString() } }) });
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
    await page.getByRole("button", { name: "Send request" }).click();
    await expect(page.getByText("Request submitted.")).toBeVisible();
    await expect(page.getByText("Submitted", { exact: true })).toBeVisible();
    await expect(page.getByText("406", { exact: true })).toBeVisible();
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

  test("synthetic facility and partner users can complete account creation", async ({ page }) => {
    await page.route("/api/role-auth", async (route) => {
      const body = route.request().postDataJSON() as { role: string; mode: string; email: string };
      expect(body.mode).toBe("sign-up");
      expect(["facility", "partner"]).toContain(body.role);
      expect(body.email).toContain("@example.test");
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, needsEmailConfirmation: true }) });
    });

    for (const account of [
      { route: "/facility-login", trigger: "New facility? Create an account", email: "synth.facility@example.test", submit: "Create facility account", confirmation: "Facility account created." },
      { route: "/partner-login", trigger: "New care partner? Create an account", email: "synth.partner@example.test", submit: "Create care partner account", confirmation: "Care partner account created." },
    ]) {
      await page.goto(account.route);
      await page.getByRole("button", { name: account.trigger }).click();
      await page.getByLabel("Email").fill(account.email);
      await page.getByLabel("Password").fill("SyntheticPass123!");
      await page.getByRole("button", { name: account.submit }).click();
      await expect(page.getByText(account.confirmation, { exact: false })).toBeVisible();
    }
  });

  test("simple admin control page exposes the complete presentation path", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "ChurchWork Admin" })).toBeVisible();
    for (const item of [
      { name: "Demo", href: "/demo/synthetic" },
      { name: "Requester", href: "/request" },
      { name: "Facility", href: "/facility-login" },
      { name: "Care Partner", href: "/partner-login" },
    ]) {
      await expect(page.getByRole("link", { name: new RegExp("^" + item.name) }).first()).toHaveAttribute("href", item.href);
    }
    await expectNoHorizontalOverflow(page);
  });

  test("admin shell is accessible while diagnostics remain internally gated", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByRole("heading", { name: "ChurchWork Admin" })).toBeVisible();

    await page.goto("/internal-access");
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByRole("heading", { name: "ChurchWork Admin" })).toBeVisible();

    for (const route of ["/mvp", "/synthetic-smoke", "/ai-map"]) {
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
