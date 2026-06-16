import React from 'react';
import type { ActivityEntry } from '../../store/useStore';

interface ActivityFeedProps {
  activityLog: ActivityEntry[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = React.memo(({ activityLog }) => {
  const totalSavedCO2 = activityLog.reduce((sum, entry) => sum + (entry.saved || 0), 0);
  const totalSavedWater = activityLog.reduce((sum, entry) => sum + (entry.waterSaved || 0), 0);

  return (
    <div className="bg-black/30 backdrop-blur-3xl border-t border-l border-white/15 border-r border-b border-white/5 rounded-xl p-6 relative overflow-hidden group hover:border-tertiary transition-colors duration-300">
      <div
        className="absolute -right-10 -top-10 w-32 h-32 bg-tertiary/20 rounded-full blur-[40px] group-hover:bg-tertiary/30 transition-colors"
        aria-hidden="true"
      />
      <h2 className="font-label-md text-label-md text-on-surface-variant mb-4 uppercase tracking-widest">
        Recent Impact
      </h2>

      <div className="grid grid-cols-2 gap-4 relative z-10 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-tertiary text-sm" aria-hidden="true">
              co2
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Saved</span>
          </div>
          <div className="font-headline-md text-headline-md text-tertiary">
            {totalSavedCO2.toFixed(1)}
            <span className="text-sm font-body-md text-on-surface-variant ml-1">kg</span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-secondary text-sm" aria-hidden="true">
              water_drop
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Conserved</span>
          </div>
          <div className="font-headline-md text-headline-md text-secondary">
            {totalSavedWater}
            <span className="text-sm font-body-md text-on-surface-variant ml-1">L</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 my-4" />

      <h3 className="font-label-sm text-label-sm text-on-surface/80 mb-3 font-semibold">
        Activity Feed
      </h3>
      <div
        className="space-y-3 max-h-48 overflow-y-auto pr-1 no-scrollbar"
        role="log"
        aria-label="Recent activity feed"
        aria-live="polite"
      >
        {activityLog.length === 0 ? (
          <p className="text-xs text-on-surface-variant italic">
            No actions logged yet. Start nurturing your twin!
          </p>
        ) : (
          activityLog.slice(0, 5).map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between bg-white/5 rounded-lg p-2.5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`material-symbols-outlined text-${activity.color || 'primary'} text-lg`}
                  aria-hidden="true"
                >
                  {activity.icon || 'eco'}
                </span>
                <div className="text-left">
                  <span className="font-label-sm text-label-sm text-on-surface block leading-tight text-left">
                    {activity.label}
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-body-sm block text-left">
                    {activity.date}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-tertiary block leading-tight">
                  -{activity.saved.toFixed(1)} kg CO₂
                </span>
                {activity.waterSaved > 0 && (
                  <span className="text-[10px] font-semibold text-secondary block">
                    +{activity.waterSaved}L H₂O
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

ActivityFeed.displayName = 'ActivityFeed';
