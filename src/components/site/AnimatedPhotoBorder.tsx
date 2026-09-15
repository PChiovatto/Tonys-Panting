import { ReactNode, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface AnimatedPhotoBorderProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedPhotoBorder = ({ children, className, delay = 0 }: AnimatedPhotoBorderProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  const offset = 6;
  const stroke = 2.5;

  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      {/* Image layer */}
      <div className="relative w-full h-full overflow-hidden rounded-[4px]">
        {children}
      </div>

      {/* Animated border layer */}
      <svg
        className="pointer-events-none absolute"
        style={{
          top: -offset,
          left: -offset,
          width: `calc(100% + ${offset * 2}px)`,
          height: `calc(100% + ${offset * 2}px)`,
          zIndex: 2,
        }}
        aria-hidden="true"
      >
        <motion.rect
          x={stroke / 2}
          y={stroke / 2}
          width={`calc(100% - ${stroke}px)`}
          height={`calc(100% - ${stroke}px)`}
          rx={6}
          ry={6}
          fill="none"
          stroke="#C4291C"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
          animate={
            prefersReducedMotion
              ? { pathLength: 1 }
              : inView
              ? { pathLength: 1 }
              : { pathLength: 0 }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : {
                  duration: 2.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay,
                }
          }
        />
      </svg>
    </div>
  );
};

export default AnimatedPhotoBorder;
