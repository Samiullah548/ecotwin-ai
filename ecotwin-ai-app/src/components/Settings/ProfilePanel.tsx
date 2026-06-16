import React from 'react';
import type { UserSettings } from '../../store/useStore';
import { AVATAR_OPTIONS } from '../../utils/constants';
import { isValidEmail } from '../../utils/sanitize';

interface ProfilePanelProps {
  formData: UserSettings;
  onChange: (updated: Partial<UserSettings>) => void;
  ecoScore: number;
  ecoLevel: number;
  ecoTitle: string;
  grade: string;
}

export const ProfilePanel: React.FC<ProfilePanelProps> = ({
  formData,
  onChange,
  ecoScore,
  ecoLevel,
  ecoTitle,
  grade,
}) => (
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
          onChange={(e) => onChange({ name: e.target.value })}
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
          onChange={(e) => onChange({ email: e.target.value })}
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
        onChange={(e) => onChange({ role: e.target.value })}
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
            onClick={() => onChange({ avatar: av })}
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
);
