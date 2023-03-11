export const selectors = Object.freeze({
  header: {
    pricingLink: '.HeaderV2 a[href="/plans/"]',
  },
  hero: {
    personalUseLink: 'div[id^="Hero"] a[href="/personal-password-manager/"]',
    pricingLink: 'div[id^="Hero"] a[href="/plans/"]',
  },
  pricing: {
    plansNames: 'div[id^="Pricing"] .mx-3 .text-small',
    freeTrialLink: 'div[id^="Pricing"] .justify-center a[href="/try-premium/"]',
  },
  emailInputField: 'input[aria-label="Your email address"]',
});
