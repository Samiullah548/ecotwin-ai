import React from 'react';

interface DietStepProps {
  diet: string;
  setField: (key: 'diet', value: string) => void;
  onNext: (e: React.FormEvent) => void;
  onBack: () => void;
  nextBtnClass: string;
  backBtnClass: string;
}

export const DietStep: React.FC<DietStepProps> = React.memo(({
  diet,
  setField,
  onNext,
  onBack,
  nextBtnClass,
  backBtnClass,
}) => {
  return (
    <form className="animate-fade-in" onSubmit={onNext} aria-label="Diet information">
      <div className="space-y-8">
        <fieldset>
          <legend className="font-label-md text-label-md text-on-surface mb-4 text-left">Diet Type</legend>
          <div className="space-y-3">
            {[
              { id: 'meat_heavy', icon: 'set_meal', title: 'Meat-Heavy', desc: 'Meat in most meals' },
              { id: 'omnivore', icon: 'restaurant', title: 'Average Omnivore', desc: 'Meat 3–4 times a week' },
              { id: 'vegetarian', icon: 'eco', title: 'Vegetarian / Vegan', desc: 'No meat, mostly plant-based' },
            ].map((dietItem) => (
              <label key={dietItem.id} className="block relative cursor-pointer">
                <input
                  className="peer sr-only"
                  name="diet"
                  required
                  type="radio"
                  value={dietItem.id}
                  checked={diet === dietItem.id}
                  onChange={() => setField('diet', dietItem.id)}
                />
                <div
                  className={`radio-card border rounded-xl p-4 flex items-center gap-4 transition-all ${
                    diet === dietItem.id
                      ? 'border-secondary bg-secondary/5'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center" aria-hidden="true">
                    <span
                      className={`material-symbols-outlined transition-colors ${
                        diet === dietItem.id ? 'text-secondary' : 'text-on-surface-variant'
                      }`}
                    >
                      {dietItem.icon}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="font-label-md text-label-md text-on-surface text-left">
                      {dietItem.title}
                    </div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant text-left">
                      {dietItem.desc}
                    </div>
                  </div>
                </div>
              </label>
            ))}
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
          Next{' '}
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
            arrow_forward
          </span>
        </button>
      </div>
    </form>
  );
});

DietStep.displayName = 'DietStep';
