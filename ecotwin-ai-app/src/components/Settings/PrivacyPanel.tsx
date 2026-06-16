import React from 'react';

interface PrivacyPanelProps {
  pwdCurrent: string;
  setPwdCurrent: (v: string) => void;
  pwdNew: string;
  setPwdNew: (v: string) => void;
  pwdConfirm: string;
  setPwdConfirm: (v: string) => void;
  onApplyPasswordChange: () => void;
  twoFactor: boolean;
  onToggleTwoFactor: () => void;
  onExportReport: () => void;
  onClearCache: () => void;
  onResetProgress: () => void;
  onLogout: () => void;
}

export const PrivacyPanel: React.FC<PrivacyPanelProps> = ({
  pwdCurrent,
  setPwdCurrent,
  pwdNew,
  setPwdNew,
  pwdConfirm,
  setPwdConfirm,
  onApplyPasswordChange,
  twoFactor,
  onToggleTwoFactor,
  onExportReport,
  onClearCache,
  onResetProgress,
  onLogout,
}) => (
  <div className="space-y-6 animate-fade-in" id="panel-privacy">
    <h2 className="font-headline-md text-headline-md text-primary border-b border-white/10 pb-3">Privacy & Security</h2>
    
    {/* Password Change Form */}
    <div className="space-y-4">
      <h3 className="font-label-md text-label-md text-on-surface font-semibold">Update Credentials</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="pwd-current" className="sr-only">Current Password</label>
          <input
            id="pwd-current"
            type="password"
            placeholder="Current Password"
            value={pwdCurrent}
            onChange={(e) => setPwdCurrent(e.target.value)}
            className="w-full bg-black/40 border border-white/10 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg px-4 py-3 text-on-surface font-body-md outline-none"
          />
        </div>
        <div>
          <label htmlFor="pwd-new" className="sr-only">New Password</label>
          <input
            id="pwd-new"
            type="password"
            placeholder="New Password"
            value={pwdNew}
            onChange={(e) => setPwdNew(e.target.value)}
            className="w-full bg-black/40 border border-white/10 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg px-4 py-3 text-on-surface font-body-md outline-none"
          />
        </div>
        <div>
          <label htmlFor="pwd-confirm" className="sr-only">Confirm New Password</label>
          <input
            id="pwd-confirm"
            type="password"
            placeholder="Confirm New Password"
            value={pwdConfirm}
            onChange={(e) => setPwdConfirm(e.target.value)}
            className="w-full bg-black/40 border border-white/10 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg px-4 py-3 text-on-surface font-body-md outline-none"
          />
        </div>
      </div>
      {pwdNew && (pwdNew === pwdConfirm) && (
        <button
          type="button"
          onClick={onApplyPasswordChange}
          className="bg-primary/20 text-primary border border-primary/20 hover:bg-primary/30 px-4 py-2 rounded-lg font-label-sm text-label-sm transition-all"
        >
          Apply Password Change
        </button>
      )}
    </div>

    {/* 2FA Toggle */}
    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
      <div>
        <span className="font-label-md text-label-md text-on-surface block">Two-Factor Authentication (2FA)</span>
        <span className="text-[10px] text-on-surface-variant">Secure your Climate Twin data credentials using authenticator apps.</span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={twoFactor}
        aria-label="Two-factor authentication"
        onClick={onToggleTwoFactor}
        className={`w-12 h-6 rounded-full transition-all relative ${twoFactor ? 'bg-secondary' : 'bg-white/10'}`}
      >
        <div className={`w-5 h-5 bg-[#0c1513] rounded-full absolute top-0.5 transition-all ${twoFactor ? 'right-0.5' : 'left-0.5'}`}></div>
      </button>
    </div>

    {/* Session management */}
    <div className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-3">
      <h4 className="font-label-sm text-label-sm font-semibold text-on-surface">Active Session Management</h4>
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs text-on-surface block">Current Session — Chrome on Windows</span>
          <span className="text-[10px] text-on-surface-variant">Active now · IP: 192.168.1.42</span>
        </div>
        <button
          type="button"
          onClick={() => alert('All other session tokens revoked.')}
          className="text-xs border border-white/10 hover:border-error hover:text-error text-on-surface-variant px-3 py-1.5 rounded-lg transition-all"
        >
          Revoke Others
        </button>
      </div>
    </div>

    {/* Action panel utilities */}
    <div className="pt-4 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4">
      <button
        type="button"
        onClick={onExportReport}
        className="glass-panel text-primary px-4 py-3 rounded-lg font-label-sm text-label-sm flex items-center justify-center gap-2 hover:bg-primary/10 transition-all"
      >
        <span className="material-symbols-outlined text-[18px]">download</span>
        Export Report
      </button>
      <button
        type="button"
        onClick={onClearCache}
        className="glass-panel text-on-surface-variant px-4 py-3 rounded-lg font-label-sm text-label-sm flex items-center justify-center gap-2 hover:bg-white/5 transition-all"
      >
        <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
        Clear Cache
      </button>
      <button
        type="button"
        onClick={onResetProgress}
        className="glass-panel border-error/30 text-error px-4 py-3 rounded-lg font-label-sm text-label-sm flex items-center justify-center gap-2 hover:bg-error/10 transition-all"
      >
        <span className="material-symbols-outlined text-[18px]">restart_alt</span>
        Reset Progress
      </button>
      <button
        type="button"
        onClick={onLogout}
        className="bg-error/20 border border-error/30 text-error px-4 py-3 rounded-lg font-label-sm text-label-sm flex items-center justify-center gap-2 hover:bg-error/30 transition-all"
      >
        <span className="material-symbols-outlined text-[18px]">logout</span>
        Log Out
      </button>
    </div>
  </div>
);
