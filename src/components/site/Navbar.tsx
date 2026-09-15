import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import tonysLogo from "@/assets/tonys-logo.png";

const services = [
  { label: "Interior Painting", href: "/services/interior-painting" },
  { label: "Exterior Painting", href: "/services/exterior-painting" },
  { label: "Remodeling", href: "/services/remodeling" },
  { label: "Handyman Services", href: "/services/handyman" },
  { label: "Deck and Stairs", href: "/services/deck-stairs" },
  { label: "Construction Cleaning", href: "/services/construction-cleaning" },
  { label: "General Carpentry", href: "/services/carpentry" },
  { label: "Flooring", href: "/services/flooring" },
  { label: "Ceramic Tile", href: "/services/ceramic-tile" },
  { label: "Fence", href: "/services/fence" },
  { label: "Plastering", href: "/services/plastering" },
  { label: "Countertop", href: "/services/countertop" },
];

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
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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

          <ul className="hidden md:flex flex-1 items-center justify-center gap-8">
            <li
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
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
                <div className="bg-[#2A2A28] border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)] rounded-sm grid grid-cols-2 gap-x-2 py-3 min-w-[460px]">
                  {services.map((s) => (
                    <a
                      key={s.href}
                      href={s.href}
                      className="block px-5 py-2 text-sm text-white/80 hover:text-primary hover:bg-white/5 transition-colors whitespace-nowrap"
                    >
                      {s.label}
                    </a>
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

          <div className="hidden md:flex flex-1 justify-end">
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
        aria-label="Toggle menu"
        onClick={() => setOpen((v) => !v)}
        className="md:hidden"
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
        className="md:hidden"
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
                      {services.map((s) => (
                        <li key={s.href}>
                          <a
                            href={s.href}
                            onClick={() => setOpen(false)}
                            style={{
                              display: "block",
                              padding: "10px 0",
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 400,
                              fontSize: "15px",
                              color: "rgba(255,255,255,0.7)",
                              textDecoration: "none",
                            }}
                          >
                            {s.label}
                          </a>
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
