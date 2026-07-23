import { expect, test, type Page } from "@playwright/test";

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 2);
}

async function visibleFocusLabel(page: Page) {
  return page.evaluate(() => {
    const active = document.activeElement;
    if (!active) return "";

    const element = active as HTMLElement;
    const aria = element.getAttribute("aria-label");
    if (aria) return aria;

    const label = element.closest("label")?.textContent?.trim();
    if (label) return label;

    return element.textContent?.trim() || element.getAttribute("name") || element.tagName;
  });
}

test.describe("ChurchWork super synth demo", () => {
  test("super synth route renders without pilot access gate", async ({ page }) => {
    await page.goto("/design/churchwork/super-synth");

    await expect(page.getByRole("heading", { name: "Super Synth Care Binder walkthrough" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "ChurchWork Care Team Workspace" })).toBeVisible();
    await expect(page.getByText("Jane Doe").first()).toBeVisible();
    await expect(page.getByText("Private pilot access")).toHaveCount(0);
    await expectNoHorizontalOverflow(page);
  });

  test("guided demo can start and advance as presentation mode", async ({ page }) => {
    await page.goto("/design/churchwork/super-synth");

    await page.getByRole("button", { name: "Start Guided Demo" }).click();
    await expect(page.getByText("Presentation mode only", { exact: false })).toBeVisible();
    await expect(page.getByText(/Step 1 of/i)).toBeVisible();

    await page.getByRole("button", { name: "Next" }).last().click();
    await expect(page.getByText(/Step 2 of/i)).toBeVisible();
  });

  test("care action prep is local, consent-aware, and timeline-backed", async ({ page }) => {
    await page.goto("/design/churchwork/super-synth");

    await page.getByRole("button", { name: /Prepare Prayer Request/i }).click();
    await expect(page.getByText("Draft a prayer request", { exact: false })).toBeVisible();

    const submitButton = page.getByRole("button", { name: /Submit|Prepare|Save/i }).last();
    await expect(submitButton).toBeDisabled();

    await page.getByRole("checkbox").first().check();
    await expect(submitButton).toBeEnabled();
  });

  test("keyboard walk reaches the main presentation and care controls", async ({ page }) => {
    await page.goto("/design/churchwork/super-synth");

    const focusStops: string[] = [];
    for (let index = 0; index < 16; index += 1) {
      await page.keyboard.press("Tab");
      focusStops.push(await visibleFocusLabel(page));
    }

    const combinedStops = focusStops.join(" ");
    const uniqueStops = new Set(focusStops.filter(Boolean));
    expect(uniqueStops.size).toBeGreaterThan(5);
    expect(combinedStops).toContain("Start Guided Demo");
    expect(combinedStops).toContain("Jane Doe");
  });

  test("captures super synth review screenshot", async ({ page }, testInfo) => {
    await page.goto("/design/churchwork/super-synth");
    await testInfo.attach("churchwork-super-synth.png", {
      body: await page.screenshot({ fullPage: false }),
      contentType: "image/png",
    });
  });
});
