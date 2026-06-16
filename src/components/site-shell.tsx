import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Menu, Phone, Search, ShieldCheck, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/constants";

const nav = [
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Blog", to: "/blog" },
  { label: "Resources", to: "/resources" },
  { label: "FAQs", to: "/faqs" },
  { label: "Contact", to: "/contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/88 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="Mindwell home">
          <span className="grid size-10 rotate-3 place-items-center rounded-2xl bg-primary text-primary-foreground"><Heart aria-hidden="true" /></span>
          <span><strong className="block font-display text-xl leading-none">Mindwell</strong><span className="text-[10px] font-bold uppercase tracking-[.18em] text-accent">Clinical Psychology</span></span>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
          {nav.map((item) => <Link key={item.to} to={item.to} className={pathname === item.to ? "text-sm font-semibold text-primary" : "text-sm font-medium text-muted-foreground hover:text-foreground"}>{item.label}</Link>)}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="ghost" size="icon" aria-label="Search" asChild><Link to="/search"><Search /></Link></Button>
          <Button variant="ghost" asChild><Link to="/auth">Sign in</Link></Button>
          <Button variant="hero" asChild><Link to="/book">Book appointment</Link></Button>
        </div>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
      </div>
      {open && <nav className="border-t border-border bg-background p-5 lg:hidden" aria-label="Mobile navigation"><div className="grid gap-2">{nav.map((item) => <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 font-medium hover:bg-secondary">{item.label}</Link>)}<Link to="/search" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 font-medium hover:bg-secondary">Search</Link><Link to="/auth" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 font-medium hover:bg-secondary">Sign in</Link><Button className="mt-2" asChild><Link to="/book">Book appointment</Link></Button></div></nav>}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-secondary text-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2 font-display text-xl"><Heart className="text-primary" aria-hidden="true" /> Mindwell</div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">Evidence-based psychological care in a safe, inclusive, and confidential space.</p>
          <p className="mt-4 text-xs text-muted-foreground">{SITE.address}</p>
        </div>
        <FooterColumn title="Get support">
          <Link to="/services">Our services</Link>
          <Link to="/about">Our approach</Link>
          <Link to="/book">Book a session</Link>
          <Link to="/contact">Contact us</Link>
        </FooterColumn>
        <FooterColumn title="Learn">
          <Link to="/blog">Blog</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/faqs">FAQs</Link>
          <Link to="/testimonials">Patient stories</Link>
        </FooterColumn>
        <FooterColumn title="Trust & safety">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/cookies">Cookies</Link>
          <Link to="/emergency" className="inline-flex items-center gap-2 font-semibold text-primary"><Phone className="size-4" aria-hidden="true" /> Emergency</Link>
        </FooterColumn>
      </div>
      <div className="border-t border-border px-5 py-6 text-center text-xs text-muted-foreground">
        <ShieldCheck className="mr-1 inline size-4" aria-hidden="true" /> Your privacy and confidentiality are central to our care. © {new Date().getFullYear()} {SITE.legalName}.
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-base">{title}</h2>
      <div className="mt-4 grid gap-2 text-sm text-muted-foreground [&_a:hover]:text-primary">{children}</div>
    </div>
  );
}

export function PublicLayout({ children }: { children: ReactNode }) { return <><SiteHeader /><main>{children}</main><SiteFooter /></>; }