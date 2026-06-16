import React from 'react';
import type { UserSettings } from '../../store/useStore';

interface DataPanelProps {
  formData: UserSettings;
  onToggleService: (key: keyof UserSettings['connectedServices']) => void;
  syncing: boolean;
  onSyncNow: () => void;
  onRefreshData: () => void;
}

export const DataPanel: React.FC<DataPanelProps> = ({
  formData,
  onToggleService,
  syncing,
  onSyncNow,
  onRefreshData,
}) => (
  <div className="space-y-6 animate-fade-in" id="panel-data">
    <h2 className="font-headline-md text-headline-md text-primary border-b border-white/10 pb-3">Data & Integrations</h2>
    
    <div className="space-y-4">
      {[
        { key: 'weatherApi', title: 'Real-time Weather API', desc: 'Syncs dynamic local temperature and biophilic weather patterns.' },
        { key: 'carbonApi', title: 'Carbon Intensity API', desc: 'Pulls current electric grid carbon coefficients.' },
        { key: 'emissionsDataset', title: 'IPCC Emissions Dataset', desc: 'Simulates atmospheric projections based on IPCC AR6 standards.' },
        { key: 'iotSensors', title: 'Smart IoT Home Sensors', desc: 'Directly syncs home smart meters and thermostat sensors.' }
      ].map(srv => (
        <div key={srv.key} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-label-md text-label-md text-on-surface font-semibold block">{srv.title}</span>
              <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full ${formData.connectedServices[srv.key as keyof UserSettings['connectedServices']] ? 'bg-secondary/20 text-secondary' : 'bg-white/5 text-on-surface-variant'}`}>
                {formData.connectedServices[srv.key as keyof UserSettings['connectedServices']] ? 'Connected' : 'Inactive'}
              </span>
            </div>
            <span className="text-[10px] text-on-surface-variant block mt-1">{srv.desc}</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={formData.connectedServices[srv.key as keyof UserSettings['connectedServices']]}
            aria-label={srv.title}
            onClick={() => onToggleService(srv.key as keyof UserSettings['connectedServices'])}
            className={`w-12 h-6 rounded-full transition-all relative ${formData.connectedServices[srv.key as keyof UserSettings['connectedServices']] ? 'bg-secondary' : 'bg-white/10'}`}
          >
            <div className={`w-5 h-5 bg-[#0c1513] rounded-full absolute top-0.5 transition-all ${formData.connectedServices[srv.key as keyof UserSettings['connectedServices']] ? 'right-0.5' : 'left-0.5'}`}></div>
          </button>
        </div>
      ))}
    </div>

    <div className="pt-4 border-t border-white/5 flex gap-4">
      <button
        type="button"
        disabled={syncing}
        onClick={onSyncNow}
        className="bg-secondary text-on-secondary px-6 py-3 rounded-lg font-label-md text-label-md flex items-center gap-2 glow-secondary hover:bg-secondary-fixed transition-colors disabled:opacity-50"
      >
        {syncing ? (
          <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
        ) : (
          <span className="material-symbols-outlined text-[18px]">cached</span>
        )}
        {syncing ? 'Syncing...' : 'Sync Now'}
      </button>
      <button
        type="button"
        onClick={onRefreshData}
        className="glass-panel text-primary px-6 py-3 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-primary/10 transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">refresh</span>
        Refresh Data
      </button>
    </div>
  </div>
);
