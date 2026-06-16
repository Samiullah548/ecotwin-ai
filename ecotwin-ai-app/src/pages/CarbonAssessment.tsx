import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { AssessmentAnswers } from '../store/useStore';
import { calculateFootprint } from '../utils/carbonCalculations';
import { TransportStep } from '../components/CarbonAssessment/TransportStep';
import { HomeStep } from '../components/CarbonAssessment/HomeStep';
import { DietStep } from '../components/CarbonAssessment/DietStep';
import { LifestyleStep } from '../components/CarbonAssessment/LifestyleStep';

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
  const setField = (key: keyof typeof answers, value: string) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

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
              {step === 1 && (
                <TransportStep
                  commute={answers.commute}
                  distance={answers.distance}
                  setField={setField}
                  onNext={handleNext}
                  nextBtnClass={nextBtnClass}
                />
              )}

              {step === 2 && (
                <HomeStep
                  energy={answers.energy}
                  homeSize={answers.homeSize}
                  setField={setField}
                  onNext={handleNext}
                  onBack={handleBack}
                  nextBtnClass={nextBtnClass}
                  backBtnClass={backBtnClass}
                />
              )}

              {step === 3 && (
                <DietStep
                  diet={answers.diet}
                  setField={setField}
                  onNext={handleNext}
                  onBack={handleBack}
                  nextBtnClass={nextBtnClass}
                  backBtnClass={backBtnClass}
                />
              )}

              {step === 4 && (
                <LifestyleStep
                  shopping={answers.shopping}
                  recycling={answers.recycling}
                  setField={setField}
                  onFinish={handleFinish}
                  onBack={handleBack}
                  nextBtnClass={nextBtnClass}
                  backBtnClass={backBtnClass}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
