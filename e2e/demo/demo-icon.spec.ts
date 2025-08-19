import { expect, test } from "@playwright/test";

test("it should open mat-form-field icon selector", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "demo" }).click();
  await page.getByRole("tab", { name: "demo-icons" }).click();
  await page.getByRole("button", { name: "CLEAR" }).click();
  // no selected icon
  await expect(page.getByRole("code").filter({ hasText: /^$/ })).toBeVisible();
  await page
    .locator("mat-form-field")
    .filter({ hasText: "icon ?" })
    .getByLabel("Select a icon")
    .click();
  await expect(
    page.locator("#mat-menu-panel-2 div").filter({ hasText: "brands Azure expand_more" })
  ).toBeVisible();
});
