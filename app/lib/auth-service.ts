import { supabase } from '@/lib/db';

export type UserRole = 'instructor' | 'manager';

export const AuthService = {
  async register(email: string, password: string, role: UserRole) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
        },
      },
    });

    if (error) {
      throw error;
    }

    return data;
  },
};
