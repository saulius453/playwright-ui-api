import { test, expect } from '@playwright/test';
import { selectors } from '../selectors';

test.beforeEach(async ({ page }) => {
  await page.goto('https://nordpass.com/');
});

test('NordPass homepage has title and link to pricing page', async ({ page }) => {
  await expect(page).toHaveTitle(/NordPass/);

  const plansLink = page.locator(selectors.header.pricingLink);
  await plansLink.click();

  await expect(page).toHaveURL('https://nordpass.com/plans/');
});

test('User has 3 plans to choose from and can select free trial', async ({ page }) => {
  const personalUse = page.locator(selectors.hero.personalUseLink);
  await personalUse.click();

  await expect(page).toHaveURL(/.*personal-password-manager/);

  const pricingLink = page.locator(selectors.hero.pricingLink);
  await pricingLink.click();

  await expect(page).toHaveURL(/.*plans/);

  const plansNames = await page.locator(selectors.pricing.plansNames).allInnerTexts();
  expect(plansNames[0]).toBe('FREE');
  expect(plansNames[1]).toBe('PREMIUM');
  expect(plansNames[2]).toBe('FAMILY');

  const trialLink = page.locator(selectors.pricing.freeTrialLink);
  await trialLink.click();

  await expect(page).toHaveURL(/.*try-premium/);

  const emailInputField = page.locator(selectors.emailInputField);
  await expect(emailInputField).toBeVisible()
});

