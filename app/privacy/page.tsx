import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | UMUCURUZI",
  description: "A plain-language overview of how UMUCURUZI handles customer information.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14 lg:px-8">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-500 hover:text-brand-600"
      >
        <ArrowLeft size={16} />
        Back to marketplace
      </Link>

      <div className="rounded-3xl border border-surface-border bg-white p-6 shadow-card sm:p-10">
        <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
          <ShieldCheck size={24} />
        </div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-brand-500">Your privacy matters</p>
        <h1 className="text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-slate-500">Last updated: September 2026</p>

        <div className="mt-10 space-y-7 text-sm leading-7 text-slate-600">
          <section>
            <h2 className="text-base font-bold text-brand-navy">Information we use</h2>
            <p className="mt-2">
              UMUCURUZI uses the information you provide, such as your name, contact details, delivery address, and order selections, to help you browse, place, and manage orders.
            </p>
          </section>
          <section>
            <h2 className="text-base font-bold text-brand-navy">How we use it</h2>
            <p className="mt-2">
              We use information to operate the marketplace, coordinate delivery, improve the customer experience, and communicate about your orders or account. We do not sell your personal information.
            </p>
          </section>
          <section>
            <h2 className="text-base font-bold text-brand-navy">Your choices</h2>
            <p className="mt-2">
              You may review or update your account details and contact UMUCURUZI with questions about your information or privacy preferences.
            </p>
          </section>
          <section>
            <h2 className="text-base font-bold text-brand-navy">Contact</h2>
            <p className="mt-2">
              For privacy questions, please contact the UMUCURUZI support team through the contact method provided by the marketplace.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
