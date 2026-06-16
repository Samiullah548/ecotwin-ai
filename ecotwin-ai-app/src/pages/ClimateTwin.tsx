import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { AvatarVisualization } from '../components/ClimateTwin/AvatarVisualization';
import { ActivityFeed } from '../components/ClimateTwin/ActivityFeed';
import { CustomActionModal } from '../components/ClimateTwin/CustomActionModal';

export const ClimateTwin: React.FC = () => {
  const { ecoLevel, ecoTitle, ecoXP, activityLog, logActivity } = useStore();

  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [successAction, setSuccessAction] = useState<string | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const progressPercent = Math.min(100, Math.max(0, ((ecoXP % 200) / 200) * 100));
  const nextLevel = ecoLevel + 1;

  const handleLogAction = async (
    actionId: string,
    label: string,
    icon: string,
    saved: number,
    waterSaved: number,
    color: string,
  ) => {
    setActiveAction(actionId);
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

  const handleCustomSubmit = (activity: {
    label: string;
    icon: string;
    saved: number;
    waterSaved: number;
    color: string;
  }) => {
    logActivity(activity);
    setIsCustomModalOpen(false);
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
        {/* Avatar Visualization Component */}
        <AvatarVisualization
          ecoLevel={ecoLevel}
          ecoTitle={ecoTitle}
          progressPercent={progressPercent}
          nextLevel={nextLevel}
        />

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

          {/* Impact Stats Component */}
          <ActivityFeed activityLog={activityLog} />
        </section>
      </div>

      {/* Custom Action Modal Component */}
      <CustomActionModal
        open={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSubmit={handleCustomSubmit}
      />
    </div>
  );
};
