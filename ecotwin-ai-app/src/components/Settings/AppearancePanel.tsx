import React from 'react';
import type { UserSettings } from '../../store/useStore';

interface AppearancePanelProps {
  formData: UserSettings;
  onToggle: (key: keyof UserSettings) => void;
  onChange: (updated: Partial<UserSettings>) => void;
}

export const AppearancePanel: React.FC<AppearancePanelProps> = ({
  formData,
  onToggle,
  onChange,
}) => (
  <div className="space-y-6 animate-fade-in" id="panel-appearance">
    <h2 className="font-headline-md text-headline-md text-primary border-b border-white/10 pb-3">Appearance Settings</h2>
    
    {/* Theme Customizer */}
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Interface Theme</label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { id: 'dark', label: 'Dark Mode', desc: 'Standard Deep Canopy', border: 'border-white/20' },
          { id: 'light', label: 'Light Mode', desc: 'Clean Biophilic', border: 'border-emerald-700/20' },
          { id: 'green', label: 'Eco Green', desc: 'High-Glow Nature', border: 'border-green-400/20' },
          { id: 'blue', label: 'Blue Corporate', desc: 'Oceanic Tech', border: 'border-blue-400/20' }
        ].map(th => (
          <button
            key={th.id}
            type="button"
            onClick={() => onChange({ theme: th.id as UserSettings['theme'] })}
            className={`text-left p-4 rounded-xl border flex flex-col justify-between h-24 hover:bg-white/5 transition-all ${formData.theme === th.id ? 'border-secondary bg-secondary/5' : 'border-white/10 bg-black/20'}`}
          >
            <span className="font-label-md text-label-md text-on-surface font-semibold">{th.label}</span>
            <span className="text-[10px] text-on-surface-variant">{th.desc}</span>
          </button>
        ))}
      </div>
    </div>

    {/* Toggles Grid */}
    <div className="space-y-4 pt-4 border-t border-white/5">
      <h3 className="font-label-md text-label-md text-on-surface font-semibold">Motion & Layout</h3>
      
      <div className="space-y-4">
        {/* Toggle: Animations */}
        <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
          <div>
            <span className="font-label-md text-label-md text-on-surface block">Enable Animations</span>
            <span className="text-[10px] text-on-surface-variant">Smooth micro-interactions and transitions.</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={formData.animations}
            aria-label="Enable animations"
            onClick={() => onToggle('animations')}
            className={`w-12 h-6 rounded-full transition-all relative ${formData.animations ? 'bg-secondary' : 'bg-white/10'}`}
          >
            <div className={`w-5 h-5 bg-[#0c1513] rounded-full absolute top-0.5 transition-all ${formData.animations ? 'right-0.5' : 'left-0.5'}`}></div>
          </button>
        </div>

        {/* Toggle: Reduced Motion */}
        <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
          <div>
            <span className="font-label-md text-label-md text-on-surface block">Reduced Motion</span>
            <span className="text-[10px] text-on-surface-variant">Minimize background animation frequencies.</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={formData.reducedMotion}
            aria-label="Reduced motion"
            onClick={() => onToggle('reducedMotion')}
            className={`w-12 h-6 rounded-full transition-all relative ${formData.reducedMotion ? 'bg-secondary' : 'bg-white/10'}`}
          >
            <div className={`w-5 h-5 bg-[#0c1513] rounded-full absolute top-0.5 transition-all ${formData.reducedMotion ? 'right-0.5' : 'left-0.5'}`}></div>
          </button>
        </div>

        {/* Toggle: Compact Mode */}
        <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
          <div>
            <span className="font-label-md text-label-md text-on-surface block">Compact Mode</span>
            <span className="text-[10px] text-on-surface-variant">Denser grid padding for high-density dashboards.</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={formData.compactMode}
            aria-label="Compact mode"
            onClick={() => onToggle('compactMode')}
            className={`w-12 h-6 rounded-full transition-all relative ${formData.compactMode ? 'bg-secondary' : 'bg-white/10'}`}
          >
            <div className={`w-5 h-5 bg-[#0c1513] rounded-full absolute top-0.5 transition-all ${formData.compactMode ? 'right-0.5' : 'left-0.5'}`}></div>
          </button>
        </div>
      </div>
    </div>
  </div>
);
