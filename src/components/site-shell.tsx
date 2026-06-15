import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Menu, Phone, ShieldCheck, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

const nav = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Resources", to: "/resources" },
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
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {nav.map((item) => <Link key={item.to} to={item.to} className={pathname === item.to ? "text-sm font-semibold text-primary" : "text-sm font-medium text-muted-foreground hover:text-foreground"}>{item.label}</Link>)}
        </nav>
        <div className="hidden items-center gap-3 lg:flex"><Button variant="ghost" asChild><Link to="/auth">Sign in</Link></Button><Button variant="hero" asChild><Link to="/book">Book appointment</Link></Button></div>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
      </div>
      {open && <nav className="border-t border-border bg-background p-5 lg:hidden" aria-label="Mobile navigation"><div className="grid gap-2">{nav.map((item) => <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 font-medium hover:bg-secondary">{item.label}</Link>)}<Button className="mt-2" asChild><Link to="/book">Book appointment</Link></Button></div></nav>}
    </header>
  );
}

export function SiteFooter() {
    return <footer className="border-t border-border/50 bg-secondary text-foreground"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3 lg:px-8"><div><div className="flex items-center gap-2 font-display text-xl"><Heart className="text-primary" /> Mindwell</div><p className="mt-4 max-w-sm text-sm text-muted-foreground">Evidence-based psychological care in a safe, inclusive, and confidential space.</p></div><div><h2 className="font-display text-base">Get support</h2><div className="mt-4 grid gap-2 text-sm text-muted-foreground"><Link to="/services">Our services</Link><Link to="/resources">Resources</Link><Link to="/contact">Contact us</Link></div></div><div><h2 className="font-display text-base">Need urgent help?</h2><p className="mt-4 text-sm text-muted-foreground">If you are in immediate danger, call your local emergency number.</p><Link to="/emergency" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary"><Phone className="size-4" /> Emergency resources</Link></div></div><div className="border-t border-border px-5 py-6 text-center text-xs text-muted-foreground"><ShieldCheck className="mr-1 inline size-4" /> Your privacy and confidentiality are central to our care.</div></footer>;
}

export function PublicLayout({ children }: { children: ReactNode }) { return <><SiteHeader /><main>{children}</main><SiteFooter /></>; }