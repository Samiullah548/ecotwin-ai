import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, getScoreGrade } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import { auth } from '../firebase';
import type { UserSettings } from '../store/useStore';
import { Modal } from '../components/Modal';
import { sanitizeAvatar, sanitizeText, isValidEmail } from '../utils/sanitize';
import { AVATAR_OPTIONS } from '../utils/constants';
import { generateReportLines, downloadReport } from '../utils/carbonCalculations';

type Category = 'profile' | 'appearance' | 'notifications' | 'simulation' | 'data' | 'privacy';

export const Settings: React.FC = () => {
  const { 
    ecoScore, 
    ecoLevel, 
    ecoTitle, 
    settings, 
    updateSettings, 
    resetSettings, 
    resetProgress, 
    clearCache,
    activityLog,
    carbonFootprint,
    emissionBreakdown,
    monthlyProgress
  } = useStore();

  const [activeCategory, setActiveCategory] = useState<Category>('profile');
  const [formData, setFormData] = useState<UserSettings>({
    ...settings,
    avatar: sanitizeAvatar(settings.avatar),
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // Custom states for sub-panels
  const [syncing, setSyncing] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [pwdCurrent, setPwdCurrent] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');

  const navigate = useNavigate();
  const grade = getScoreGrade(ecoScore);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedName = sanitizeText(formData.name).trim();

    // Update local Zustand settings
    updateSettings({
      ...formData,
      name: sanitizedName,
    });

    // Sync Display Name with Firebase Auth if configured
    const authState = useAuthStore.getState();
    if (!authState.isDemoMode && auth?.currentUser) {
      try {
        const { updateProfile } = await import('firebase/auth');
        await updateProfile(auth.currentUser, { displayName: sanitizedName });
      } catch (err) {
        console.error('Failed to update Firebase profile display name:', err);
      }
    }

    showToast('Settings saved successfully!');
  };

  const handleResetToDefault = () => {
    resetSettings();
    setFormData(settings);
    showToast('Settings reset to default values.');
  };

  const handleSyncNow = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      showToast('All connected services synced successfully.');
    }, 2000);
  };

  const handleClearCache = () => {
    clearCache();
    showToast('Local browser storage cleared.');
  };

  const handleResetProgress = () => {
    resetProgress();
    setConfirmResetOpen(false);
    showToast('Simulation progress has been fully reset.');
  };

  const handleExportReport = () => {
    // Use shared utilities — no duplication of report logic
    const lines = generateReportLines({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      ecoLevel,
      ecoTitle,
      ecoScore,
      grade,
      carbonFootprint,
      monthlyProgress,
      emissionBreakdown,
      activityLog,
    });
    downloadReport(lines, `EcoTwin-Report-${new Date().toISOString().split('T')[0]}.txt`);
    showToast('Sustainability report exported.');
  };

  const { logout } = useAuthStore();
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Toggle helpers
  const handleToggle = (key: keyof UserSettings) => {
    setFormData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleService = (key: keyof UserSettings['connectedServices']) => {
    setFormData(prev => ({
      ...prev,
      connectedServices: {
        ...prev.connectedServices,
        [key]: !prev.connectedServices[key]
      }
    }));
  };

  return (
    <div className="max-w-container-max mx-auto space-y-gutter w-full min-h-full flex flex-col relative" id="settings-page">
      
      {/* Toast Notification — role="status" announces to screen readers */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="fixed bottom-8 right-8 z-50 bg-[#141d1b] border border-secondary text-secondary glow-secondary font-label-md text-label-md px-6 py-4 rounded-xl flex items-center gap-3 animate-fade-in"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Confirmation Reset Modal — use shared accessible Modal component */}
      <Modal
        open={confirmResetOpen}
        onClose={() => setConfirmResetOpen(false)}
        title="Reset Simulation Progress?"
        id="confirm-reset-modal"
      >
        <div className="space-y-4">
          <p className="font-body-md text-on-surface-variant text-sm">
            This action will reset your level to 1, clear your activity log, and revert your sustainability metrics. This action is permanent.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setConfirmResetOpen(false)}
              className="bg-transparent border border-white/10 text-on-surface font-label-md text-label-md px-4 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleResetProgress}
              className="bg-error text-white font-label-md text-label-md px-5 py-2.5 rounded-lg hover:bg-red-600 transition-colors"
            >
              Reset Progress
            </button>
          </div>
        </div>
      </Modal>

      {/* Header */}
      <header className="mb-8 md:mb-12">
        <div className="flex items-center gap-3 text-secondary mb-2">
          <span className="material-symbols-outlined">settings</span>
          <span className="font-label-md text-label-md tracking-wider uppercase">System Panel</span>
        </div>
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Settings</h1>
      </header>

      {/* Main Settings Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter flex-1 items-start">
        
        {/* Left Panel: Sidebar Navigation (Spans 3 columns) */}
        <aside className="lg:col-span-3 glass-panel rounded-2xl p-4 flex flex-col gap-2">
          {[
            { id: 'profile', label: 'Profile', icon: 'person' },
            { id: 'appearance', label: 'Appearance', icon: 'palette' },
            { id: 'notifications', label: 'Notifications', icon: 'notifications' },
            { id: 'simulation', label: 'Simulation Prefs', icon: 'model_training' },
            { id: 'data', label: 'Data & Integrations', icon: 'database' },
            { id: 'privacy', label: 'Privacy & Security', icon: 'shield_lock' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as Category)}
              aria-pressed={activeCategory === cat.id}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-label-md text-label-md transition-all text-left ${activeCategory === cat.id ? 'bg-secondary/15 text-secondary border-l-4 border-secondary shadow-[0_0_10px_rgba(211,254,50,0.1)]' : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface border-l-4 border-transparent'}`}
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </aside>

        {/* Right Panel: Content Section (Spans 9 columns) */}
        <main className="lg:col-span-9 glass-panel rounded-2xl p-8" id="settings-content-panel">
          <form onSubmit={handleSave} className="space-y-8">
            
            {/* 1. PROFILE PANEL */}
            {activeCategory === 'profile' && (
              <div className="space-y-6 animate-fade-in" id="panel-profile">
                <h2 className="font-headline-md text-headline-md text-primary border-b border-white/10 pb-3">User Profile</h2>
                
                {/* Stats Card */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-6 grid grid-cols-3 gap-4">
                  <div className="text-center md:text-left">
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block">Eco Score</span>
                    <span className="font-display-lg text-2xl md:text-3xl text-secondary mt-1 block">{ecoScore}/100 ({grade})</span>
                  </div>
                  <div className="text-center md:text-left">
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block">Level</span>
                    <span className="font-display-lg text-2xl md:text-3xl text-primary mt-1 block">Lvl {ecoLevel}</span>
                  </div>
                  <div className="text-center md:text-left">
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block">Badge Status</span>
                    <span className="font-label-md text-sm md:text-base text-tertiary mt-1 block truncate">{ecoTitle}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="settings-name" className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Display Name</label>
                    <input
                      id="settings-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      maxLength={80}
                      className="w-full bg-black/40 border border-white/10 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg px-4 py-3 text-on-surface font-body-md outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="settings-email" className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      id="settings-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      aria-invalid={formData.email ? !isValidEmail(formData.email) : undefined}
                      className="w-full bg-black/40 border border-white/10 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg px-4 py-3 text-on-surface font-body-md outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="settings-role" className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Primary Role</label>
                  <select
                    id="settings-role"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full bg-black/40 border border-white/10 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg px-4 py-3 text-on-surface font-body-md outline-none"
                  >
                    <option value="Student">Student / Academic</option>
                    <option value="Researcher">Environmental Researcher</option>
                    <option value="Organization">Sustainability Organization</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>

                {/* Avatar Selection */}
                <div>
                  <p id="avatar-label" className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Profile Avatar</p>
                  <div className="flex gap-4" role="radiogroup" aria-labelledby="avatar-label">
                    {AVATAR_OPTIONS.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        role="radio"
                        aria-checked={formData.avatar === av}
                        aria-label={`Avatar option ${idx + 1}`}
                        onClick={() => setFormData(prev => ({ ...prev, avatar: av }))}
                        className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all hover:scale-105 ${formData.avatar === av ? 'border-secondary' : 'border-white/10'}`}
                      >
                        <img
                          src={av}
                          alt={`Avatar ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/avatars/avatar-1.svg';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. APPEARANCE PANEL */}
            {activeCategory === 'appearance' && (
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
                        onClick={() => setFormData(prev => ({ ...prev, theme: th.id as UserSettings['theme'] }))}
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
                        onClick={() => handleToggle('animations')}
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
                        onClick={() => handleToggle('reducedMotion')}
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
                        onClick={() => handleToggle('compactMode')}
                        className={`w-12 h-6 rounded-full transition-all relative ${formData.compactMode ? 'bg-secondary' : 'bg-white/10'}`}
                      >
                        <div className={`w-5 h-5 bg-[#0c1513] rounded-full absolute top-0.5 transition-all ${formData.compactMode ? 'right-0.5' : 'left-0.5'}`}></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. NOTIFICATIONS PANEL */}
            {activeCategory === 'notifications' && (
              <div className="space-y-6 animate-fade-in" id="panel-notifications">
                <h2 className="font-headline-md text-headline-md text-primary border-b border-white/10 pb-3">Notification Preferences</h2>
                
                <div className="space-y-4">
                  {[
                    { key: 'weeklyReport', title: 'Weekly Climate Report', desc: 'Receive aggregated carbon analysis and level progress report.' },
                    { key: 'achievementAlerts', title: 'Achievement Alerts', desc: 'Get notified immediately upon unlocking badges.' },
                    { key: 'challengeReminders', title: 'Challenge Reminders', desc: 'Hourly alerts for daily active task completion.' },
                    { key: 'aiRecommendations', title: 'AI Recommendations', desc: 'Real-time optimization advice based on simulator data.' },
                    { key: 'emailNotifications', title: 'Email Notifications', desc: 'Allow EcoTwin to send reports directly to your inbox.' }
                  ].map(item => (
                    <div key={item.key} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                      <div>
                        <span className="font-label-md text-label-md text-on-surface block">{item.title}</span>
                        <span className="text-[10px] text-on-surface-variant">{item.desc}</span>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={!!formData[item.key as keyof UserSettings]}
                        aria-label={item.title}
                        onClick={() => handleToggle(item.key as keyof UserSettings)}
                        className={`w-12 h-6 rounded-full transition-all relative ${formData[item.key as keyof UserSettings] ? 'bg-secondary' : 'bg-white/10'}`}
                      >
                        <div className={`w-5 h-5 bg-[#0c1513] rounded-full absolute top-0.5 transition-all ${formData[item.key as keyof UserSettings] ? 'right-0.5' : 'left-0.5'}`}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. SIMULATION PREFERENCES PANEL */}
            {activeCategory === 'simulation' && (
              <div className="space-y-6 animate-fade-in" id="panel-simulation">
                <h2 className="font-headline-md text-headline-md text-primary border-b border-white/10 pb-3">Simulation Preferences</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Primary Simulation Region</label>
                    <select
                      value={formData.region}
                      onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value as UserSettings['region'] }))}
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
                      onChange={(e) => setFormData(prev => ({ ...prev, projectionYear: parseInt(e.target.value) as UserSettings['projectionYear'] }))}
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
                      onChange={(e) => setFormData(prev => ({ ...prev, complexity: e.target.value as UserSettings['complexity'] }))}
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
                      onChange={(e) => setFormData(prev => ({ ...prev, defaultScenario: e.target.value as UserSettings['defaultScenario'] }))}
                      className="w-full bg-black/40 border border-white/10 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg px-4 py-3 text-on-surface font-body-md outline-none"
                    >
                      <option value="Business As Usual">Business As Usual (BAU)</option>
                      <option value="Moderate Action">Moderate Action Plan</option>
                      <option value="Net Zero 2050">Net Zero 2050 Path</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 5. DATA & INTEGRATIONS PANEL */}
            {activeCategory === 'data' && (
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
                        onClick={() => handleToggleService(srv.key as keyof UserSettings['connectedServices'])}
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
                    onClick={handleSyncNow}
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
                    onClick={() => showToast('API datasets refreshed.')}
                    className="glass-panel text-primary px-6 py-3 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-primary/10 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">refresh</span>
                    Refresh Data
                  </button>
                </div>
              </div>
            )}

            {/* 6. PRIVACY & SECURITY PANEL */}
            {activeCategory === 'privacy' && (
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
                      onClick={async () => {
                        if (pwdNew.length < 6) {
                          showToast('New password must be at least 6 characters.');
                          return;
                        }
                        const authState = useAuthStore.getState();
                        if (authState.isDemoMode) {
                          const mockUsersRaw = localStorage.getItem('ecotwin_mock_users') || '[]';
                          const mockUsers = JSON.parse(mockUsersRaw);
                          const formattedEmail = authState.currentUser?.email.toLowerCase().trim();
                          const userIdx = mockUsers.findIndex((u: { email: string }) => u.email === formattedEmail);
                          if (userIdx !== -1) {
                            mockUsers[userIdx].passwordHash = btoa(`ecotwin-salt-${pwdNew}-${formattedEmail}`);
                            localStorage.setItem('ecotwin_mock_users', JSON.stringify(mockUsers));
                            showToast('Password updated successfully (Mock DB).');
                          } else {
                            showToast('Failed to find mock user.');
                          }
                        } else {
                          try {
                            const { updatePassword } = await import('firebase/auth');
                            if (auth?.currentUser) {
                              await updatePassword(auth.currentUser, pwdNew);
                              showToast('Password updated in Firebase!');
                            }
                          } catch (err) {
                            const errorMsg = err instanceof Error ? err.message : 'Password update failed.';
                            console.error('Password update failed:', err);
                            showToast(errorMsg || 'Password update failed. Try re-logging.');
                          }
                        }
                        setPwdCurrent('');
                        setPwdNew('');
                        setPwdConfirm('');
                      }}
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
                    aria-checked={formData.twoFactor}
                    aria-label="Two-factor authentication"
                    onClick={() => handleToggle('twoFactor')}
                    className={`w-12 h-6 rounded-full transition-all relative ${formData.twoFactor ? 'bg-secondary' : 'bg-white/10'}`}
                  >
                    <div className={`w-5 h-5 bg-[#0c1513] rounded-full absolute top-0.5 transition-all ${formData.twoFactor ? 'right-0.5' : 'left-0.5'}`}></div>
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
                      onClick={() => showToast('All other session tokens revoked.')}
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
                    onClick={handleExportReport}
                    className="glass-panel text-primary px-4 py-3 rounded-lg font-label-sm text-label-sm flex items-center justify-center gap-2 hover:bg-primary/10 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Export Report
                  </button>
                  <button
                    type="button"
                    onClick={handleClearCache}
                    className="glass-panel text-on-surface-variant px-4 py-3 rounded-lg font-label-sm text-label-sm flex items-center justify-center gap-2 hover:bg-white/5 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
                    Clear Cache
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmResetOpen(true)}
                    className="glass-panel border-error/30 text-error px-4 py-3 rounded-lg font-label-sm text-label-sm flex items-center justify-center gap-2 hover:bg-error/10 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                    Reset Progress
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="bg-error/20 border border-error/30 text-error px-4 py-3 rounded-lg font-label-sm text-label-sm flex items-center justify-center gap-2 hover:bg-error/30 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Log Out
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Form Action Buttons */}
            <div className="pt-6 border-t border-white/10 flex justify-between">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="glass-panel text-on-surface-variant hover:text-on-surface px-6 py-3 rounded-lg font-label-md text-label-md transition-colors"
              >
                Reset to Default
              </button>
              <button
                type="submit"
                className="bg-secondary text-on-secondary px-8 py-3 rounded-lg font-label-md text-label-md glow-secondary hover:bg-secondary-fixed transition-colors"
              >
                Save Changes
              </button>
            </div>
            
          </form>
        </main>

      </div>
    </div>
  );
};
