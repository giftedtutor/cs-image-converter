import type { ReactNode } from "react";
import Link from "next/link";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <article className="legal-page">
      <p className="legal-back">
        <Link href="/">← Back to CS Image Converter</Link>
      </p>
      <header className="legal-header">
        <h1>{title}</h1>
        <p className="legal-updated">Last updated: {updated}</p>
      </header>
      <div className="legal-body">{children}</div>
    </article>
  );
}
