import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error?: { message?: string } | null } | null>;
  signIn: (email: string, password: string) => Promise<{ error?: { message?: string } | null } | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(data.user ?? null);
      setLoading(false);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const tryUnsubscribe = (obj: unknown) => {
      if (obj && typeof obj === 'object' && 'subscription' in obj) {
        const maybe = obj as { subscription?: { unsubscribe?: () => void } };
        maybe.subscription?.unsubscribe?.();
      }
    };

    return () => {
      mounted = false;
      tryUnsubscribe(listener);
    };
  }, []);

  const signUp = (email: string, password: string) => {
    return supabase.auth.signUp({ email, password }).then((res) => {
      try {
        console.log('supabase.signUp response', res);
      } catch {
        // ignore logging errors
      }
      return res;
    });
  };

  const signIn = (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password }).then((res) => {
      try {
        console.log('supabase.signIn response', res);
      } catch {
        // ignore logging errors
      }
      return res;
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
