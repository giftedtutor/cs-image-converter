import Link from "next/link";
import { MobileNav } from "@/components/MobileNav";
import { SITE_NAME } from "@/lib/site";

const NAV = [
  { href: "/#converter", label: "Converter" },
  { href: "/#features", label: "Features" },
  { href: "/#formats", label: "Formats" },
  { href: "/privacy", label: "Privacy" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" aria-label={`${SITE_NAME} home`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt=""
            className="brand-logo"
            width={36}
            height={36}
            decoding="async"
          />
          <span className="brand-text">
            <span className="brand-name">CS Image Converter</span>
            <span className="brand-tag">Private · Instant · Free</span>
          </span>
        </Link>

        <nav className="site-nav site-nav--desktop" aria-label="Primary">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
          <Link href="/#converter" className="header-cta">
            Convert image
          </Link>
        </nav>

        <MobileNav items={NAV} />
      </div>
    </header>
  );
}
