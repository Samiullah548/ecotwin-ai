/**
 * ToggleSwitch.tsx
 * ────────────────
 * Accessible boolean toggle that replaces the 12+ ad-hoc toggle buttons
 * previously scattered across Settings.tsx.
 *
 * Accessibility features:
 *  - role="switch" so screen readers announce it as a toggle control
 *  - aria-checked reflects current state
 *  - aria-label taken from the label prop
 *  - Visible focus ring via focus-visible
 *  - Keyboard: Space and Enter activate the switch (native button behaviour)
 */
import React from 'react';

interface ToggleSwitchProps {
  /** Human-readable name shown in the UI and used as aria-label */
  label: string;
  /** Optional secondary description rendered below the label */
  description?: string;
  /** Current on/off state */
  checked: boolean;
  /** Called with the *new* boolean value whenever the user activates the switch */
  onChange: (next: boolean) => void;
  /** Optional HTML id — used to link aria-labelledby */
  id?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  description,
  checked,
  onChange,
  id,
}) => {
  const labelId = id ? `${id}-label` : undefined;

  return (
    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
      <div>
        <span
          id={labelId}
          className="font-label-md text-label-md text-on-surface block"
        >
          {label}
        </span>
        {description && (
          <span className="text-[10px] text-on-surface-variant">{description}</span>
        )}
      </div>

      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={checked}
        aria-labelledby={labelId}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`
          w-12 h-6 rounded-full transition-all relative
          focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary
          focus-visible:ring-offset-2 focus-visible:ring-offset-surface
          ${checked ? 'bg-secondary' : 'bg-white/10'}
        `}
      >
        {/* Thumb */}
        <div
          aria-hidden="true"
          className={`w-5 h-5 bg-[#0c1513] rounded-full absolute top-0.5 transition-all ${
            checked ? 'right-0.5' : 'left-0.5'
          }`}
        />
        {/* Screen-reader only state announcement */}
        <span className="sr-only">{checked ? 'enabled' : 'disabled'}</span>
      </button>
    </div>
  );
};
