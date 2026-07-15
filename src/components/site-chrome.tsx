import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b hairline backdrop-blur-xl bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg tracking-tight">
          <span className="relative inline-block h-2 w-2 rounded-full bg-accent shadow-[0_0_16px_2px_var(--glow)]" />
          <span>Arna</span>
        </Link>
        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
          <a href="/#body" className="hover:text-foreground transition">The body</a>
          <a href="/#mind" className="hover:text-foreground transition">The mind</a>
          <a href="/#grows" className="hover:text-foreground transition">She grows</a>
          <a href="/#memoryos" className="hover:text-foreground transition">MemoryOS</a>
          <Link to="/demo" className="hover:text-foreground transition">Demo</Link>
          <Link to="/journal" className="hover:text-foreground transition">Journal</Link>
          <Link to="/chronicle" className="hover:text-foreground transition">Chronicle</Link>
        </nav>
        <a href="/#waitlist" className="btn-ghost text-sm">
          Join the waitlist
        </a>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t hairline">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <p className="font-display text-2xl tracking-tight md:text-3xl">
          Your companion. Your data. Your machine.
        </p>
        <div className="mt-10 flex flex-col justify-between gap-6 text-sm text-muted-foreground md:flex-row md:items-end">
          <div className="flex flex-wrap gap-6">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <Link to="/demo" className="hover:text-foreground">Demo</Link>
            <Link to="/journal" className="hover:text-foreground">Journal</Link>
            <Link to="/chronicle" className="hover:text-foreground">The Chronicle</Link>
            <a href="/#founders" className="hover:text-foreground">Founders</a>
            <a href="mailto:hello@thearnaproject.com" className="hover:text-foreground">Contact</a>
          </div>
          <div className="font-mono text-xs opacity-70">
            thearnaproject.com · © {new Date().getFullYear()} Arna AI — Local-first.
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

export function Section({
  id,
  eyebrow,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`mx-auto max-w-6xl px-6 py-24 md:py-32 ${className}`}>
      {eyebrow ? <div className="eyebrow mb-6">{eyebrow}</div> : null}
      {children}
    </section>
  );
}

export function PullQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="my-10 border-l-2 pl-6 font-display text-2xl leading-snug tracking-tight text-foreground/90 md:text-3xl" style={{ borderColor: "var(--glow)" }}>
      "{children}"
    </blockquote>
  );
}