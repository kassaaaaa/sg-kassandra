import { test, expect } from '@playwright/test';

test('guest booking flow', async ({ page }) => {
  await page.goto('/app/test-ui');

  // 1. Trigger the booking modal (assuming a button with 'Book' text exists)
  await page.click('button:has-text("Book")');

  // 2. Verify the modal is open
  await expect(page.locator('h1:has-text("Guest Booking")')).toBeVisible();

  // 3. Fill out the form
  await page.fill('input[name="fullName"]', 'Test User');
  await page.fill('input[name="email"]', 'test.user@example.com');
  await page.fill('input[name="phone"]', '1234567890');
  await page.check('input[name="policy"]');

  // 4. Submit the form
  await page.click('button:has-text("Book Lesson")');

  // 5. Verify success message
  await expect(page.locator('h2:has-text("Booking Successful!")')).toBeVisible();
});
