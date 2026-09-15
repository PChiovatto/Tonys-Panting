import { useDialogFocus } from "@/hooks/useDialogFocus";
import { useEffect, useState, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import tonysLogo from "@/assets/tonys-logo.png";

const services = [
  { label: "Interior Painting", href: "/services/interior-painting" },
  { label: "Exterior Painting", href: "/services/exterior-painting" },
  { label: "Remodeling", href: "/services/remodeling" },
  { label: "Deck and Stairs", href: "/services/deck-stairs" },
  { label: "Construction Cleaning", href: "/services/construction-cleaning" },
  { label: "General Carpentry", href: "/services/carpentry" },
  { label: "Finish Carpentry", href: "/services/finish-carpentry" },
  { label: "Flooring", href: "/services/flooring" },
  { label: "Ceramic Tile", href: "/services/ceramic-tile" },
  { label: "Fence", href: "/services/fence" },
  { label: "Plastering", href: "/services/plastering" },
  { label: "Countertop", href: "/services/countertop" },
].sort((a, b) => a.label.localeCompare(b.label, "en"));

const serviceGroups = [
  { title: "Painting", slugs: ["exterior-painting", "interior-painting", "plastering"] },
  { title: "Carpentry", slugs: ["deck-stairs", "fence", "finish-carpentry", "carpentry"] },
  { title: "Remodeling & Finishes", slugs: ["ceramic-tile", "construction-cleaning", "countertop", "flooring", "remodeling"] },
].map((group) => ({
  title: group.title,
  services: services.filter((service) => group.slugs.includes(service.href.split("/").pop()!)),
}));

const navLinks = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useDialogFocus(open, menuRef, () => setOpen(false), toggleRef);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [location.pathname]);



  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const solid = !isHome || scrolled || open;

  const mobileLinks = [{ label: "Services", href: "/services" }, ...navLinks];

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out border-b",
          solid
            ? "bg-[#2A2A28] border-white/5 shadow-[0_2px_20px_rgba(0,0,0,0.15)]"
            : "bg-transparent border-transparent shadow-none",
        )}
      >
        <nav className="container flex h-16 md:h-20 items-center justify-between">
          <div className="flex-1 flex justify-start">
            <a href="/" className="flex items-center" aria-label="Tony's Remodeling home">
              <img
                src={tonysLogo}
                alt="Tony's Remodeling - Painting and Carpentry"
                className="h-[46px] md:h-[56px] w-auto object-contain"
              />
            </a>
          </div>

          <ul className="hidden lg:flex flex-1 items-center justify-center gap-8">
            <li
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
              onFocus={() => setServicesOpen(true)}
              onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setServicesOpen(false); }}
              onKeyDown={(event) => { if (event.key === "Escape") setServicesOpen(false); }}
            >
              <a
                href="/services"
                className="flex items-center gap-1 text-sm font-medium text-white hover:opacity-70 transition-all duration-200 py-2"
              >
                Services
                <ChevronDown
                  size={14}
                  className={cn("transition-transform duration-200", servicesOpen && "rotate-180")}
                />
              </a>
              <div
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 top-full pt-2 transition-all duration-200",
                  servicesOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-1 pointer-events-none",
                )}
              >
                <div className="grid w-[680px] grid-cols-3 gap-4 rounded-sm border border-white/10 bg-[#2A2A28] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
                  {serviceGroups.map((group) => (
                    <section key={group.title} aria-label={group.title}>
                      <h2 className="mb-2 border-b border-white/15 pb-3 text-xs font-semibold uppercase tracking-wider text-white">{group.title}</h2>
                      <ul className="space-y-1">
                        {group.services.map((service) => (
                          <li key={service.href}>
                            <a href={service.href} className="flex min-h-11 items-center rounded px-2 py-2 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                              {service.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </div>
            </li>

            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm font-medium text-white hover:opacity-70 transition-all duration-200"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex flex-1 justify-end">
            <a
              href="/contact"
              className="group inline-flex items-center gap-2 bg-primary text-white hover:bg-primary-dark rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200"
            >
              Request a Consultation
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          </div>

        </nav>
      </header>

      {/* Hamburger/X mobile - acima do overlay */}
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        ref={toggleRef}
        onClick={() => setOpen((v) => !v)}
        className="flex lg:!hidden"
        style={{
          position: "fixed",
          top: "14px",
          right: "20px",
          zIndex: 110,
          background: "none",
          border: "none",
          padding: "8px",
          cursor: "pointer",
          color: "white",
          display: "flex",
        }}
      >
        {open ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* MOBILE MENU - fora do header */}
      <div
        id="mobile-navigation"
        ref={menuRef}
        role="dialog"
        aria-modal={open || undefined}
        aria-label="Navigation menu"
        className="flex lg:!hidden"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          background: "#2A2A28",
          opacity: open ? 1 : 0,
          visibility: open ? "visible" : "hidden",
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.25s ease, visibility 0.25s ease",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 40px",
        }}
      >
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {mobileLinks.map((l) => {
            const isServices = l.label === "Services";
            const linkBaseStyle = {
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400 as const,
              fontSize: "22px",
              letterSpacing: "-0.01em",
              color: "rgba(255,255,255,0.92)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 0",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              background: "none",
              border: "none",
              borderBottomWidth: "1px",
              borderBottomStyle: "solid" as const,
              borderBottomColor: "rgba(255,255,255,0.08)",
              width: "100%",
              cursor: "pointer" as const,
              textAlign: "left" as const,
            };

            if (isServices) {
              return (
                <li key={l.href}>
                  <button
                    type="button"
                    onClick={() => setMobileServicesOpen((v) => !v)}
                    aria-expanded={mobileServicesOpen}
                    style={linkBaseStyle}
                  >
                    <span>Services</span>
                    <ChevronDown
                      size={18}
                      style={{
                        transition: "transform 0.2s ease",
                        transform: mobileServicesOpen ? "rotate(180deg)" : "rotate(0deg)",
                        opacity: 0.7,
                      }}
                    />
                  </button>
                  <div
                    style={{
                      maxHeight: mobileServicesOpen ? "60vh" : "0",
                      visibility: mobileServicesOpen ? "visible" : "hidden",
                      overflow: "hidden",
                      overflowY: mobileServicesOpen ? "auto" : "hidden",
                      transition: "max-height 0.3s ease",
                    }}
                  >
                    <ul style={{ listStyle: "none", padding: "8px 0 12px 16px", margin: 0 }}>
                      <li>
                        <a
                          href="/services"
                          onClick={() => setOpen(false)}
                          style={{
                            display: "block",
                            padding: "10px 0",
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 500,
                            fontSize: "14px",
                            color: "#C4291C",
                            textDecoration: "none",
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                          }}
                        >
                          All Services
                        </a>
                      </li>
                      {serviceGroups.map((group) => (
                        <li key={group.title} className="mt-5">
                          <h3 className="mb-2 border-b border-white/15 pb-2 text-xs font-semibold uppercase tracking-wider text-white">{group.title}</h3>
                          <ul className="list-none p-0">
                            {group.services.map((service) => (
                              <li key={service.href}>
                                <a href={service.href} onClick={() => setOpen(false)} className="flex min-h-11 items-center py-2 text-[15px] text-white/80 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                                  {service.label}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            }

            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: "22px",
                    letterSpacing: "-0.01em",
                    color: "rgba(255,255,255,0.92)",
                    textDecoration: "none",
                    display: "block",
                    padding: "14px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>

        <a
          href="/contact"
          onClick={() => setOpen(false)}
          style={{
            marginTop: "32px",
            alignSelf: "flex-start",
            color: "#C4291C",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: "14px",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          Request a Consultation →
        </a>
      </div>
    </>
  );
};

export default Navbar;
