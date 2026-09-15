import { useCallback, useRef, useState } from "react";

export interface BeforeAfterProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  className?: string;
}

/**
 * Draggable before and after comparison slider.
 * Keyboard accessible through the range input fallback.
 */
const BeforeAfter = ({ beforeSrc, afterSrc, beforeAlt, afterAlt, className }: BeforeAfterProps) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="relative w-full aspect-[4/5] md:aspect-[16/10] overflow-hidden bg-stone select-none touch-none"
        onPointerDown={(e) => {
          draggingRef.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          updateFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (draggingRef.current) updateFromClientX(e.clientX);
        }}
        onPointerUp={() => {
          draggingRef.current = false;
        }}
        onPointerCancel={() => {
          draggingRef.current = false;
        }}
      >
        <img
          src={afterSrc}
          alt={afterAlt}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            src={beforeSrc}
            alt={beforeAlt}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>

        <span className="absolute left-4 top-4 bg-dark/80 text-background text-[11px] uppercase tracking-[0.2em] px-3 py-1.5">
          Before
        </span>
        <span className="absolute right-4 top-4 bg-primary text-primary-foreground text-[11px] uppercase tracking-[0.2em] px-3 py-1.5">
          After
        </span>

        <div
          className="absolute top-0 bottom-0 w-[2px] bg-background pointer-events-none"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background border border-border flex items-center justify-center shadow-md">
            <span className="text-foreground text-xs tracking-widest">&#8596;</span>
          </div>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(position)}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-label="Compare before and after"
        className="mt-4 w-full accent-primary"
      />
    </div>
  );
};

export default BeforeAfter;
