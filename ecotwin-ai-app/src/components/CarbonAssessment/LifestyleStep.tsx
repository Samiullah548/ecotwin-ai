import React from 'react';

interface LifestyleStepProps {
  shopping: string;
  recycling: string;
  setField: (key: 'shopping' | 'recycling', value: string) => void;
  onFinish: (e: React.FormEvent) => void;
  onBack: () => void;
  nextBtnClass: string;
  backBtnClass: string;
}

export const LifestyleStep: React.FC<LifestyleStepProps> = React.memo(({
  shopping,
  recycling,
  setField,
  onFinish,
  onBack,
  nextBtnClass,
  backBtnClass,
}) => {
  return (
    <form className="animate-fade-in" onSubmit={onFinish} aria-label="Lifestyle information">
      <div className="space-y-8">
        <fieldset>
          <legend className="font-label-md text-label-md text-on-surface mb-4 text-left">
            Shopping & Waste Habits
          </legend>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="shopping-freq"
                className="font-label-sm text-label-sm text-on-surface-variant block mb-2 text-left"
              >
                How often do you buy new clothes/electronics?
              </label>
              <select
                id="shopping-freq"
                className="w-full bg-surface border border-white/10 focus:border-tertiary focus:ring-0 text-on-surface rounded-lg px-4 py-3 font-body-md appearance-none text-left"
                required
                value={shopping}
                onChange={(e) => setField('shopping', e.target.value)}
              >
                <option disabled value="">
                  Select frequency...
                </option>
                <option value="frequent">Frequently (Monthly)</option>
                <option value="average">Average (Few times a year)</option>
                <option value="rare">Rarely (Only when necessary)</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="recycling-habit"
                className="font-label-sm text-label-sm text-on-surface-variant block mb-2 text-left"
              >
                Recycling & Composting
              </label>
              <select
                id="recycling-habit"
                className="w-full bg-surface border border-white/10 focus:border-tertiary focus:ring-0 text-on-surface rounded-lg px-4 py-3 font-body-md appearance-none text-left"
                required
                value={recycling}
                onChange={(e) => setField('recycling', e.target.value)}
              >
                <option disabled value="">
                  Select habit...
                </option>
                <option value="none">I don't recycle or compost much</option>
                <option value="some">I recycle basics (paper, plastic)</option>
                <option value="all">I recycle everything and compost</option>
              </select>
            </div>
          </div>
        </fieldset>
      </div>
      <div className="mt-8 flex justify-between">
        <button className={backBtnClass} onClick={onBack} type="button">
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
            arrow_back
          </span>{' '}
          Back
        </button>
        <button className={nextBtnClass} type="submit">
          Calculate{' '}
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
            magic_button
          </span>
        </button>
      </div>
    </form>
  );
});

LifestyleStep.displayName = 'LifestyleStep';
