import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { RangeSlider } from '../components/RangeSlider';

export const WhatIfSimulator: React.FC = () => {
  const [wfh, setWfh] = useState(2);
  const [meat, setMeat] = useState(14);
  const [flights, setFlights] = useState(4);
  const navigate = useNavigate();
  const { setCarbonFootprint, setEcoScore, updateLevel } = useStore();

  const BASELINE_TOTAL = 14.2;

  const { displayReduction, newTotal, treesSaved, savings, targetRotation } = useMemo(() => {
    const wfhReduction    = (wfh - 1) * 0.2;          // baseline 1 day WFH
    const meatReduction   = (14 - meat) * 0.15;        // baseline 14 meals
    const flightReduction = (4 - flights) * 0.4;       // baseline 4 flights

    const totalReduction  = wfhReduction + meatReduction + flightReduction;
    const displayReduction = totalReduction > 0 ? totalReduction : 0;
    const newTotal        = BASELINE_TOTAL - totalReduction;

    const treesSaved  = Math.round(displayReduction * 50);
    const savings     = Math.round(displayReduction * 180);

    const MAX_REDUCTION_SCALE = 6;
    const fillPercentage = Math.min(Math.max(displayReduction / MAX_REDUCTION_SCALE, 0), 1);
    const targetRotation = -45 + fillPercentage * 180;

    return { totalReduction, displayReduction, newTotal, treesSaved, savings, targetRotation };
  }, [wfh, meat, flights]);

  return (
    <div className="w-full flex flex-col relative z-10 min-h-full">
      <div className="w-full max-w-container-max mx-auto flex-1 flex flex-col gap-8">

        {/* Page Header — h1 as primary heading */}
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-secondary">
            <span className="material-symbols-outlined" aria-hidden="true">science</span>
            <span className="font-label-md text-label-md tracking-wider uppercase">Scenario Modeling</span>
          </div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold">
            What-If Simulator
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-2">
            Adjust your lifestyle variables below to instantly visualise your potential carbon reduction and its real-world environmental equivalent.
          </p>
        </header>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mt-4">

          {/* Left Column: Input Sliders */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="glass-panel rounded-2xl p-8 relative overflow-hidden group border border-white/5 bg-surface-container-low/80 backdrop-blur-2xl">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-white/20 to-transparent" aria-hidden="true" />
              <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-white/20 to-transparent" aria-hidden="true" />

              <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                <span className="material-symbols-outlined text-primary" aria-hidden="true">tune</span>
                <h2 className="font-headline-md text-headline-md text-primary">Habit Variables</h2>
              </div>

              {/* Accessible RangeSlider components */}
              <RangeSlider
                id="wfh-slider"
                label="Remote Work"
                description="Days per week"
                min={0}
                max={5}
                value={wfh}
                onChange={setWfh}
                formatValue={(v) => `${v} day${v !== 1 ? 's' : ''}`}
              />

              <RangeSlider
                id="meat-slider"
                label="Meat Consumption"
                description="Meals per week"
                min={0}
                max={21}
                value={meat}
                onChange={setMeat}
                formatValue={(v) => `${v} meal${v !== 1 ? 's' : ''}`}
              />

              <RangeSlider
                id="flights-slider"
                label="Flight Frequency"
                description="Short-haul flights per year"
                min={0}
                max={10}
                value={flights}
                onChange={setFlights}
                formatValue={(v) => v === 10 ? '10+' : `${v}`}
              />
            </div>
          </div>

          {/* Right Column: Visualization & Outputs */}
          <div className="lg:col-span-7 flex flex-col gap-6">

            {/* Gauge & Key Stats */}
            <div className="glass-panel rounded-2xl p-8 relative flex flex-col items-center justify-center min-h-[300px] border border-white/5 bg-surface-container-low/80 backdrop-blur-2xl">

              {/* Carbon Gauge (decorative) */}
              <div className="relative w-64 h-32 overflow-hidden mb-6" aria-hidden="true">
                <div className="absolute top-0 left-0 w-64 h-64 rounded-full border-[12px] border-surface-variant opacity-50 border-b-transparent border-r-transparent transform -rotate-45" />
                <div
                  className="absolute top-0 left-0 w-64 h-64 rounded-full border-[12px] border-tertiary border-b-transparent border-r-transparent transform -rotate-45"
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)',
                    filter: "drop-shadow(0 0 12px theme('colors.tertiary'))",
                    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: `rotate(${targetRotation}deg)`,
                  }}
                />
                <div className="absolute bottom-0 left-0 w-full text-center flex flex-col items-center">
                  <span className="font-label-sm text-label-sm text-tertiary tracking-widest uppercase mb-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">arrow_downward</span> Projected Reduction
                  </span>
                  <div className="font-display-lg text-display-lg text-on-surface flex items-baseline gap-1" style={{ textShadow: '0 0 20px rgba(175, 198, 255, 0.3)' }}>
                    <span>{displayReduction.toFixed(1)}</span>
                    <span className="font-headline-md text-headline-md text-on-surface-variant">t</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">CO2e / Year</span>
                </div>
              </div>

              {/* Screen-reader accessible summary */}
              <p className="sr-only" aria-live="polite" aria-atomic="true">
                Projected reduction: {displayReduction.toFixed(1)} tonnes CO₂ per year.
                Equivalent to {treesSaved} trees saved and ${savings} in annual savings.
              </p>

              {/* Metric Cards */}
              <div className="grid grid-cols-2 gap-4 w-full mt-6 border-t border-white/5 pt-6">
                <div className="flex flex-col items-center text-center p-4 rounded-xl bg-surface/30">
                  <span className="material-symbols-outlined text-secondary mb-2" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">park</span>
                  <span className="font-headline-md text-headline-md text-on-surface">{treesSaved}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Trees Equivalent Saved</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-xl bg-surface/30">
                  <span className="material-symbols-outlined text-primary mb-2" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">savings</span>
                  <span className="font-headline-md text-headline-md text-on-surface">${savings}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Est. Annual Savings</span>
                </div>
              </div>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Baseline */}
              <div className="rounded-2xl p-6 border-dashed border border-outline-variant/30 bg-surface-container-lowest/50 opacity-80 backdrop-blur-md">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Current Baseline</h3>
                  <span className="material-symbols-outlined text-on-surface-variant" aria-hidden="true">person</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">{BASELINE_TOTAL.toFixed(1)}t</span>
                  <span className="font-body-sm text-body-md text-on-surface-variant">Total Footprint (CO2e)</span>
                </div>
              </div>

              {/* Simulated Future */}
              <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group border border-white/5 bg-surface-container-low/80 backdrop-blur-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-50" aria-hidden="true" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-secondary/30" aria-hidden="true" />
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <h3 className="font-label-md text-label-md text-secondary uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_theme('colors.secondary')]" aria-hidden="true" />
                    Simulated Future
                  </h3>
                  <span className="material-symbols-outlined text-secondary" aria-hidden="true">psychology</span>
                </div>
                <div className="flex flex-col gap-1 relative z-10">
                  <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">{newTotal.toFixed(1)}t</span>
                  <span className="font-body-sm text-body-md text-on-surface-variant">New Total Footprint</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-4 flex justify-end">
              <button
                className="bg-secondary text-on-secondary font-label-md text-label-md px-8 py-3 rounded-full hover:bg-secondary-fixed transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(211,254,50,0.3)] hover:shadow-[0_0_25px_rgba(211,254,50,0.5)] transform hover:-translate-y-0.5"
                onClick={() => {
                  const finalFootprint = Math.max(1.5, parseFloat(newTotal.toFixed(1)));
                  const finalScore = Math.min(99, Math.max(15, Math.round(100 - finalFootprint * 3.5)));
                  setCarbonFootprint(finalFootprint);
                  setEcoScore(finalScore);
                  updateLevel();
                  navigate('/');
                }}
              >
                Commit to Changes
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
