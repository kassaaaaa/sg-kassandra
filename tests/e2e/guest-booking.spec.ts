import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

// WARNING: This test writes to the live database.
// It cleans up after itself, but use with caution.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

test('guest booking flow', async ({ page }) => {
  await page.goto('/app/test-ui');

  const testEmail = `test.user.${Date.now()}@example.com`;

  // 1. Trigger the booking modal
  await page.click('button:has-text("Book")');

  // 2. Verify the modal is open
  await expect(page.locator('h1:has-text("Guest Booking")')).toBeVisible();

  // 3. Fill out the form
  await page.fill('input[name="fullName"]', 'Test User');
  await page.fill('input[name="email"]', testEmail);
  await page.fill('input[name="phone"]', '1234567890');
  await page.check('input[name="policy"]');

  // 4. Submit the form
  await page.click('button:has-text("Book Lesson")');

  // 5. Verify success message
  await expect(page.locator('h2:has-text("Booking Successful!")')).toBeVisible();

  // 6. Verify booking record in the database
  const { data: booking, error } = await supabaseAdmin
    .from('bookings')
    .select('*, customer_details(*)')
    .eq('customer_details.email', testEmail)
    .single();
  
  expect(error).toBeNull();
  expect(booking).not.toBeNull();
  expect(booking.customer_details.full_name).toBe('Test User');

  // 7. Clean up the created booking and customer
  if (booking) {
    await supabaseAdmin.from('bookings').delete().eq('id', booking.id);
    await supabaseAdmin.from('customer_details').delete().eq('id', booking.customer_details.id);
  }
});
