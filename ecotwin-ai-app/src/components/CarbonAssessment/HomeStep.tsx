import React from 'react';

interface HomeStepProps {
  energy: string;
  homeSize: string;
  setField: (key: 'energy' | 'homeSize', value: string) => void;
  onNext: (e: React.FormEvent) => void;
  onBack: () => void;
  nextBtnClass: string;
  backBtnClass: string;
}

export const HomeStep: React.FC<HomeStepProps> = React.memo(({
  energy,
  homeSize,
  setField,
  onNext,
  onBack,
  nextBtnClass,
  backBtnClass,
}) => {
  return (
    <form className="animate-fade-in" onSubmit={onNext} aria-label="Home energy information">
      <div className="space-y-8">
        <fieldset>
          <legend className="font-label-md text-label-md text-on-surface mb-4 text-left">
            Primary Home Energy Source
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'gas', icon: 'local_fire_department', title: 'Natural Gas / Oil', cols: 1 },
              { id: 'electric', icon: 'bolt', title: 'Standard Grid Electric', cols: 1 },
              { id: 'renewable', icon: 'solar_power', title: '100% Renewable / Solar', cols: 2 },
            ].map((energyItem) => (
              <label
                key={energyItem.id}
                className={`block relative cursor-pointer ${energyItem.cols === 2 ? 'md:col-span-2' : ''}`}
              >
                <input
                  className="peer sr-only"
                  name="energy"
                  required
                  type="radio"
                  value={energyItem.id}
                  checked={energy === energyItem.id}
                  onChange={() => setField('energy', energyItem.id)}
                />
                <div
                  className={`radio-card border rounded-xl p-4 flex items-center gap-4 transition-all ${
                    energy === energyItem.id
                      ? 'border-secondary bg-secondary/5'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center" aria-hidden="true">
                    <span
                      className={`material-symbols-outlined transition-colors ${
                        energy === energyItem.id ? 'text-secondary' : 'text-on-surface-variant'
                      }`}
                    >
                      {energyItem.icon}
                    </span>
                  </div>
                  <div className="font-label-md text-label-md text-on-surface text-left">
                    {energyItem.title}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label
            htmlFor="home-size"
            className="flex items-center gap-2 font-label-md text-label-md text-on-surface mb-3 text-left"
          >
            Home Size (sq ft)
          </label>
          <input
            id="home-size"
            className="w-full bg-black/30 border border-white/10 focus:border-tertiary focus:ring-0 text-on-surface rounded-lg px-4 py-3 font-body-md transition-all"
            min="0"
            max="50000"
            placeholder="e.g., 1500"
            required
            type="number"
            value={homeSize}
            onChange={(e) => setField('homeSize', e.target.value)}
          />
        </div>
      </div>
      <div className="mt-8 flex justify-between">
        <button className={backBtnClass} onClick={onBack} type="button">
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
            arrow_back
          </span>{' '}
          Back
        </button>
        <button className={nextBtnClass} type="submit">
          Next{' '}
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
            arrow_forward
          </span>
        </button>
      </div>
    </form>
  );
});

HomeStep.displayName = 'HomeStep';
