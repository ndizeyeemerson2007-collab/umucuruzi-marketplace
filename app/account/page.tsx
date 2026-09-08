"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  LocateFixed,
  LogIn,
  LogOut,
  MapPin,
  Megaphone,
  ShieldCheck,
  Store,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useLocation } from "@/context/location-context";

function SettingToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-brand-500" : "bg-slate-200"}`}
    >
      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

export default function AccountPage() {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { location, status: locationStatus, requestLocation } = useLocation();
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [marketingNotifications, setMarketingNotifications] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState("");

  useEffect(() => {
    try {
      const storedPreferences = window.localStorage.getItem("umucuruzi:notification-preferences");
      const storedDeliveryNote = window.localStorage.getItem("umucuruzi:delivery-note");
      if (storedPreferences) {
        const preferences = JSON.parse(storedPreferences) as {
          orderNotifications?: boolean;
          marketingNotifications?: boolean;
        };
        if (typeof preferences.orderNotifications === "boolean") setOrderNotifications(preferences.orderNotifications);
        if (typeof preferences.marketingNotifications === "boolean") setMarketingNotifications(preferences.marketingNotifications);
      }
      if (storedDeliveryNote) setDeliveryNote(storedDeliveryNote);
    } catch {
      // Ignore unavailable or malformed local preferences.
    }
  }, []);

  function saveNotificationPreferences(next: { orderNotifications?: boolean; marketingNotifications?: boolean }) {
    const preferences = {
      orderNotifications: next.orderNotifications ?? orderNotifications,
      marketingNotifications: next.marketingNotifications ?? marketingNotifications,
    };
    setOrderNotifications(preferences.orderNotifications);
    setMarketingNotifications(preferences.marketingNotifications);
    try {
      window.localStorage.setItem("umucuruzi:notification-preferences", JSON.stringify(preferences));
    } catch {
      // Ignore storage errors.
    }
  }

  function saveDeliveryNote(value: string) {
    setDeliveryNote(value);
    try {
      window.localStorage.setItem("umucuruzi:delivery-note", value);
    } catch {
      // Ignore storage errors.
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setErrorMessage(null);

    const result =
      mode === "login"
        ? await signIn(email.trim(), password)
        : await signUp(name.trim(), email.trim(), password);

    if (result.error) {
      setErrorMessage(result.error);
    } else if (mode === "signup" && result.needsEmailConfirmation) {
      setMessage("Account created. Check your email to confirm it, then log in.");
      setMode("login");
      setPassword("");
    } else {
      setMessage(mode === "login" ? "You are now logged in." : "Your account is ready.");
      setPassword("");
    }
    setSubmitting(false);
  }

  async function handleSignOut() {
    setErrorMessage(null);
    const result = await signOut();
    if (result.error) setErrorMessage(result.error);
    else setMessage("You have been logged out.");
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16 text-center sm:px-8">
        <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-brand-50" />
        <p className="mt-4 text-sm text-slate-500">Checking account status...</p>
      </div>
    );
  }

  if (user) {
    const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Customer";
    return (
      <div className="mx-auto max-w-xl px-5 py-8 sm:px-8">
        <h1 className="text-2xl font-bold text-brand-navy">Your account</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your account and keep your orders together.</p>

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-card">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <UserRound size={25} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-bold text-brand-navy">{displayName}</p>
              <p className="truncate text-sm text-slate-500">{user.email}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              href="/orders"
              className="rounded-xl bg-brand-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-600"
            >
              View my orders
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 rounded-xl border border-surface-border px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50"
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        </div>

        <section className="mt-4 overflow-hidden rounded-2xl bg-white shadow-card" aria-labelledby="account-settings-heading">
          <div className="border-b border-surface-border px-5 py-4">
            <h2 id="account-settings-heading" className="text-base font-bold text-brand-navy">Account settings</h2>
            <p className="mt-1 text-xs text-slate-400">Choose how UMUCURUZI keeps you updated and remembers delivery details.</p>
          </div>

          <div className="border-b border-surface-border p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Bell size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-brand-navy">Notifications</p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-400">Control order updates and optional marketplace messages.</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-brand-navy">Order updates</p>
                  <p className="text-xs text-slate-400">Status changes for your orders</p>
                </div>
                <SettingToggle
                  checked={orderNotifications}
                  onChange={(checked) => saveNotificationPreferences({ orderNotifications: checked })}
                  label="Toggle order update notifications"
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-brand-navy">Offers and news</p>
                  <p className="text-xs text-slate-400">Occasional marketplace updates</p>
                </div>
                <SettingToggle
                  checked={marketingNotifications}
                  onChange={(checked) => saveNotificationPreferences({ marketingNotifications: checked })}
                  label="Toggle offers and news notifications"
                />
              </div>
            </div>
          </div>

          <div className="border-b border-surface-border p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <MapPin size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-brand-navy">Delivery location</p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-400">Use your current location or keep a delivery note for your next order.</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-surface-muted px-3.5 py-3">
              <div className="flex min-w-0 items-center gap-2">
                <LocateFixed size={16} className="shrink-0 text-brand-500" />
                <span className="truncate text-sm font-medium text-brand-navy">{location.label}</span>
              </div>
              <button type="button" onClick={requestLocation} className="shrink-0 text-xs font-semibold text-brand-600 hover:text-brand-700">
                {locationStatus === "loading" ? "Locating..." : "Update"}
              </button>
            </div>
            <label className="mt-3 block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-500">Delivery note</span>
              <input
                value={deliveryNote}
                onChange={(event) => saveDeliveryNote(event.target.value)}
                placeholder="Apartment, landmark, or gate instructions"
                className="w-full rounded-xl border border-surface-border bg-surface-muted px-3.5 py-3 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none"
              />
            </label>
          </div>

          <div className="divide-y divide-surface-border">
            <Link href="/privacy" className="flex items-center gap-3 px-5 py-4 transition hover:bg-surface-muted">
              <ShieldCheck size={18} className="text-slate-400" />
              <span className="flex-1 text-sm font-medium text-brand-navy">Privacy and data</span>
              <ChevronRight size={16} className="text-slate-300" />
            </Link>
            <Link href="/partner" className="flex items-center gap-3 px-5 py-4 transition hover:bg-surface-muted">
              <Store size={18} className="text-slate-400" />
              <span className="flex-1 text-sm font-medium text-brand-navy">Become a partner</span>
              <ChevronRight size={16} className="text-slate-300" />
            </Link>
            <button type="button" onClick={() => setMessage("Support is available through the UMUCURUZI team.")} className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-surface-muted">
              <Megaphone size={18} className="text-slate-400" />
              <span className="flex-1 text-sm font-medium text-brand-navy">Help and support</span>
              <ChevronRight size={16} className="text-slate-300" />
            </button>
          </div>
        </section>

        {message && <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">{message}</p>}
        {errorMessage && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{errorMessage}</p>}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-8 sm:px-8">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          {mode === "login" ? <LogIn size={26} /> : <UserRound size={26} />}
        </div>
        <h1 className="mt-4 text-2xl font-bold text-brand-navy">
          {mode === "login" ? "Log in to UMUCURUZI" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          {mode === "login"
            ? "Log in when you want to view your orders and keep your details saved."
            : "Create an account for faster checkout and order history. You can also continue ordering as a guest."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl bg-white p-6 shadow-card">
        {mode === "signup" && (
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Full name</span>
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              className="w-full rounded-xl border border-surface-border bg-surface-muted px-3.5 py-3 text-sm text-brand-navy focus:border-brand-400 focus:bg-white focus:outline-none"
            />
          </label>
        )}
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-500">Email address</span>
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            className="w-full rounded-xl border border-surface-border bg-surface-muted px-3.5 py-3 text-sm text-brand-navy focus:border-brand-400 focus:bg-white focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-500">Password</span>
          <input
            required
            minLength={6}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className="w-full rounded-xl border border-surface-border bg-surface-muted px-3.5 py-3 text-sm text-brand-navy focus:border-brand-400 focus:bg-white focus:outline-none"
          />
        </label>

        {errorMessage && <p className="rounded-xl bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600">{errorMessage}</p>}
        {message && (
          <p className="flex items-start gap-2 rounded-xl bg-green-50 px-3 py-2.5 text-sm font-medium text-green-700">
            <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
        </button>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setMessage(null);
            setErrorMessage(null);
          }}
          className="w-full text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          {mode === "login" ? "New to UMUCURUZI? Create an account" : "Already have an account? Log in"}
        </button>
      </form>

      <p className="mt-5 text-center text-xs leading-relaxed text-slate-400">
        You do not need an account to place an order. By creating an account, you agree to our{" "}
        <Link href="/terms" className="font-semibold text-brand-600 hover:underline">Terms</Link> and{" "}
        <Link href="/privacy" className="font-semibold text-brand-600 hover:underline">Privacy Policy</Link>.
      </p>
    </div>
  );
}
