import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | UMUCURUZI",
  description: "Terms for using the UMUCURUZI marketplace and partner application service.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
      <h1 className="text-2xl font-bold text-brand-navy">Terms of Use</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: September 2026</p>
      <div className="mt-7 space-y-6 rounded-2xl bg-white p-6 text-sm leading-relaxed text-slate-600 shadow-card sm:p-8">
        <section>
          <h2 className="font-bold text-brand-navy">Using UMUCURUZI</h2>
          <p className="mt-2">UMUCURUZI helps customers discover participating businesses, place delivery orders, and track submitted orders. Please provide accurate contact and delivery information so a restaurant or shop can fulfill your order.</p>
        </section>
        <section>
          <h2 className="font-bold text-brand-navy">Orders and payments</h2>
          <p className="mt-2">An order request is subject to restaurant availability and confirmation. Prices, delivery fees, estimated times, and availability may change before an order is accepted. Payment options shown at checkout describe the current marketplace flow.</p>
        </section>
        <section>
          <h2 className="font-bold text-brand-navy">Partner applications</h2>
          <p className="mt-2">Submitting a partner application does not guarantee approval, placement, POS access, or a subscription. We may contact applicants to verify business information and explain available onboarding or subscription options. Any subscription will require separate terms and confirmation before it begins.</p>
        </section>
        <section>
          <h2 className="font-bold text-brand-navy">Accounts and guest checkout</h2>
          <p className="mt-2">An account is optional for ordering. If you create an account, keep your login information secure and provide information that belongs to you. Guest orders can be tracked using the order details provided after checkout.</p>
        </section>
        <section>
          <h2 className="font-bold text-brand-navy">Contact</h2>
          <p className="mt-2">If you have questions about an order, account, or partner application, use the contact details provided by UMUCURUZI or the support channel available on the marketplace.</p>
        </section>
      </div>
    </div>
  );
}
