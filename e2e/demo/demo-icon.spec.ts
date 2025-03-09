import { expect, test } from "@playwright/test";

test("it should open mat-form-field icon selector", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "demo" }).click();
  await expect(page.locator("#mat-menu-panel-2")).not.toBeVisible();
  await page.locator("#app-icon-select-2").getByRole("button", { name: "Select a icon" }).click();
  await expect(page.locator("#mat-menu-panel-2")).toBeVisible();
});
