import Image from "next/image";
import { Phone, Mail, MapPin, ChevronRight, LogOut } from "lucide-react";
import { currentCustomer } from "@/data/customer";

const MENU_ROWS = [
  { label: "Saved addresses", href: "/profile" },
  { label: "Payment methods", href: "/profile" },
  { label: "Notification settings", href: "/profile" },
  { label: "Help & support", href: "/profile" },
];

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-6 sm:px-8">
      <h1 className="text-xl font-bold text-brand-navy sm:text-2xl">Profile</h1>

      <div className="mt-6 flex items-center gap-4 rounded-2xl bg-white p-5 shadow-card">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-surface-muted">
          <Image src={currentCustomer.avatar} alt={currentCustomer.name} fill sizes="64px" className="object-cover" />
        </div>
        <div>
          <p className="text-lg font-bold text-brand-navy">{currentCustomer.name}</p>
          <p className="text-sm text-slate-400">{currentCustomer.role}</p>
        </div>
      </div>

      <div className="mt-4 space-y-3 rounded-2xl bg-white p-5 shadow-card">
        <div className="flex items-center gap-3 text-sm text-brand-navy">
          <Phone size={16} className="text-slate-400" />
          {currentCustomer.phone}
        </div>
        <div className="flex items-center gap-3 text-sm text-brand-navy">
          <Mail size={16} className="text-slate-400" />
          {currentCustomer.email}
        </div>
        <div className="flex items-center gap-3 text-sm text-brand-navy">
          <MapPin size={16} className="text-slate-400" />
          Musanze, Rwanda
        </div>
      </div>

      <div className="mt-4 divide-y divide-surface-border rounded-2xl bg-white shadow-card">
        {MENU_ROWS.map((row) => (
          <button
            key={row.label}
            type="button"
            className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-brand-navy hover:bg-surface-muted first:rounded-t-2xl last:rounded-b-2xl"
          >
            {row.label}
            <ChevronRight size={16} className="text-slate-300" />
          </button>
        ))}
      </div>

      <button
        type="button"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white p-4 text-sm font-semibold text-red-500 shadow-card hover:bg-red-50"
      >
        <LogOut size={16} />
        Log out
      </button>
    </div>
  );
}
