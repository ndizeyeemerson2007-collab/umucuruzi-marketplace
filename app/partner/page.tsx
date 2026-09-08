"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { CheckCircle2, Store, UserRound } from "lucide-react";
import { useAuth } from "@/context/auth-context";

const BUSINESS_TYPES = ["Restaurant", "Shop or supermarket", "Bakery or café", "Pharmacy", "Other"];

export default function PartnerPage() {
  const { user, session } = useAuth();
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState(user?.user_metadata?.full_name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0]);
  const [location, setLocation] = useState("Musanze, Rwanda");
  const [notes, setNotes] = useState("");
  const [acceptsPrivacyTerms, setAcceptsPrivacyTerms] = useState(false);
  const [authorizesPosAndSubscription, setAuthorizesPosAndSubscription] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/partner/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          businessName,
          contactName,
          email,
          phone,
          businessType,
          location,
          notes,
          acceptsPrivacyTerms,
          authorizesPosAndSubscription,
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Could not submit your application.");
      setSuccess(true);
      setBusinessName("");
      setPhone("");
      setNotes("");
      setAcceptsPrivacyTerms(false);
      setAuthorizesPosAndSubscription(false);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not submit your application.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
      <div className="max-w-2xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <Store size={24} />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-brand-navy sm:text-3xl">Become a UMUCURUZI partner</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 sm:text-base">
          Apply to bring your restaurant, shop, or service to more customers. Our team will review your details and contact you about the next steps.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5 rounded-2xl bg-white p-5 shadow-card sm:p-7">
        <div>
          <h2 className="text-base font-bold text-brand-navy">Business details</h2>
          <p className="mt-1 text-xs text-slate-400">Fields marked with * are required.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Business name *</span>
            <input required value={businessName} onChange={(event) => setBusinessName(event.target.value)} placeholder="e.g. Volcano Grill" className="partner-input" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Contact person *</span>
            <div className="relative">
              <UserRound size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input required value={contactName} onChange={(event) => setContactName(event.target.value)} placeholder="Full name" className="partner-input pl-10" />
            </div>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Business type *</span>
            <select required value={businessType} onChange={(event) => setBusinessType(event.target.value)} className="partner-input">
              {BUSINESS_TYPES.map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Email address *</span>
            <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@business.com" className="partner-input" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Phone number *</span>
            <input required type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+250 7XX XXX XXX" className="partner-input" />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Business location *</span>
            <input required value={location} onChange={(event) => setLocation(event.target.value)} placeholder="City, district, or street" className="partner-input" />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Anything else we should know?</span>
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} placeholder="Tell us about your business, menu, delivery capacity, or questions." className="partner-input resize-none" />
          </label>
        </div>

        <div className="space-y-3 rounded-2xl bg-surface-muted p-4">
          <h2 className="text-sm font-bold text-brand-navy">Consent and onboarding</h2>
          <label className="flex items-start gap-3 text-sm text-slate-600">
            <input required type="checkbox" checked={acceptsPrivacyTerms} onChange={(event) => setAcceptsPrivacyTerms(event.target.checked)} className="mt-1 h-4 w-4 accent-brand-500" />
            <span>I agree to the <Link href="/privacy" className="font-semibold text-brand-600 hover:underline">Privacy Policy</Link> and <Link href="/terms" className="font-semibold text-brand-600 hover:underline">Terms</Link>. *</span>
          </label>
          <label className="flex items-start gap-3 text-sm text-slate-600">
            <input type="checkbox" checked={authorizesPosAndSubscription} onChange={(event) => setAuthorizesPosAndSubscription(event.target.checked)} className="mt-1 h-4 w-4 accent-brand-500" />
            <span>I authorize UMUCURUZI to use POS tools for onboarding and to contact me about applicable POS or subscription options. This consent is optional and does not approve a subscription by itself.</span>
          </label>
        </div>

        {errorMessage && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{errorMessage}</p>}
        {success && (
          <p className="flex items-start gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            Application received. Our team will review it and contact you using the details you provided.
          </p>
        )}

        <button type="submit" disabled={submitting} className="w-full rounded-xl bg-brand-500 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-8">
          {submitting ? "Submitting application..." : "Submit application"}
        </button>
      </form>
    </div>
  );
}
