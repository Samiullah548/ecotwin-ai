import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, getScoreGrade } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import { auth } from '../firebase';
import type { UserSettings } from '../store/useStore';
import { Modal } from '../components/Modal';
import { sanitizeText, sanitizeAvatar } from '../utils/sanitize';
import { generateReportLines, downloadReport } from '../utils/carbonCalculations';

// Subcomponents for settings panels
import { ProfilePanel } from '../components/Settings/ProfilePanel';
import { AppearancePanel } from '../components/Settings/AppearancePanel';
import { NotificationsPanel } from '../components/Settings/NotificationsPanel';
import { SimulationPanel } from '../components/Settings/SimulationPanel';
import { DataPanel } from '../components/Settings/DataPanel';
import { PrivacyPanel } from '../components/Settings/PrivacyPanel';

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
            
            {activeCategory === 'profile' && (
              <ProfilePanel
                formData={formData}
                onChange={(updated) => setFormData(prev => ({ ...prev, ...updated }))}
                ecoScore={ecoScore}
                ecoLevel={ecoLevel}
                ecoTitle={ecoTitle}
                grade={grade}
              />
            )}

            {activeCategory === 'appearance' && (
              <AppearancePanel
                formData={formData}
                onToggle={handleToggle}
                onChange={(updated) => setFormData(prev => ({ ...prev, ...updated }))}
              />
            )}

            {activeCategory === 'notifications' && (
              <NotificationsPanel
                formData={formData}
                onToggle={handleToggle}
              />
            )}

            {activeCategory === 'simulation' && (
              <SimulationPanel
                formData={formData}
                onChange={(updated) => setFormData(prev => ({ ...prev, ...updated }))}
              />
            )}

            {activeCategory === 'data' && (
              <DataPanel
                formData={formData}
                onToggleService={handleToggleService}
                syncing={syncing}
                onSyncNow={handleSyncNow}
                onRefreshData={() => showToast('API datasets refreshed.')}
              />
            )}

            {activeCategory === 'privacy' && (
              <PrivacyPanel
                pwdCurrent={pwdCurrent}
                setPwdCurrent={setPwdCurrent}
                pwdNew={pwdNew}
                setPwdNew={setPwdNew}
                pwdConfirm={pwdConfirm}
                setPwdConfirm={setPwdConfirm}
                onApplyPasswordChange={async () => {
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
                twoFactor={formData.twoFactor}
                onToggleTwoFactor={() => handleToggle('twoFactor')}
                onExportReport={handleExportReport}
                onClearCache={handleClearCache}
                onResetProgress={() => setConfirmResetOpen(true)}
                onLogout={handleLogout}
              />
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
