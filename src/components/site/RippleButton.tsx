import { forwardRef, MouseEvent, useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

let rippleId = 0;

const RippleButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const [ripples, setRipples] = useState<Ripple[]>([]);

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!reduce) {
        const target = e.currentTarget.getBoundingClientRect();
        const size = Math.max(target.width, target.height);
        const x = e.clientX - target.left - size / 2;
        const y = e.clientY - target.top - size / 2;
        const id = ++rippleId;
        setRipples((prev) => [...prev, { id, x, y, size }]);
        window.setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 550);
      }

      onClick?.(e);
    };

    return (
      <Button
        ref={ref}
        onClick={handleClick}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        {children}
        {ripples.map((r) => (
          <span
            key={r.id}
            aria-hidden
            className="pointer-events-none absolute rounded-full animate-ripple"
            style={{
              left: r.x,
              top: r.y,
              width: r.size,
              height: r.size,
              backgroundColor: "rgba(255, 255, 255, 0.4)",
            }}
          />
        ))}
      </Button>
    );
  },
);

RippleButton.displayName = "RippleButton";

export default RippleButton;
