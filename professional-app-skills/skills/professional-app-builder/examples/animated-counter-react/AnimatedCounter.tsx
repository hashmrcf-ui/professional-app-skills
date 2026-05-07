import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * AnimatedCounter — React implementation
 *
 * A drop-in component that animates from 0 to {value} over {duration} ms.
 * Use this for ALL numeric displays in the app.
 *
 * Usage:
 *   <AnimatedCounter value={1234} />
 *   <AnimatedCounter value={99} duration={600} />
 *   <AnimatedCounter value={1500} prefix="$" suffix="+" />
 */
export function AnimatedCounter({
  value,
  duration = 1000,
  prefix = '',
  suffix = '',
  className,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = null;
    startValueRef.current = displayValue;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = Math.floor(
        startValueRef.current + (value - startValueRef.current) * eased
      );
      setDisplayValue(current);

      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayValue(value);
      }
    };

    rafIdRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}
