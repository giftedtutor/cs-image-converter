"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SITE_NAME } from "@/lib/site";

const NAV = [
  { href: "/#converter", label: "Converter" },
  { href: "/#features", label: "Features" },
  { href: "/#formats", label: "Formats" },
  { href: "/privacy", label: "Privacy" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 860) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={`site-header ${open ? "is-menu-open" : ""}`}>
      <div className="header-inner">
        <Link href="/" className="brand" aria-label={`${SITE_NAME} home`} onClick={close}>
          <span className="brand-mark" aria-hidden>
            CS
          </span>
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

        <button
          type="button"
          className={`nav-toggle ${open ? "is-open" : ""}`}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`mobile-nav ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} onClick={close} tabIndex={open ? 0 : -1}>
              {item.label}
            </Link>
          ))}
          <Link href="/terms" onClick={close} tabIndex={open ? 0 : -1}>
            Terms of Service
          </Link>
          <Link href="/#converter" className="mobile-cta" onClick={close} tabIndex={open ? 0 : -1}>
            Convert image
          </Link>
        </nav>
      </div>
    </header>
  );
}
