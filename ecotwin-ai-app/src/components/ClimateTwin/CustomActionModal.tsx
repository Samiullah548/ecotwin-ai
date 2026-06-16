import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { clampNumber, sanitizeText } from '../../utils/sanitize';

interface CustomActionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (activity: { label: string; icon: string; saved: number; waterSaved: number; color: string }) => void;
}

const CUSTOM_ICONS = [
  { value: 'eco',           label: 'Eco Pip'             },
  { value: 'recycling',     label: 'Recycling'           },
  { value: 'water_drop',    label: 'Water Drop'          },
  { value: 'lightbulb',     label: 'Energy Saving'       },
  { value: 'shopping_bag',  label: 'Sustainable Shopping'},
  { value: 'forest',        label: 'Tree Planting'       },
];

export const CustomActionModal: React.FC<CustomActionModalProps> = React.memo(({
  open,
  onClose,
  onSubmit,
}) => {
  const [customLabel, setCustomLabel] = useState('');
  const [customSaved, setCustomSaved] = useState('');
  const [customWater, setCustomWater] = useState('');
  const [customIcon, setCustomIcon] = useState('eco');
  const [customError, setCustomError] = useState('');

  // Reset state when modal is closed or opened
  useEffect(() => {
    if (!open) {
      setCustomLabel('');
      setCustomSaved('');
      setCustomWater('');
      setCustomIcon('eco');
      setCustomError('');
    }
  }, [open]);

  const handleCustomSubmit = () => {
    const trimmedLabel = customLabel.trim();
    if (!trimmedLabel) {
      setCustomError('Please enter an action name.');
      return;
    }
    // Security: clamp numeric inputs to reasonable bounds
    const savedVal = clampNumber(customSaved, 0, 1000);
    const waterVal = clampNumber(customWater, 0, 100000);
    if (isNaN(savedVal) || customSaved === '') {
      setCustomError('Please enter a valid CO₂ saved value (0–1000 kg).');
      return;
    }
    if (isNaN(waterVal) || customWater === '') {
      setCustomError('Please enter a valid water conserved value (0–100 000 L).');
      return;
    }

    // Sanitize the label text before storing
    onSubmit({
      label: sanitizeText(trimmedLabel),
      icon: customIcon,
      saved: savedVal,
      waterSaved: waterVal,
      color: 'primary',
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Log Custom Action"
      id="custom-action-modal"
    >
      <p className="font-body-sm text-on-surface-variant text-sm mb-4 text-left">
        Enter details of your sustainable action to sync with your Climate Twin.
      </p>

      <div className="space-y-3">
        <div>
          <label
            htmlFor="custom-label"
            className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1 text-left"
          >
            Action Name
          </label>
          <input
            id="custom-label"
            type="text"
            maxLength={120}
            className="w-full bg-black/40 border border-white/10 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg px-3 py-2 text-on-surface font-body-md outline-none"
            placeholder="e.g. Recycled paper"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="custom-co2"
              className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1 text-left"
            >
              CO₂ Saved (kg)
            </label>
            <input
              id="custom-co2"
              type="number"
              step="0.1"
              min="0"
              max="1000"
              className="w-full bg-black/40 border border-white/10 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg px-3 py-2 text-on-surface font-body-md outline-none"
              placeholder="e.g. 1.5"
              value={customSaved}
              onChange={(e) => setCustomSaved(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="custom-water"
              className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1 text-left"
            >
              Water Conserved (L)
            </label>
            <input
              id="custom-water"
              type="number"
              min="0"
              max="100000"
              className="w-full bg-black/40 border border-white/10 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg px-3 py-2 text-on-surface font-body-md outline-none"
              placeholder="e.g. 50"
              value={customWater}
              onChange={(e) => setCustomWater(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="custom-icon-select"
            className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1 text-left"
          >
            Icon Category
          </label>
          <select
            id="custom-icon-select"
            className="w-full bg-black/40 border border-white/10 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg px-3 py-2 text-on-surface font-body-md outline-none"
            value={customIcon}
            onChange={(e) => setCustomIcon(e.target.value)}
          >
            {CUSTOM_ICONS.map((icon) => (
              <option key={icon.value} value={icon.value}>
                {icon.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {customError && (
        <p className="text-xs text-red-400 font-semibold flex items-center gap-1 mt-3" role="alert">
          <span className="material-symbols-outlined text-sm" aria-hidden="true">
            error
          </span>
          {customError}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="bg-transparent border border-white/10 text-on-surface font-label-md text-label-md px-4 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleCustomSubmit}
          className="bg-secondary text-on-secondary font-label-md text-label-md px-5 py-2.5 rounded-lg hover:bg-secondary-fixed-dim transition-colors glow-secondary"
        >
          Log Action
        </button>
      </div>
    </Modal>
  );
});

CustomActionModal.displayName = 'CustomActionModal';
