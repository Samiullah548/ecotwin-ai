import React from 'react';

interface TransportStepProps {
  commute: string;
  distance: string;
  setField: (key: 'commute' | 'distance', value: string) => void;
  onNext: (e: React.FormEvent) => void;
  nextBtnClass: string;
}

export const TransportStep: React.FC<TransportStepProps> = React.memo(({
  commute,
  distance,
  setField,
  onNext,
  nextBtnClass,
}) => {
  return (
    <form className="animate-fade-in" onSubmit={onNext} aria-label="Transport information">
      <div className="space-y-8">
        <fieldset>
          <legend className="font-label-md text-label-md text-on-surface mb-4 text-left">
            Primary Commute Method
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'car_gas', icon: 'directions_car', title: 'Gas/Diesel Car', desc: 'Personal vehicle' },
              { id: 'ev', icon: 'electric_car', title: 'Electric Vehicle', desc: 'Battery or Hybrid' },
              { id: 'transit', icon: 'directions_transit', title: 'Public Transit', desc: 'Bus, train, subway' },
              { id: 'active', icon: 'pedal_bike', title: 'Active Transit', desc: 'Walking, cycling' },
            ].map((method) => (
              <label key={method.id} className="block relative cursor-pointer">
                <input
                  className="peer sr-only"
                  name="commute"
                  required
                  type="radio"
                  value={method.id}
                  checked={commute === method.id}
                  onChange={() => setField('commute', method.id)}
                />
                <div
                  className={`radio-card border hover:bg-white/5 rounded-xl p-4 flex items-center gap-4 transition-all ${
                    commute === method.id
                      ? 'border-secondary bg-secondary/5'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center" aria-hidden="true">
                    <span
                      className={`material-symbols-outlined transition-colors ${
                        commute === method.id ? 'text-secondary' : 'text-on-surface-variant'
                      }`}
                    >
                      {method.icon}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="font-label-md text-label-md text-on-surface text-left">
                      {method.title}
                    </div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant text-left">
                      {method.desc}
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label
            htmlFor="commute-distance"
            className="flex items-center gap-2 font-label-md text-label-md text-on-surface mb-3 text-left"
          >
            Weekly Commute Distance (km)
          </label>
          <input
            id="commute-distance"
            className="w-full bg-black/30 border border-white/10 focus:border-tertiary focus:ring-0 text-on-surface rounded-lg px-4 py-3 font-body-md transition-all"
            min="0"
            max="5000"
            placeholder="e.g., 50"
            required
            type="number"
            value={distance}
            onChange={(e) => setField('distance', e.target.value)}
          />
        </div>
      </div>
      <div className="mt-8 flex justify-end">
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

TransportStep.displayName = 'TransportStep';
