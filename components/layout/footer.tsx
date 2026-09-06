import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-surface-border bg-white">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <div className="flex items-center gap-3">
          <span className="relative h-8 w-8 overflow-hidden rounded-lg bg-brand-50">
            <Image
              src="/umucuruzi-mark.png"
              alt="UMUCURUZI"
              fill
              sizes="32px"
              className="object-contain p-0.5"
            />
          </span>
          <div>
            <p className="text-sm font-bold text-brand-navy">UMUCURUZI</p>
            <p className="text-xs text-slate-500">Local goods, delivered with care.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
          <Link href="/privacy" className="transition-colors hover:text-brand-500">
            Privacy
          </Link>
          <Link href="/profile" className="transition-colors hover:text-brand-500">
            My account
          </Link>
          <span>© {new Date().getFullYear()} UMUCURUZI</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
