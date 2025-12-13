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

  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  },

  async getUserRole(): Promise<UserRole | null> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.log('AuthService: No user found.');
      return null;
    }

    console.log('AuthService: User found:', user);

    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('AuthService: Error fetching user role:', error);
      return null;
    }

    console.log('AuthService: Role data from profiles:', data);

    return data?.role as UserRole;
  },
};