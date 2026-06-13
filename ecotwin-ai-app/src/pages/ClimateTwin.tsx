import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Modal } from '../components/Modal';
import { clampNumber, sanitizeText } from '../utils/sanitize';

const CUSTOM_ICONS = [
  { value: 'eco',           label: 'Eco Pip'             },
  { value: 'recycling',     label: 'Recycling'           },
  { value: 'water_drop',    label: 'Water Drop'          },
  { value: 'lightbulb',     label: 'Energy Saving'       },
  { value: 'shopping_bag',  label: 'Sustainable Shopping'},
  { value: 'forest',        label: 'Tree Planting'       },
];

export const ClimateTwin: React.FC = () => {
  const { ecoLevel, ecoTitle, ecoXP, activityLog, logActivity } = useStore();

  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [successAction, setSuccessAction] = useState<string | null>(null);

  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customLabel, setCustomLabel] = useState('');
  const [customSaved, setCustomSaved] = useState('');
  const [customWater, setCustomWater] = useState('');
  const [customIcon, setCustomIcon] = useState('eco');
  const [customError, setCustomError] = useState('');

  const progressPercent = Math.min(100, Math.max(0, ((ecoXP % 200) / 200) * 100));
  const nextLevel = ecoLevel + 1;

  const totalSavedCO2 = activityLog.reduce((sum, entry) => sum + (entry.saved || 0), 0);
  const totalSavedWater = activityLog.reduce((sum, entry) => sum + (entry.waterSaved || 0), 0);

  const handleLogAction = async (
    actionId: string,
    label: string,
    icon: string,
    saved: number,
    waterSaved: number,
    color: string,
  ) => {
    setActiveAction(actionId);
    setCustomError('');
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      logActivity({ label, icon, saved, waterSaved, color });
      setActiveAction(null);
      setSuccessAction(actionId);
      setTimeout(() => setSuccessAction(null), 1200);
    } catch (err) {
      setActiveAction(null);
      console.error('Failed to log action:', err);
    }
  };

  const handleCustomSubmit = () => {
    const trimmedLabel = customLabel.trim();
    if (!trimmedLabel) {
      setCustomError('Please enter an action name.');
      return;
    }
    // Security: clamp numeric inputs to reasonable bounds
    const savedVal = clampNumber(customSaved, 0, 1000);
    const waterVal = clampNumber(customWater, 0, 100000);
    if (isNaN(savedVal) || customSaved === '') {
      setCustomError('Please enter a valid CO₂ saved value (0–1000 kg).');
      return;
    }
    if (isNaN(waterVal) || customWater === '') {
      setCustomError('Please enter a valid water conserved value (0–100 000 L).');
      return;
    }

    // Sanitize the label text before storing
    logActivity({
      label: sanitizeText(trimmedLabel),
      icon: customIcon,
      saved: savedVal,
      waterSaved: waterVal,
      color: 'primary',
    });

    setIsCustomModalOpen(false);
    setCustomLabel('');
    setCustomSaved('');
    setCustomWater('');
    setCustomError('');
  };

  const handleCloseModal = () => {
    setIsCustomModalOpen(false);
    setCustomLabel('');
    setCustomSaved('');
    setCustomWater('');
    setCustomError('');
  };

  return (
    <div className="max-w-container-max mx-auto space-y-gutter w-full min-h-full flex flex-col">
      {/* Header Section */}
      <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
            Climate Twin
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Your living digital reflection. This biome responds in real-time to your ecological footprint and sustainable actions.
          </p>
        </div>
        {/* Status pill */}
        <div
          className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex items-center gap-3 w-fit shrink-0"
          aria-label="Live sync status: active"
        >
          <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_15px_rgba(211,254,50,0.5)]" aria-hidden="true" />
          <span className="font-label-md text-label-md text-primary">Live Sync Active</span>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter flex-1 h-full min-h-[600px]">

        {/* Avatar Visualization */}
        <section
          aria-label="Climate Twin avatar visualization"
          className="lg:col-span-8 bg-black/30 backdrop-blur-3xl border-t border-l border-white/15 border-r border-b border-white/5 rounded-xl relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]"
        >
          <div className="absolute inset-0 z-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: "url('/hero.png')" }} aria-hidden="true" />

          {/* Top Status Overlay */}
          <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-start pointer-events-none">
            <div className="bg-surface/60 backdrop-blur-md border border-white/10 rounded-lg px-4 py-2 pointer-events-auto">
              <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase tracking-wider mb-1">Entity Status</span>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-sm" aria-hidden="true">vital_signs</span>
                <span className="font-headline-md text-headline-md text-secondary">Stable</span>
              </div>
            </div>
          </div>

          {/* Avatar */}
          <div className="relative z-10 w-64 h-64 md:w-96 md:h-96 flex items-center justify-center mt-12">
            <div className="absolute inset-[-20%] animate-[pulse-aura_4s_ease-in-out_infinite] rounded-full z-0" style={{ background: 'radial-gradient(circle, rgba(211,254,50,0.15) 0%, rgba(12,21,19,0) 70%)' }} aria-hidden="true" />
            <img
              alt="Digital Climate Twin avatar — your environmental health visualised"
              loading="lazy"
              className="relative z-10 w-full h-full object-contain filter drop-shadow-2xl mix-blend-screen opacity-90 transition-all duration-500"
              src="/climate-twin-avatar.png"
              onError={(e) => { e.currentTarget.src = '/avatars/avatar-4.svg'; }}
            />
          </div>

          {/* Bottom Metrics Overlay */}
          <div className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <div className="bg-surface/80 backdrop-blur-md border border-white/10 rounded-lg px-4 py-3 pointer-events-auto">
                <span className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Current Eco Level</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-display-lg text-display-lg text-primary leading-none">{ecoLevel}</span>
                  <span className="font-label-md text-label-md text-secondary-fixed">{ecoTitle}</span>
                </div>
              </div>
            </div>
            {/* XP Progress Bar */}
            <div className="bg-surface-container/90 backdrop-blur-md border border-white/5 rounded-xl p-4 pointer-events-auto w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Growth Progression</span>
                <span className="font-label-sm text-label-sm text-secondary">{progressPercent.toFixed(0)}% to Lvl {nextLevel}</span>
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
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)',
                  }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/50 blur-[2px]" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sidebar */}
        <section aria-label="Twin actions and impact stats" className="lg:col-span-4 flex flex-col gap-gutter">
          {/* Action Panel */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 flex flex-col flex-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary" aria-hidden="true">nature</span>
              <h2 className="font-headline-md text-headline-md text-primary">Nurture Twin</h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Log sustainable actions to improve your twin's biome health and unlock new visual traits.
            </p>
            <div className="flex flex-col gap-3">
              {/* Zero-Emission Transit */}
              <button
                disabled={activeAction !== null}
                onClick={() => handleLogAction('transit', 'Zero-Emission Transit', 'directions_bike', 2.4, 0, 'tertiary')}
                aria-label="Log zero-emission transit action"
                aria-busy={activeAction === 'transit'}
                className="bg-secondary text-on-secondary font-label-md text-label-md rounded-lg py-4 px-4 flex justify-between items-center hover:bg-[#aed500] transition-colors shadow-[0_0_15px_rgba(211,254,50,0.3)] group disabled:opacity-50"
              >
                <span className="flex items-center gap-2">
                  {activeAction === 'transit' ? (
                    <span className="material-symbols-outlined animate-spin text-sm" aria-hidden="true">sync</span>
                  ) : successAction === 'transit' ? (
                    <span className="material-symbols-outlined text-sm text-green-300" aria-hidden="true">check_circle</span>
                  ) : (
                    <span className="material-symbols-outlined text-sm" aria-hidden="true">directions_bike</span>
                  )}
                  {activeAction === 'transit' ? 'Logging Transit...' : successAction === 'transit' ? 'Logged Transit!' : 'Log Zero-Emission Transit'}
                </span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" aria-hidden="true">arrow_forward</span>
              </button>

              {/* Plant-Based Meal */}
              <button
                disabled={activeAction !== null}
                onClick={() => handleLogAction('meal', 'Plant-Based Meal', 'restaurant', 1.8, 500, 'primary')}
                aria-label="Log plant-based meal action"
                aria-busy={activeAction === 'meal'}
                className="bg-transparent border border-secondary text-secondary font-label-md text-label-md rounded-lg py-4 px-4 flex justify-between items-center hover:bg-secondary/10 transition-colors backdrop-blur-sm group disabled:opacity-50"
              >
                <span className="flex items-center gap-2">
                  {activeAction === 'meal' ? (
                    <span className="material-symbols-outlined animate-spin text-sm" aria-hidden="true">sync</span>
                  ) : successAction === 'meal' ? (
                    <span className="material-symbols-outlined text-sm text-green-300" aria-hidden="true">check_circle</span>
                  ) : (
                    <span className="material-symbols-outlined text-sm" aria-hidden="true">restaurant</span>
                  )}
                  {activeAction === 'meal' ? 'Logging Meal...' : successAction === 'meal' ? 'Logged Meal!' : 'Plant-Based Meal'}
                </span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" aria-hidden="true">arrow_forward</span>
              </button>

              {/* Custom Action */}
              <button
                onClick={() => setIsCustomModalOpen(true)}
                aria-label="Log a custom sustainable action"
                className="bg-transparent border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg py-4 px-4 flex justify-between items-center hover:border-primary hover:text-primary transition-colors backdrop-blur-sm mt-2 group"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined" aria-hidden="true">add_circle</span>
                  Custom Action
                </span>
                <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="bg-black/30 backdrop-blur-3xl border-t border-l border-white/15 border-r border-b border-white/5 rounded-xl p-6 relative overflow-hidden group hover:border-tertiary transition-colors duration-300">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-tertiary/20 rounded-full blur-[40px] group-hover:bg-tertiary/30 transition-colors" aria-hidden="true" />
            <h2 className="font-label-md text-label-md text-on-surface-variant mb-4 uppercase tracking-widest">Recent Impact</h2>

            <div className="grid grid-cols-2 gap-4 relative z-10 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-tertiary text-sm" aria-hidden="true">co2</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Saved</span>
                </div>
                <div className="font-headline-md text-headline-md text-tertiary">
                  {totalSavedCO2.toFixed(1)}<span className="text-sm font-body-md text-on-surface-variant ml-1">kg</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-secondary text-sm" aria-hidden="true">water_drop</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Conserved</span>
                </div>
                <div className="font-headline-md text-headline-md text-secondary">
                  {totalSavedWater}<span className="text-sm font-body-md text-on-surface-variant ml-1">L</span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 my-4" />

            <h3 className="font-label-sm text-label-sm text-on-surface/80 mb-3 font-semibold">Activity Feed</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1 no-scrollbar" role="log" aria-label="Recent activity feed" aria-live="polite">
              {activityLog.length === 0 ? (
                <p className="text-xs text-on-surface-variant italic">No actions logged yet. Start nurturing your twin!</p>
              ) : (
                activityLog.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between bg-white/5 rounded-lg p-2.5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-${activity.color || 'primary'} text-lg`} aria-hidden="true">
                        {activity.icon || 'eco'}
                      </span>
                      <div>
                        <span className="font-label-sm text-label-sm text-on-surface block leading-tight">{activity.label}</span>
                        <span className="text-[10px] text-on-surface-variant font-body-sm">{activity.date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-tertiary block leading-tight">-{activity.saved.toFixed(1)} kg CO₂</span>
                      {activity.waterSaved > 0 && (
                        <span className="text-[10px] font-semibold text-secondary block">+{activity.waterSaved}L H₂O</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Custom Action Modal — uses accessible Modal component */}
      <Modal
        open={isCustomModalOpen}
        onClose={handleCloseModal}
        title="Log Custom Action"
        id="custom-action-modal"
      >
        <p className="font-body-sm text-on-surface-variant text-sm mb-4">
          Enter details of your sustainable action to sync with your Climate Twin.
        </p>

        <div className="space-y-3">
          <div>
            <label htmlFor="custom-label" className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
              Action Name
            </label>
            <input
              id="custom-label"
              type="text"
              maxLength={120}
              className="w-full bg-black/40 border border-white/10 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg px-3 py-2 text-on-surface font-body-md outline-none"
              placeholder="e.g. Recycled paper"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="custom-co2" className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                CO₂ Saved (kg)
              </label>
              <input
                id="custom-co2"
                type="number"
                step="0.1"
                min="0"
                max="1000"
                className="w-full bg-black/40 border border-white/10 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg px-3 py-2 text-on-surface font-body-md outline-none"
                placeholder="e.g. 1.5"
                value={customSaved}
                onChange={(e) => setCustomSaved(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="custom-water" className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                Water Conserved (L)
              </label>
              <input
                id="custom-water"
                type="number"
                min="0"
                max="100000"
                className="w-full bg-black/40 border border-white/10 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg px-3 py-2 text-on-surface font-body-md outline-none"
                placeholder="e.g. 50"
                value={customWater}
                onChange={(e) => setCustomWater(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="custom-icon-select" className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
              Icon Category
            </label>
            <select
              id="custom-icon-select"
              className="w-full bg-black/40 border border-white/10 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg px-3 py-2 text-on-surface font-body-md outline-none"
              value={customIcon}
              onChange={(e) => setCustomIcon(e.target.value)}
            >
              {CUSTOM_ICONS.map((icon) => (
                <option key={icon.value} value={icon.value}>{icon.label}</option>
              ))}
            </select>
          </div>
        </div>

        {customError && (
          <p className="text-xs text-red-400 font-semibold flex items-center gap-1 mt-3" role="alert">
            <span className="material-symbols-outlined text-sm" aria-hidden="true">error</span>
            {customError}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleCloseModal}
            className="bg-transparent border border-white/10 text-on-surface font-label-md text-label-md px-4 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCustomSubmit}
            className="bg-secondary text-on-secondary font-label-md text-label-md px-5 py-2.5 rounded-lg hover:bg-secondary-fixed-dim transition-colors glow-secondary"
          >
            Log Action
          </button>
        </div>
      </Modal>
    </div>
  );
};
