import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

const ThankYou = () => {
  const reduce = useReducedMotion();

  const fadeUp = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: "easeOut" as const },
        };

  const iconPop = reduce
    ? {}
    : {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: 0.5, delay: 0.1, ease: "easeOut" as const },
      };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: "#F5F1EB" }}
    >
      <div className="w-full max-w-[480px] text-center">
        {/* Logo */}
        <motion.div {...fadeUp(0)} className="mb-12">
          <Link
            to="/"
            className="inline-block font-display"
            style={{
              fontWeight: 900,
              fontSize: "20px",
              color: "#1A1A1A",
              letterSpacing: "-0.02em",
            }}
          >
            Tony&apos;s <span style={{ color: "#C4291C" }}>Painting</span>
          </Link>
        </motion.div>

        {/* Confirmation icon */}
        <motion.div
          {...iconPop}
          className="mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{
            width: "56px",
            height: "56px",
            border: "1.5px solid #C4291C",
          }}
          aria-hidden="true"
        >
          <Check style={{ color: "#C4291C" }} size={26} strokeWidth={2} />
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.2)}
          className="font-display"
          style={{
            fontWeight: 900,
            fontSize: "40px",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#1A1A1A",
            marginBottom: "12px",
          }}
        >
          We got your request.
        </motion.h1>

        {/* Subline */}
        <motion.p
          {...fadeUp(0.3)}
          style={{
            fontSize: "16px",
            lineHeight: 1.7,
            color: "#6B6560",
            marginBottom: "32px",
          }}
        >
          Someone from our team will contact you within one business day to discuss your project.
        </motion.p>

        {/* Primary button */}
        <motion.div {...fadeUp(0.4)} className="mb-6">
          <Link
            to="/"
            className="inline-block transition-colors"
            style={{
              backgroundColor: "#C4291C",
              color: "#FFFFFF",
              padding: "12px 28px",
              borderRadius: "5px",
              fontSize: "15px",
              fontWeight: 500,
            }}
          >
            Back to Home
          </Link>
        </motion.div>

        {/* Phone line */}
        <motion.p
          {...fadeUp(0.5)}
          style={{ fontSize: "14px", color: "#6B6560" }}
        >
          Prefer to talk now?{" "}
          <a
            href="tel:+15089829675"
            style={{ color: "#C4291C", fontWeight: 500 }}
          >
            508 982 9675
          </a>
        </motion.p>

        {/* Separator */}
        <div
          aria-hidden="true"
          style={{
            width: "40px",
            height: "0.5px",
            backgroundColor: "#E8E2D8",
            margin: "32px auto",
          }}
        />

        {/* Google Review CTA hidden temporarily */}
        {/* <div style={{
          marginTop: '40px',
          padding: '32px',
          background: '#F5F1EB',
          borderRadius: '16px',
          border: '1px solid #E8E2D8',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '13px', color: '#6B6560', fontFamily: 'Inter', marginBottom: '8px' }}>
            While you wait for our response...
          </p>
          <h3 style={{
            fontFamily: \"'Playfair Display', serif\",
            fontWeight: 700,
            fontSize: '20px',
            color: '#1A1A1A',
            marginBottom: '16px',
          }}>
            Have you worked with us before?
          </h3>
          <a
            href=\"https://www.google.com/maps/place/?q=place_id:0x89e529970477bc27:0x3d37406d51e5cec&action=write-review\"
            target=\"_blank\"
            rel=\"noopener noreferrer\"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#C4291C',
              color: 'white',
              padding: '11px 24px',
              borderRadius: '8px',
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: '14px',
              textDecoration: 'none',
            }}
          >
            ⭐ Leave a Google Review
          </a>
        </div> */}

        {/* Microcopy */}
        <p style={{ fontSize: "12px", color: "#9CA3AF" }}>
          Tony&apos;s Painting has been serving New England since 2004.
        </p>

      </div>
    </main>
  );
};

export default ThankYou;
