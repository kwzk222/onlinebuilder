import React, { useEffect, useState } from 'react';

interface PriceCounterProps {
  value: number;
}

export const PriceCounter: React.FC<PriceCounterProps> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 400; // ms
    const startVal = displayValue;
    const endVal = value;

    if (startVal === endVal) return;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Cubic ease-out
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startVal + easeProgress * (endVal - startVal));

      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const animFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animFrame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span className="text-sm font-bold tracking-[0.2em] text-[#a39081] font-sans">
      ${displayValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}.00 USD
    </span>
  );
};
