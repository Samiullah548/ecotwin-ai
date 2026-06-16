import React from 'react';

interface StatsBentoProps {
  carbonFootprint: number;
  ecoScore: number;
  grade: string;
  scoreDash: string;
  monthlyProgress: number;
}

export const StatsBento: React.FC<StatsBentoProps> = React.memo(({
  carbonFootprint,
  ecoScore,
  grade,
  scoreDash,
  monthlyProgress,
}) => (
  <section aria-label="Key sustainability metrics" className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
    {/* Carbon Footprint */}
    <div className="glass-panel rounded-xl p-8 flex flex-col justify-between relative overflow-hidden group hover:border-secondary/30 transition-colors">
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-error/10 rounded-full blur-2xl group-hover:bg-error/20 transition-all" aria-hidden="true" />
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center border border-white/5" aria-hidden="true">
          <span className="material-symbols-outlined text-error">co2</span>
        </div>
        <span className="bg-surface-container px-3 py-1 rounded-full font-label-sm text-label-sm text-on-surface-variant">YTD Total</span>
      </div>
      <div>
        <h2 className="font-label-md text-label-md text-on-surface-variant mb-1">Carbon Footprint</h2>
        <div className="flex items-baseline gap-2">
          <span className="font-display-lg text-display-lg text-on-surface">{carbonFootprint}</span>
          <span className="font-headline-md text-headline-md text-error">t</span>
        </div>
        <p className={`font-label-sm text-label-sm flex items-center gap-1 mt-2 ${carbonFootprint < 10 ? 'text-secondary' : 'text-error'}`}>
          <span className="material-symbols-outlined text-[14px]" aria-hidden="true">{carbonFootprint < 10 ? 'arrow_downward' : 'arrow_upward'}</span>
          {carbonFootprint < 10 ? 'Below' : 'Above'} global avg (10t)
        </p>
      </div>
    </div>

    {/* Eco Score */}
    <div className="glass-panel rounded-xl p-8 flex flex-col justify-between relative overflow-hidden group hover:border-secondary/30 transition-colors">
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-all" aria-hidden="true" />
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center border border-white/5" aria-hidden="true">
          <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>psychiatry</span>
        </div>
        {/* Score ring — decorative */}
        <div className="relative w-12 h-12 flex items-center justify-center" aria-hidden="true">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path className="text-surface-container-highest" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
            <path className="text-secondary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={scoreDash} strokeWidth="3" />
          </svg>
          <span className="absolute font-label-sm text-label-sm text-secondary font-bold">{grade}</span>
        </div>
      </div>
      <div>
        <h2 className="font-label-md text-label-md text-on-surface-variant mb-1">Eco Score</h2>
        <div className="flex flex-col gap-1">
          <span className="font-headline-lg-mobile text-headline-lg-mobile md:text-[64px] leading-tight text-on-surface">{ecoScore}</span>
          <span className="font-body-md text-body-md text-on-surface-variant">Top {Math.max(5, 100 - ecoScore)}% in your region</span>
        </div>
      </div>
    </div>

    {/* Monthly Progress */}
    <div className="glass-panel rounded-xl p-8 flex flex-col justify-between relative overflow-hidden group hover:border-tertiary/30 transition-colors">
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-tertiary/10 rounded-full blur-2xl group-hover:bg-tertiary/20 transition-all" aria-hidden="true" />
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center border border-white/5" aria-hidden="true">
          <span className="material-symbols-outlined text-tertiary">moving</span>
        </div>
        <span className="bg-surface-container px-3 py-1 rounded-full font-label-sm text-label-sm text-on-surface-variant">This Month</span>
      </div>
      <div>
        <h2 className="font-label-md text-label-md text-on-surface-variant mb-1">Monthly Progress</h2>
        <div className="flex items-baseline gap-2">
          <span className={`font-display-lg text-display-lg ${monthlyProgress >= 0 ? 'text-tertiary' : 'text-error'}`}>
            {monthlyProgress >= 0 ? '+' : ''}{monthlyProgress}
          </span>
          <span className={`font-headline-md text-headline-md ${monthlyProgress >= 0 ? 'text-tertiary' : 'text-error'}`}>%</span>
        </div>
        <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mt-2">
          {monthlyProgress > 0 ? 'Reduction in overall footprint' : 'Increase vs last month'}
        </p>
      </div>
    </div>
  </section>
));

StatsBento.displayName = 'StatsBento';
