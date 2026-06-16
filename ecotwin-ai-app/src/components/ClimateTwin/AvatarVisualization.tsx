import React from 'react';

interface AvatarVisualizationProps {
  ecoLevel: number;
  ecoTitle: string;
  progressPercent: number;
  nextLevel: number;
}

export const AvatarVisualization: React.FC<AvatarVisualizationProps> = React.memo(({
  ecoLevel,
  ecoTitle,
  progressPercent,
  nextLevel,
}) => {
  return (
    <section
      aria-label="Climate Twin avatar visualization"
      className="lg:col-span-8 bg-black/30 backdrop-blur-3xl border-t border-l border-white/15 border-r border-b border-white/5 rounded-xl relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]"
    >
      <div
        className="absolute inset-0 z-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero.png')" }}
        aria-hidden="true"
      />

      {/* Top Status Overlay */}
      <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-start pointer-events-none">
        <div className="bg-surface/60 backdrop-blur-md border border-white/10 rounded-lg px-4 py-2 pointer-events-auto">
          <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase tracking-wider mb-1">
            Entity Status
          </span>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-sm" aria-hidden="true">
              vital_signs
            </span>
            <span className="font-headline-md text-headline-md text-secondary">Stable</span>
          </div>
        </div>
      </div>

      {/* Avatar */}
      <div className="relative z-10 w-64 h-64 md:w-96 md:h-96 flex items-center justify-center mt-12">
        <div
          className="absolute inset-[-20%] animate-[pulse-aura_4s_ease-in-out_infinite] rounded-full z-0"
          style={{
            background:
              'radial-gradient(circle, rgba(211,254,50,0.15) 0%, rgba(12,21,19,0) 70%)',
          }}
          aria-hidden="true"
        />
        <img
          alt="Digital Climate Twin avatar — your environmental health visualised"
          loading="lazy"
          className="relative z-10 w-full h-full object-contain filter drop-shadow-2xl mix-blend-screen opacity-90 transition-all duration-500"
          src="/climate-twin-avatar.png"
          onError={(e) => {
            e.currentTarget.src = '/avatars/avatar-4.svg';
          }}
        />
      </div>

      {/* Bottom Metrics Overlay */}
      <div className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none flex flex-col gap-4 w-[calc(100%-3rem)]">
        <div className="flex justify-between items-end">
          <div className="bg-surface/80 backdrop-blur-md border border-white/10 rounded-lg px-4 py-3 pointer-events-auto">
            <span className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
              Current Eco Level
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display-lg text-display-lg text-primary leading-none">
                {ecoLevel}
              </span>
              <span className="font-label-md text-label-md text-secondary-fixed">
                {ecoTitle}
              </span>
            </div>
          </div>
        </div>
        {/* XP Progress Bar */}
        <div className="bg-surface-container/90 backdrop-blur-md border border-white/5 rounded-xl p-4 pointer-events-auto w-full">
          <div className="flex justify-between items-center mb-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Growth Progression
            </span>
            <span className="font-label-sm text-label-sm text-secondary">
              {progressPercent.toFixed(0)}% to Lvl {nextLevel}
            </span>
          </div>
          <div
            className="h-3 w-full bg-surface-dim rounded-full overflow-hidden border border-white/5 shadow-inner"
            role="progressbar"
            aria-valuenow={Math.round(progressPercent)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`XP progress: ${progressPercent.toFixed(0)}% to level ${nextLevel}`}
          >
            <div
              className="h-full bg-gradient-to-r from-tertiary to-secondary rounded-full relative shadow-[0_0_10px_rgba(211,254,50,0.5)] transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                backgroundImage:
                  'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)',
              }}
            >
              <div
                className="absolute right-0 top-0 bottom-0 w-4 bg-white/50 blur-[2px]"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

AvatarVisualization.displayName = 'AvatarVisualization';
