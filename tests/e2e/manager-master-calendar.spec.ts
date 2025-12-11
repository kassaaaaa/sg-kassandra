import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTestUser(role: 'manager') {
  const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const email = `manager-${uniqueId}@example.com`;
  const password = 'Password123!';
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        full_name: 'Test Manager',
      },
    },
  });

  if (error) throw error;

  if (data.user) {
    const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        role: role,
    });
    if (profileError) {
        console.warn('Manual profile upsert failed:', profileError);
    }
  }

  return { email, password, user: data.user };
}

test.describe('Manager Master Calendar', () => {
  let manager: { email: string; password: string; user: any };

  test.beforeAll(async () => {
    manager = await createTestUser('manager');
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', manager.email);
    await page.fill('input[name="password"]', manager.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);
  });

  test('should display calendar and filter events', async ({ page }) => {
    await page.goto('/calendar');

    // Verify page title
    await expect(page.getByRole('heading', { name: 'Master Calendar' })).toBeVisible();

    // Verify calendar grid is present
    await expect(page.getByText('Time')).toBeVisible();

    // Verify Filters are present
    await expect(page.getByText('Filters')).toBeVisible();

    // Open filters
    await page.click('button:has(.lucide-chevron-down)');

    // Verify filter options
    await expect(page.getByText('Instructors', { exact: true })).toBeVisible();
    await expect(page.getByText('Lesson Types', { exact: true })).toBeVisible();
  });
});
