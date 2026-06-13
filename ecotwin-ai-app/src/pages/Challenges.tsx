import React from 'react';
import { useStore } from '../store/useStore';
import { CHALLENGES } from '../utils/constants';

const BADGES = [
  { name: 'Seed Planter',    icon: 'yard',          color: 'text-secondary' },
  { name: 'Energy Guardian', icon: 'bolt',          color: 'text-tertiary'  },
  { name: 'Carbon Saver',    icon: 'co2',           color: 'text-primary'   },
];

export const Challenges: React.FC = () => {
  const { completedChallenges, toggleChallenge, ecoXP } = useStore();

  return (
    <div className="w-full flex flex-col relative z-10 min-h-full">
      <div className="w-full max-w-container-max mx-auto flex-1 flex flex-col gap-8">

        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-secondary">
            <span className="material-symbols-outlined" aria-hidden="true">workspace_premium</span>
            <span className="font-label-md text-label-md tracking-wider uppercase">Achievements</span>
          </div>
          {/* h1 as primary page heading */}
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold">
            Daily Challenges
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-2">
            Complete daily tasks to lower your carbon footprint and earn Eco Points.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mt-4">

          {/* Challenges List */}
          <section className="lg:col-span-8 flex flex-col gap-4" aria-label="Daily challenge tasks">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary" aria-hidden="true">today</span>
              <h2 className="font-headline-md text-headline-md text-primary">Today's Tasks</h2>
            </div>

            {/* Each challenge is a <button> for full keyboard & screen-reader support */}
            <div className="space-y-4" role="list">
              {CHALLENGES.map((c) => {
                const isDone = completedChallenges.includes(c.id);
                return (
                  <button
                    key={c.id}
                    role="listitem"
                    aria-pressed={isDone}
                    aria-label={`${c.title}: ${c.desc} — ${c.points} points${isDone ? ' (completed)' : ''}`}
                    className={`w-full text-left bg-white/5 backdrop-blur-xl border ${
                      isDone ? 'border-secondary/50 bg-secondary/5' : 'border-white/10'
                    } rounded-xl p-6 flex items-center justify-between transition-all hover:bg-white/10 cursor-pointer`}
                    onClick={() => toggleChallenge(c.id)}
                  >
                    <div className="flex items-center gap-6">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isDone
                            ? 'bg-secondary text-on-secondary shadow-[0_0_15px_rgba(211,254,50,0.4)]'
                            : 'bg-surface border border-white/20 text-on-surface-variant'
                        }`}
                        aria-hidden="true"
                      >
                        <span className="material-symbols-outlined">{isDone ? 'check' : c.icon}</span>
                      </div>
                      <div>
                        <h3 className={`font-headline-md text-[20px] ${isDone ? 'text-secondary' : 'text-on-surface'}`}>
                          {c.title}
                        </h3>
                        <p className="font-body-md text-body-md text-on-surface-variant">{c.desc}</p>
                      </div>
                    </div>
                    <div className="text-right" aria-hidden="true">
                      <span className="font-headline-md text-headline-md text-tertiary">+{c.points}</span>
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">pts</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Badges Panel */}
          <section className="lg:col-span-4 flex flex-col gap-6" aria-label="Your achievement badges">
            <div className="bg-black/30 backdrop-blur-3xl border border-white/10 rounded-2xl p-8 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-tertiary" aria-hidden="true">military_tech</span>
                <h2 className="font-headline-md text-headline-md text-tertiary">Your Badges</h2>
              </div>

              <div className="grid grid-cols-2 gap-4 flex-1" role="list" aria-label="Earned badges">
                {BADGES.map((b) => (
                  <div
                    key={b.name}
                    role="listitem"
                    className="flex flex-col items-center justify-center p-4 border border-white/5 rounded-xl bg-surface/50 text-center hover:bg-white/5 transition-colors"
                    aria-label={`Badge: ${b.name}`}
                  >
                    <span
                      className={`material-symbols-outlined text-4xl mb-2 ${b.color}`}
                      style={{ fontVariationSettings: "'FILL' 1" }}
                      aria-hidden="true"
                    >
                      {b.icon}
                    </span>
                    <span className="font-label-md text-label-md text-on-surface">{b.name}</span>
                  </div>
                ))}

                <div
                  role="listitem"
                  className="flex flex-col items-center justify-center p-4 border border-dashed border-white/10 rounded-xl text-center opacity-50"
                  aria-label="Locked badge"
                >
                  <span className="material-symbols-outlined text-4xl mb-2 text-on-surface-variant" aria-hidden="true">lock</span>
                  <span className="font-label-md text-label-md text-on-surface-variant">Locked</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-end">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Total Points</span>
                  <div className="font-display-lg text-[40px] text-secondary mt-1" aria-live="polite" aria-atomic="true">
                    {ecoXP}
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
