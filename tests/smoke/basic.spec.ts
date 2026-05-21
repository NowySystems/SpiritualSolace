import { expect, test } from "@playwright/test";

test.describe("CRCF Funding Command smoke checks", () => {
  test("home page loads without crashing", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/CRCF|Funding|Grant|Command|Foundation/i);

    const bodyText = await page.locator("body").innerText();
    expect(bodyText.length).toBeGreaterThan(100);

    await expect(page.locator("body")).not.toContainText("Unhandled Runtime Error");
    await expect(page.locator("body")).not.toContainText("Application error");
    await expect(page.locator("body")).not.toContainText("404");
  });

  test("primary navigation or page shell is visible", async ({ page }) => {
    await page.goto("/");

    const body = page.locator("body");

    await expect(body).toContainText(/Funding|Grant|Opportunity|Source|Dashboard|Review/i);
  });

  test("mobile page renders without crashing", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const bodyText = await page.locator("body").innerText();
    expect(bodyText.length).toBeGreaterThan(100);

    await expect(page.locator("body")).not.toContainText("Unhandled Runtime Error");
    await expect(page.locator("body")).not.toContainText("Application error");
  });
});
