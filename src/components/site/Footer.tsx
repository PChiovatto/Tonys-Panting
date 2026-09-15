import tonysLogo from "@/assets/tonys-logo.png";
import elenardiLogo from "@/assets/elenardi-midia-logo.png";
import { Instagram, Facebook } from "lucide-react";


const Footer = () => {
  return (
    <footer className="bg-dark border-t border-white/5">
      <div
        className="container py-12 md:py-16 footer-grid"
        style={{
          display: "grid",
          gap: 40,
          alignItems: "start",
        }}
      >
        <div>
          <a href="/" className="inline-block" aria-label="Tony's Remodeling home">
            <img
              src={tonysLogo}
              alt="Tony's Remodeling - Painting and Carpentry"
              className="h-[42px] md:h-[56px] w-auto object-contain"
            />
          </a>
          <p className="mt-4 text-sm text-background/60 max-w-xs leading-relaxed">
            Premium painting and remodeling, serving New England since 2004.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href="https://www.instagram.com/tonyspainting_remodeling/"
              target="_blank"
              rel="noopener noreferrer"
              title="Follow us on Instagram"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s',
                color: 'rgba(255,255,255,0.8)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://www.facebook.com/tonyspainting11"
              target="_blank"
              rel="noopener noreferrer"
              title="Follow us on Facebook"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s',
                color: 'rgba(255,255,255,0.8)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              <Facebook size={18} />
            </a>
            {/* Google Review link hidden temporarily */}
            {/* <a
              href=\"https://www.google.com/maps/place/?q=place_id:0x89e529970477bc27:0x3d37406d51e5cec&action=write-review\"
              target=\"_blank\"
              rel=\"noopener noreferrer\"
              title=\"Leave us a Google Review\"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\">
                <path d=\"M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z\" fill=\"#4285F4\"/>
                <path d=\"M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z\" fill=\"#34A853\"/>
                <path d=\"M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z\" fill=\"#FBBC05\"/>
                <path d=\"M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z\" fill=\"#EA4335\"/>
              </svg>
            </a> */}
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-background/50 mb-4">Explore</div>
          <ul className="space-y-2 text-sm">
            {[
              { label: "Services", href: "/services" },
              { label: "Portfolio", href: "/portfolio" },
              { label: "About", href: "/about" },
              { label: "Reviews", href: "/reviews" },
            ].map((l) => (
              <li key={l.label}>
                <a href={l.href} className="text-background/80 hover:text-primary transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-background/50 mb-4">Contact</div>
          <ul className="space-y-2 text-sm text-background/80">
            <li>11 Cook Rd, Vineyard Haven, MA 02568</li>
            <li>2 Williams Ave, Pocasset, MA</li>
            <li>240 W Center St, West Bridgewater, MA 02379</li>
            <li>
              <a href="mailto:Tonyspainting11@gmail.com" className="hover:text-primary transition-colors">
                Tonyspainting11@gmail.com
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-primary transition-colors">
                Request an estimate
              </a>
            </li>
          </ul>
        </div>

        {/* Map column */}
        <div className="footer-map-col">
          <div className="text-xs uppercase tracking-[0.2em] text-background/50 mb-4">
            Our Area
          </div>

          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "1 / 1",
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <iframe
              title="Tony's Painting service area map"
              src="https://www.google.com/maps?q=11+Cook+Rd,+Vineyard+Haven,+MA+02568&output=embed"
              width="100%"
              height="100%"
              style={{
                border: 0,
                display: "block",
                filter: "grayscale(100%) invert(92%) contrast(85%)",
              }}
              loading="lazy"
              allowFullScreen={false}
              referrerPolicy="no-referrer-when-downgrade"
            />

            <div
              style={{
                position: "absolute",
                bottom: "8px",
                left: "8px",
                right: "8px",
                background: "rgba(26,26,26,0.85)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                borderRadius: "6px",
                padding: "6px 10px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#C4291C",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "10px",
                  color: "#F5F1EB",
                  fontWeight: 500,
                }}
              >
                Martha's Vineyard, MA
              </span>
            </div>
          </div>

          <a
            href="https://maps.google.com/?q=11+Cook+Rd,+Vineyard+Haven,+MA+02568"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              marginTop: "10px",
              fontFamily: "Inter, sans-serif",
              fontSize: "11px",
              color: "#C4291C",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Get directions →
          </a>
        </div>
      </div>

      {/* Mapa mobile only */}
      <div
        className="footer-map-mobile"
        style={{
          display: "none",
          position: "relative",
          width: "100%",
          height: "120px",
          overflow: "hidden",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          opacity: 0.7,
        }}
      >
        <iframe
          title="Tony's Painting location"
          src="https://www.google.com/maps?q=11+Cook+Rd,+Vineyard+Haven,+MA+02568&output=embed"
          width="100%"
          height="100%"
          style={{
            border: 0,
            display: "block",
            filter: "grayscale(100%) invert(92%) contrast(85%)",
          }}
          loading="lazy"
          allowFullScreen={false}
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div
          style={{
            position: "absolute",
            bottom: "8px",
            left: "8px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <div
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "#C4291C",
            }}
          />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "10px",
              color: "rgba(245,241,235,0.70)",
              fontWeight: 500,
            }}
          >
            Martha's Vineyard, MA
          </span>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-background/50">
          <div>© {new Date().getFullYear()} Tony&apos;s Painting and Remodeling. All rights reserved.</div>
          <div>Built with care in New England.</div>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.04)',
        marginTop: '16px',
        paddingTop: '16px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        flexWrap: 'wrap',
      }}>
        <span style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.02em',
        }}>
          Website designed &amp; developed by
        </span>
        <a
          href="https://www.instagram.com/elenardimidia/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={elenardiLogo}
            alt="Elenardi Mídia"
            style={{
              height: '24px',
              width: 'auto',
              opacity: 1,
              transition: 'opacity 250ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          />
        </a>
      </div>

      <style>{`
        .footer-grid {
          grid-template-columns: 1fr;
        }
        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (min-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1.5fr 1fr 1fr 400px;
          }
          .footer-grid > div:nth-child(2),
          .footer-grid > div:nth-child(3) {
            justify-self: end;
          }
        }
        @media (max-width: 767px) {
          .footer-map-col { display: none; }
          .footer-map-mobile { display: block !important; }
        }
      `}</style>

    </footer>
  );
};

export default Footer;
