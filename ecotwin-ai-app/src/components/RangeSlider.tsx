/**
 * RangeSlider.tsx
 * ───────────────
 * Accessible range input with ARIA attributes and a visual fill track.
 *
 * Accessibility features:
 *  - aria-label / htmlFor label association
 *  - aria-valuemin / aria-valuemax / aria-valuenow / aria-valuetext
 *  - aria-live region announces current value to screen readers
 *  - Visible focus state via browser default + CSS custom thumb
 */
import React from 'react';

interface RangeSliderProps {
  /** Visible label text and accessible name */
  label: string;
  /** Optional sub-label (e.g. "Days per week") */
  description?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  /** Unit appended to min/max labels (e.g. 'km', '%') */
  unit?: string;
  /** HTML id — required for label association */
  id: string;
  /** Custom display formatter. Falls back to `${value}${unit}` */
  formatValue?: (v: number) => string;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  label,
  description,
  min,
  max,
  step = 1,
  value,
  onChange,
  unit = '',
  id,
  formatValue,
}) => {
  const fillPercent = ((value - min) / (max - min)) * 100;
  const displayValue = formatValue ? formatValue(value) : `${value}${unit}`;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-end mb-4">
        <div>
          <label htmlFor={id} className="font-label-md text-label-md text-on-surface flex items-center gap-2">
            {label}
          </label>
          {description && (
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">{description}</p>
          )}
        </div>
        {/* aria-live so screen readers announce value changes */}
        <div
          className="font-headline-md text-headline-md text-secondary"
          aria-live="polite"
          aria-atomic="true"
        >
          {displayValue}
        </div>
      </div>

      <div className="relative w-full h-1 mt-2">
        {/* Visual fill track */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 h-1 bg-secondary rounded-full"
          style={{
            width: `${fillPercent}%`,
            boxShadow: '0 0 8px rgba(211,254,50,0.6)',
          }}
        />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={displayValue}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute top-[-10px] w-full cursor-pointer"
        />
      </div>

      <div className="flex justify-between mt-3 font-label-sm text-label-sm text-on-surface-variant/50">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};
