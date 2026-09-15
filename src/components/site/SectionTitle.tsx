import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionTitleProps extends Omit<HTMLMotionProps<"h2">, "initial" | "whileInView" | "transition" | "viewport"> {
  children: ReactNode;
}

/**
 * H2 section title with a subtle one-shot brightness reveal when entering the viewport.
 * Uses Playfair Display via the global h2 styling. No decorative gradient.
 */
const SectionTitle = ({ children, className, ...rest }: SectionTitleProps) => {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <h2 className={className}>
        {children}
      </h2>
    );
  }

  return (
    <motion.h2
      initial={{ opacity: 0, filter: "brightness(0.5)" }}
      whileInView={{ opacity: 1, filter: "brightness(1)" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, margin: "-80px" }}
      className={cn(className)}
      {...rest}
    >
      {children}
    </motion.h2>
  );
};

export default SectionTitle;
