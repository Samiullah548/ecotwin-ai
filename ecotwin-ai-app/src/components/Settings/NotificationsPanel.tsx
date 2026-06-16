import React from 'react';
import type { UserSettings } from '../../store/useStore';

interface NotificationsPanelProps {
  formData: UserSettings;
  onToggle: (key: keyof UserSettings) => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  formData,
  onToggle,
}) => (
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
            onClick={() => onToggle(item.key as keyof UserSettings)}
            className={`w-12 h-6 rounded-full transition-all relative ${formData[item.key as keyof UserSettings] ? 'bg-secondary' : 'bg-white/10'}`}
          >
            <div className={`w-5 h-5 bg-[#0c1513] rounded-full absolute top-0.5 transition-all ${formData[item.key as keyof UserSettings] ? 'right-0.5' : 'left-0.5'}`}></div>
          </button>
        </div>
      ))}
    </div>
  </div>
);
