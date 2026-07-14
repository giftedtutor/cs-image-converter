"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type NavItem = { href: string; label: string };

export function MobileNav({ items }: { items: readonly NavItem[] }) {
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
    <>
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

      <div
        id="mobile-nav"
        className={`mobile-nav ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile">
          {items.map((item) => (
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
    </>
  );
}
