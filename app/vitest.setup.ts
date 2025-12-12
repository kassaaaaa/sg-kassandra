import { createClient } from '@supabase/supabase-js'
import { beforeAll } from 'vitest';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables for the test setup
config({ path: path.resolve(__dirname, '.env.test') }); // Adjust path to root .env.test if needed

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Ensure environment variables are set
if (!url || !serviceRoleKey) {
  throw new Error('Supabase URL or Service Role Key is not defined in environment variables for test setup.');
}

const admin = createClient(url, serviceRoleKey, {
  auth: { persistSession: false },
})

async function ensureUser(email: string, role: string) {
  // Check if user already exists
  const { data: users, error: searchError } = await admin.auth.admin.listUsers();
  if (searchError) {
    console.error('Error listing users:', searchError);
    // Continue if user list can't be fetched, createUser will error if exists
  } else {
    const existingUser = users?.users.find(u => u.email === email);
    if (existingUser) {
      console.log(`User ${email} already exists. Skipping creation.`);
      return;
    }
  }

  // Create user if not found
  const { error } = await admin.auth.admin.createUser({
    email,
    password: 'password',
    email_confirm: true,
    user_metadata: { role },
  });

  if (error && !error.message.includes('already exists')) { // Updated to check for 'already exists'
    throw error
  } else if (error) {
    console.log(`User ${email} already exists or similar warning: ${error.message}`);
  } else {
    console.log(`User ${email} created successfully.`);
  }
}

// Ensure manager and instructor test users exist before tests run
beforeAll(async () => {
  await ensureUser('manager@test.com', 'manager');
  await ensureUser('instructor@test.com', 'instructor');
});
