import React from 'react';
import type { UserSettings } from '../../store/useStore';

interface SimulationPanelProps {
  formData: UserSettings;
  onChange: (updated: Partial<UserSettings>) => void;
}

export const SimulationPanel: React.FC<SimulationPanelProps> = ({
  formData,
  onChange,
}) => (
  <div className="space-y-6 animate-fade-in" id="panel-simulation">
    <h2 className="font-headline-md text-headline-md text-primary border-b border-white/10 pb-3">Simulation Preferences</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Primary Simulation Region</label>
        <select
          value={formData.region}
          onChange={(e) => onChange({ region: e.target.value as UserSettings['region'] })}
          className="w-full bg-black/40 border border-white/10 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg px-4 py-3 text-on-surface font-body-md outline-none"
        >
          <option value="Global">Global / Universal Model</option>
          <option value="India">India / South Asia Grid</option>
          <option value="US">United States / North America Grid</option>
          <option value="Europe">European Union Grid</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Default Target Year</label>
        <select
          value={formData.projectionYear}
          onChange={(e) => onChange({ projectionYear: parseInt(e.target.value) as UserSettings['projectionYear'] })}
          className="w-full bg-black/40 border border-white/10 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg px-4 py-3 text-on-surface font-body-md outline-none"
        >
          <option value={2030}>2030 (Short-term Targets)</option>
          <option value={2040}>2040 (Mid-century Tipping Point)</option>
          <option value={2050}>2050 (Long-term Net Zero target)</option>
        </select>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Climate Model Complexity</label>
        <select
          value={formData.complexity}
          onChange={(e) => onChange({ complexity: e.target.value as UserSettings['complexity'] })}
          className="w-full bg-black/40 border border-white/10 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg px-4 py-3 text-on-surface font-body-md outline-none"
        >
          <option value="Basic">Basic (Linear Interpolations)</option>
          <option value="Advanced">Advanced (Feedback Loops & Tipping Points)</option>
          <option value="Expert">Expert (Radiative Forcing & Offset Factors)</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Default Scenario Preset</label>
        <select
          value={formData.defaultScenario}
          onChange={(e) => onChange({ defaultScenario: e.target.value as UserSettings['defaultScenario'] })}
          className="w-full bg-black/40 border border-white/10 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg px-4 py-3 text-on-surface font-body-md outline-none"
        >
          <option value="Business As Usual">Business As Usual (BAU)</option>
          <option value="Moderate Action">Moderate Action Plan</option>
          <option value="Net Zero 2050">Net Zero 2050 Path</option>
        </select>
      </div>
    </div>
  </div>
);
