import React from 'react';
import { useStore } from '../../store/useStore';
import { LOG_ACTIONS } from '../../utils/constants';

interface LogActionModalContentProps {
  onClose: () => void;
}

export const LogActionModalContent: React.FC<LogActionModalContentProps> = React.memo(({ onClose }) => {
  const { logActivity } = useStore();
  return (
    <div className="space-y-3">
      {LOG_ACTIONS.map((action) => (
        <button
          key={action.label}
          className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-secondary/50 hover:bg-secondary/5 transition-all text-left"
          onClick={() => {
            logActivity({
              icon: action.icon,
              label: action.label,
              saved: action.saved,
              waterSaved: action.waterSaved,
              color: action.color,
            });
            onClose();
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: `rgba(${action.color === 'secondary' ? '211,254,50' : action.color === 'tertiary' ? '175,198,255' : '176,205,194'}, 0.2)`,
              color: action.color === 'secondary' ? '#d3fe32' : action.color === 'tertiary' ? '#afc6ff' : '#b0cdc2',
            }}
            aria-hidden="true"
          >
            <span className="material-symbols-outlined text-[20px]">{action.icon}</span>
          </div>
          <div className="flex-1">
            <p className="font-label-md text-label-md text-on-surface">{action.label}</p>
            <p className="font-label-sm text-label-sm text-secondary">−{action.saved}kg CO₂</p>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant" aria-hidden="true">chevron_right</span>
        </button>
      ))}
    </div>
  );
});

LogActionModalContent.displayName = 'LogActionModalContent';
