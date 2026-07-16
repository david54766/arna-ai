import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

function useScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => el.classList.add("is-in"));
      return;
    }
    const selectors = [
      ".section .section-head",
      ".feature-grid > li",
      ".together-3 > *",
      ".tiers > li",
      ".triptych > li",
      ".mind-console-wrap",
      ".gallery-grid > li",
      ".journal-list > li",
      ".chron-entry",
      ".grid-2 > *",
      ".panel.waitlist-inner",
      "#journal-teaser .panel",
      "#gateway .panel",
      "#roundtable .panel",
    ].join(",");
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(selectors));
    nodes.forEach((el, i) => {
      el.setAttribute("data-reveal", "");
      // stagger by sibling index within its parent (max 4 steps)
      const parent = el.parentElement;
      const sibs = parent ? Array.from(parent.children) : [el];
      const idx = Math.min(sibs.indexOf(el), 4);
      el.style.setProperty("--reveal-delay", `${idx * 70}ms`);
      void i;
    });
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add("is-in");
          io.unobserve(e.target);
        }
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
}

function BrandMark() {
  return (
    <svg className="brand-mark" width="34" height="30" viewBox="0 0 40 32" aria-hidden="true" focusable="false">
      <circle cx="8" cy="16" r="4.2" fill="none" stroke="var(--arna)" strokeWidth="1.6" />
      <circle cx="20" cy="16" r="4.2" fill="none" stroke="var(--mem)" strokeWidth="1.6" />
      <circle cx="32" cy="16" r="4.2" fill="none" stroke="var(--mind)" strokeWidth="1.6" />
      <path d="M12.2 16 h3.6 M24.2 16 h3.6" stroke="var(--fg-dim)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function SiteHeader({ transparentUntilScroll = true }: { transparentUntilScroll?: boolean }) {
  const [scrolled, setScrolled] = useState(!transparentUntilScroll);
  useEffect(() => {
    if (!transparentUntilScroll) return;
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [transparentUntilScroll]);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`} id="top">
      <div className="wrap header-inner">
        <Link to="/" className="brand" aria-label="Arna — body, memory, mind — home">
          <BrandMark />
          <span className="brand-text">Arna</span>
        </Link>
        <nav className="site-nav" aria-label="Primary">
          <a href="/#arna">Body</a>
          <a href="/#mind">Mind</a>
          <a href="/#grows">She grows</a>
          <a href="/#memoryos">Memory</a>
          <a href="/#oversight">Oversight</a>
          <Link to="/journal">Journal</Link>
          <Link to="/chronicle" className="nav-chron">Chronicle</Link>
          <Link to="/demo" className="nav-demo">See her think</Link>
          <a className="nav-cta" href="/#waitlist">Join waitlist</a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div>
          <div className="footer-brand">
            <BrandMark />
            <span>Arna</span>
          </div>
          <p className="footer-tag-lead">
            A body, a memory, and a mind you own. Runs on your hardware. No cloud required.
          </p>
        </div>
        <div className="footer-nav">
          <div className="footer-col">
            <h4>Products</h4>
            <a href="/#arna">Arna — the body</a>
            <a href="/#memoryos">MemoryOS</a>
            <a href="/#mind">Arna Mind</a>
            <a href="/#link">Arna Link</a>
          </div>
          <div className="footer-col">
            <h4>Story</h4>
            <Link to="/journal">Arna&rsquo;s Journal</Link>
            <Link to="/chronicle">The Chronicle</Link>
            <Link to="/demo">See her think</Link>
            <a href="/#grows">She grows</a>
            <a href="https://www.tiktok.com/@thearnaproject" target="_blank" rel="noreferrer noopener">TikTok — @thearnaproject</a>
          </div>
          <div className="footer-col">
            <h4>Reach us</h4>
            <a href="mailto:info@easyfill.ai?subject=Arna%20waitlist">info@easyfill.ai</a>
            <a href="/#waitlist">Join waitlist</a>
            <a href="/#founders">Founders</a>
          </div>
        </div>
      </div>
      <div className="wrap footer-base">
        <p>© {new Date().getFullYear()} Arna AI — an EasyFill.ai project</p>
        <p className="footer-tag">thearnaproject.com · One mouth, one memory, one mind. No cloud required.</p>
      </div>
    </footer>
  );
}

export function Page({ children, transparentHeader = false }: { children: ReactNode; transparentHeader?: boolean }) {
  useScrollReveal();
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader transparentUntilScroll={transparentHeader} />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}

export function Section({
  id, eyebrow, kickerColor, children, className = "", alt = false,
}: {
  id?: string;
  eyebrow?: string;
  kickerColor?: "arna" | "mem" | "mind";
  children: ReactNode;
  className?: string;
  alt?: boolean;
}) {
  return (
    <section id={id} className={`section ${alt ? "section-alt" : ""} ${className}`}>
      <div className="wrap">
        {eyebrow ? (
          <p className={`kicker ${kickerColor ? `kicker-${kickerColor}` : ""}`}>{eyebrow}</p>
        ) : null}
        {children}
      </div>
    </section>
  );
}

export function PullQuote({ children }: { children: ReactNode }) {
  return <blockquote className="pull-quote">&ldquo;{children}&rdquo;</blockquote>;
}
