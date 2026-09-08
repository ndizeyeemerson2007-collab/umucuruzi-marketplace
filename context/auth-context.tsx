"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getBrowserSupabaseClient } from "@/lib/supabase/client";

type AuthResult = {
  error: string | null;
  needsEmailConfirmation?: boolean;
};

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (name: string, email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readableAuthError(message: string) {
  if (message.toLowerCase().includes("invalid login credentials")) {
    return "The email or password is incorrect.";
  }
  if (message.toLowerCase().includes("user already registered")) {
    return "An account with this email already exists. Try logging in instead.";
  }
  return message;
}

async function syncCustomerProfile(session: Session | null) {
  if (!session?.access_token || !session.user) return;

  await fetch("/api/account/profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      name: session.user.user_metadata?.full_name ?? "",
      email: session.user.email ?? "",
      phone: session.user.phone ?? "",
    }),
  }).catch(() => undefined);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getBrowserSupabaseClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
      void syncCustomerProfile(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
      void syncCustomerProfile(nextSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      async signIn(email, password) {
        const supabase = getBrowserSupabaseClient();
        if (!supabase) return { error: "Account service is not configured yet." };
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error ? readableAuthError(error.message) : null };
      },
      async signUp(name, email, password) {
        const supabase = getBrowserSupabaseClient();
        if (!supabase) return { error: "Account service is not configured yet." };
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name.trim() } },
        });
        if (error) return { error: readableAuthError(error.message) };
        if (data.session) void syncCustomerProfile(data.session);
        return {
          error: null,
          needsEmailConfirmation: !data.session,
        };
      },
      async signOut() {
        const supabase = getBrowserSupabaseClient();
        if (!supabase) return { error: null };
        const { error } = await supabase.auth.signOut();
        return { error: error ? readableAuthError(error.message) : null };
      },
    }),
    [loading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
