import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { AssessmentAnswers } from '../store/useStore';
import { calculateFootprint } from '../utils/carbonCalculations';

export const CarbonAssessment: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Use the store's AssessmentAnswers type directly — no local duplicate
  const [answers, setAnswers] = useState<Omit<AssessmentAnswers, 'completed'>>({
    commute: '',
    distance: '',
    energy: '',
    homeSize: '',
    diet: '',
    shopping: '',
    recycling: '',
  });

  const navigate = useNavigate();
  const {
    setCarbonFootprint,
    setEcoScore,
    updateLevel,
    setEmissionBreakdown,
    setAssessmentAnswers,
    setMonthlyProgress,
  } = useStore();

  /** Update a single answer field */
  const setField = (key: keyof typeof answers, val: string) =>
    setAnswers((prev) => ({ ...prev, [key]: val }));

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Run calculation off the main render cycle
    setTimeout(() => {
      const result = calculateFootprint(answers);

      setCarbonFootprint(result.footprint);
      setEcoScore(result.score);
      setEmissionBreakdown(result.breakdown);
      setAssessmentAnswers({ ...answers, completed: true });
      setMonthlyProgress(result.monthlyProgress);
      updateLevel();

      setLoading(false);
      navigate('/');
    }, 2500);
  };

  // ─── Step indicator ──────────────────────────────────────────────────────

  const renderIndicator = (num: number, label: string) => {
    let stateClass: string;
    let content: React.ReactNode;
    let labelClass: string;

    if (num < step) {
      stateClass = 'bg-primary text-on-primary';
      content = <span className="material-symbols-outlined text-[16px]" aria-hidden="true">check</span>;
      labelClass = 'text-primary';
    } else if (num === step) {
      stateClass = 'bg-secondary text-on-secondary shadow-[0_0_15px_rgba(211,254,50,0.4)]';
      content = num;
      labelClass = 'text-on-surface';
    } else {
      stateClass = 'bg-white/10 text-on-surface-variant';
      content = num;
      labelClass = 'text-on-surface-variant';
    }

    return (
      <div className="flex flex-col items-center gap-2 z-10 relative">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center font-label-md text-sm font-semibold transition-all duration-300 ${stateClass}`}
          aria-current={num === step ? 'step' : undefined}
        >
          {content}
        </div>
        <span className={`font-label-sm text-label-sm ${labelClass}`}>{label}</span>
      </div>
    );
  };

  // ─── Shared button styles ────────────────────────────────────────────────

  const nextBtnClass =
    'bg-secondary text-on-secondary shadow-[0_0_15px_rgba(211,254,50,0.3)] hover:shadow-[0_0_25px_rgba(211,254,50,0.5)] hover:-translate-y-0.5 px-8 py-3 rounded-lg font-label-md flex items-center gap-2 transition-all';
  const backBtnClass =
    'bg-white/5 border border-secondary text-on-surface hover:bg-secondary/10 px-6 py-3 rounded-lg font-label-md flex items-center gap-2 transition-all';

  return (
    <div className="flex-grow pt-12 pb-24 flex items-center justify-center min-h-full">
      <div
        className="w-full max-w-3xl bg-white/5 backdrop-blur-[40px] border border-white/15 border-t-white/25 border-l-white/25 rounded-2xl p-8 md:p-12 relative overflow-hidden"
        id="assessment-container"
      >
        {/* Background blob */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" aria-hidden="true" />

        {loading ? (
          /* Loading state */
          <div
            className="flex flex-col items-center justify-center py-12"
            id="loading-state"
            role="status"
            aria-live="polite"
            aria-label="Calculating your carbon footprint, please wait"
          >
            <div className="relative w-32 h-32 mb-8 flex items-center justify-center" aria-hidden="true">
              <span className="material-symbols-outlined text-secondary text-6xl animate-spin">autorenew</span>
            </div>
            <h1 className="font-headline-md text-headline-md text-on-surface mb-2">Calculating your footprint...</h1>
            <p className="font-body-md text-body-md text-on-surface-variant text-center max-w-sm">
              EcoTwin AI is analysing your data to construct your digital environmental twin.
            </p>
          </div>
        ) : (
          <>
            {/* Header & Progress */}
            <div className="mb-12 relative z-10" id="assessment-header">
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
                Carbon Assessment
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mb-8">
                Establish your baseline to generate your Climate Twin.
              </p>

              {/* Stepper */}
              <nav aria-label="Assessment progress" className="flex justify-between items-center mb-4 relative">
                <div className="absolute left-0 top-4 w-full h-1 bg-white/5 -z-10 rounded-full" aria-hidden="true" />
                <div
                  className="absolute left-0 top-4 h-1 bg-secondary -z-10 rounded-full transition-all duration-500"
                  style={{ width: `${(step - 1) * 33.33}%` }}
                  aria-hidden="true"
                />
                {renderIndicator(1, 'Transport')}
                {renderIndicator(2, 'Home')}
                {renderIndicator(3, 'Diet')}
                {renderIndicator(4, 'Lifestyle')}
              </nav>
            </div>

            {/* Forms Container */}
            <div className="relative z-10 min-h-[300px]">

              {/* Step 1: Transport */}
              {step === 1 && (
                <form className="animate-fade-in" onSubmit={handleNext} aria-label="Transport information">
                  <div className="space-y-8">
                    <fieldset>
                      <legend className="font-label-md text-label-md text-on-surface mb-4">Primary Commute Method</legend>
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
                              checked={answers.commute === method.id}
                              onChange={() => setField('commute', method.id)}
                            />
                            <div className={`radio-card border hover:bg-white/5 rounded-xl p-4 flex items-center gap-4 transition-all ${answers.commute === method.id ? 'border-secondary bg-secondary/5' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center" aria-hidden="true">
                                <span className={`material-symbols-outlined transition-colors ${answers.commute === method.id ? 'text-secondary' : 'text-on-surface-variant'}`}>{method.icon}</span>
                              </div>
                              <div>
                                <div className="font-label-md text-label-md text-on-surface">{method.title}</div>
                                <div className="font-label-sm text-label-sm text-on-surface-variant">{method.desc}</div>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    <div>
                      <label htmlFor="commute-distance" className="flex items-center gap-2 font-label-md text-label-md text-on-surface mb-3">
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
                        value={answers.distance}
                        onChange={(e) => setField('distance', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button className={nextBtnClass} type="submit">
                      Next <span className="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_forward</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2: Home */}
              {step === 2 && (
                <form className="animate-fade-in" onSubmit={handleNext} aria-label="Home energy information">
                  <div className="space-y-8">
                    <fieldset>
                      <legend className="font-label-md text-label-md text-on-surface mb-4">Primary Home Energy Source</legend>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { id: 'gas', icon: 'local_fire_department', title: 'Natural Gas / Oil', cols: 1 },
                          { id: 'electric', icon: 'bolt', title: 'Standard Grid Electric', cols: 1 },
                          { id: 'renewable', icon: 'solar_power', title: '100% Renewable / Solar', cols: 2 },
                        ].map((energy) => (
                          <label key={energy.id} className={`block relative cursor-pointer ${energy.cols === 2 ? 'md:col-span-2' : ''}`}>
                            <input
                              className="peer sr-only"
                              name="energy"
                              required
                              type="radio"
                              value={energy.id}
                              checked={answers.energy === energy.id}
                              onChange={() => setField('energy', energy.id)}
                            />
                            <div className={`radio-card border rounded-xl p-4 flex items-center gap-4 transition-all ${answers.energy === energy.id ? 'border-secondary bg-secondary/5' : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/5'}`}>
                              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center" aria-hidden="true">
                                <span className={`material-symbols-outlined transition-colors ${answers.energy === energy.id ? 'text-secondary' : 'text-on-surface-variant'}`}>{energy.icon}</span>
                              </div>
                              <div className="font-label-md text-label-md text-on-surface">{energy.title}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    <div>
                      <label htmlFor="home-size" className="flex items-center gap-2 font-label-md text-label-md text-on-surface mb-3">
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
                        value={answers.homeSize}
                        onChange={(e) => setField('homeSize', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mt-8 flex justify-between">
                    <button className={backBtnClass} onClick={handleBack} type="button">
                      <span className="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_back</span> Back
                    </button>
                    <button className={nextBtnClass} type="submit">
                      Next <span className="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_forward</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Diet */}
              {step === 3 && (
                <form className="animate-fade-in" onSubmit={handleNext} aria-label="Diet information">
                  <div className="space-y-8">
                    <fieldset>
                      <legend className="font-label-md text-label-md text-on-surface mb-4">Diet Type</legend>
                      <div className="space-y-3">
                        {[
                          { id: 'meat_heavy', icon: 'set_meal', title: 'Meat-Heavy', desc: 'Meat in most meals' },
                          { id: 'omnivore', icon: 'restaurant', title: 'Average Omnivore', desc: 'Meat 3–4 times a week' },
                          { id: 'vegetarian', icon: 'eco', title: 'Vegetarian / Vegan', desc: 'No meat, mostly plant-based' },
                        ].map((diet) => (
                          <label key={diet.id} className="block relative cursor-pointer">
                            <input
                              className="peer sr-only"
                              name="diet"
                              required
                              type="radio"
                              value={diet.id}
                              checked={answers.diet === diet.id}
                              onChange={() => setField('diet', diet.id)}
                            />
                            <div className={`radio-card border rounded-xl p-4 flex items-center gap-4 transition-all ${answers.diet === diet.id ? 'border-secondary bg-secondary/5' : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/5'}`}>
                              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center" aria-hidden="true">
                                <span className={`material-symbols-outlined transition-colors ${answers.diet === diet.id ? 'text-secondary' : 'text-on-surface-variant'}`}>{diet.icon}</span>
                              </div>
                              <div>
                                <div className="font-label-md text-label-md text-on-surface">{diet.title}</div>
                                <div className="font-label-sm text-label-sm text-on-surface-variant">{diet.desc}</div>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                  <div className="mt-8 flex justify-between">
                    <button className={backBtnClass} onClick={handleBack} type="button">
                      <span className="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_back</span> Back
                    </button>
                    <button className={nextBtnClass} type="submit">
                      Next <span className="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_forward</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Step 4: Lifestyle */}
              {step === 4 && (
                <form className="animate-fade-in" onSubmit={handleFinish} aria-label="Lifestyle information">
                  <div className="space-y-8">
                    <fieldset>
                      <legend className="font-label-md text-label-md text-on-surface mb-4">Shopping & Waste Habits</legend>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="shopping-freq" className="font-label-sm text-label-sm text-on-surface-variant block mb-2">
                            How often do you buy new clothes/electronics?
                          </label>
                          <select
                            id="shopping-freq"
                            className="w-full bg-surface border border-white/10 focus:border-tertiary focus:ring-0 text-on-surface rounded-lg px-4 py-3 font-body-md appearance-none"
                            required
                            value={answers.shopping}
                            onChange={(e) => setField('shopping', e.target.value)}
                          >
                            <option disabled value="">Select frequency...</option>
                            <option value="frequent">Frequently (Monthly)</option>
                            <option value="average">Average (Few times a year)</option>
                            <option value="rare">Rarely (Only when necessary)</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="recycling-habit" className="font-label-sm text-label-sm text-on-surface-variant block mb-2">
                            Recycling & Composting
                          </label>
                          <select
                            id="recycling-habit"
                            className="w-full bg-surface border border-white/10 focus:border-tertiary focus:ring-0 text-on-surface rounded-lg px-4 py-3 font-body-md appearance-none"
                            required
                            value={answers.recycling}
                            onChange={(e) => setField('recycling', e.target.value)}
                          >
                            <option disabled value="">Select habit...</option>
                            <option value="none">I don't recycle or compost much</option>
                            <option value="some">I recycle basics (paper, plastic)</option>
                            <option value="all">I recycle everything and compost</option>
                          </select>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                  <div className="mt-8 flex justify-between">
                    <button className={backBtnClass} onClick={handleBack} type="button">
                      <span className="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_back</span> Back
                    </button>
                    <button className={nextBtnClass} type="submit">
                      Calculate <span className="material-symbols-outlined text-[18px]" aria-hidden="true">magic_button</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
