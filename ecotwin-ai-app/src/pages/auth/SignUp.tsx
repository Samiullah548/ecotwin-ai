import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { sanitizeText, isValidEmail } from '../../utils/sanitize';

export const SignUp: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { signUp, error, clearError, isDemoMode } = useAuthStore();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    const sanitizedName = sanitizeText(name).trim();
    const sanitizedEmail = sanitizeText(email).trim();

    if (!sanitizedName || !sanitizedEmail || !password || !confirmPassword) {
      setLocalError('All fields are required.');
      return;
    }

    if (sanitizedName.length < 2) {
      setLocalError('Full name must be at least 2 characters.');
      return;
    }

    if (!isValidEmail(sanitizedEmail)) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await signUp(sanitizedName, sanitizedEmail, password);
    setLoading(false);

    if (res.success) {
      navigate('/');
    }
  };

  return (
    <div
      className="h-screen w-full flex flex-col items-center justify-start relative overflow-y-auto overflow-x-hidden px-4 py-8 md:py-12"
      style={{ background: 'radial-gradient(circle at 50% 0%, #0f2922 0%, #0c1513 70%)' }}
    >
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10 flex flex-col gap-6 my-auto">
        {/* Logo Header */}
        <div className="flex flex-col items-center text-center gap-2 mb-2">
          <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center glow-tertiary mb-2">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              eco
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight">
            EcoTwin AI
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Create an account to start your personalized eco companion.
          </p>
        </div>

        {/* Setup Config Warning Banner for Mock mode */}
        {isDemoMode && import.meta.env.DEV && (
          <div className="border border-secondary/20 bg-secondary/5 backdrop-blur-md rounded-xl p-4 flex gap-3 text-left">
            <span className="material-symbols-outlined text-secondary shrink-0">
              info
            </span>
            <div className="flex flex-col gap-1">
              <span className="font-label-md text-label-md text-secondary font-bold">
                Demo Mode Active
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Creating local mock account. Configure real credentials in the <code className="bg-white/5 px-1 py-0.5 rounded text-white text-[11px]">.env</code> file to enable Firebase.
              </span>
            </div>
          </div>
        )}

        {/* Card Form */}
        <div className="glass-panel rounded-2xl p-8 border border-white/5 bg-surface-container-low/80 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-white/10 to-transparent" />

          <h2 className="font-headline-md text-headline-md text-on-surface mb-6 font-bold">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-name" className="font-label-sm text-label-sm text-on-surface-variant">
                Full Name
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[20px]">
                  person
                </span>
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Eco Explorer"
                  className="w-full bg-surface-container-lowest/60 text-on-surface placeholder:text-on-surface-variant/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 font-body-md text-body-md outline-none focus:border-secondary/40 transition-colors"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-email" className="font-label-sm text-label-sm text-on-surface-variant">
                Email Address
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[20px]">
                  mail
                </span>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="explorer@ecotwin.ai"
                  className="w-full bg-surface-container-lowest/60 text-on-surface placeholder:text-on-surface-variant/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 font-body-md text-body-md outline-none focus:border-secondary/40 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-password" className="font-label-sm text-label-sm text-on-surface-variant">
                Password (min 6 characters)
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[20px]">
                  lock
                </span>
                <input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-lowest/60 text-on-surface placeholder:text-on-surface-variant/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 font-body-md text-body-md outline-none focus:border-secondary/40 transition-colors"
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-confirm" className="font-label-sm text-label-sm text-on-surface-variant">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[20px]">
                  lock
                </span>
                <input
                  id="signup-confirm"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-lowest/60 text-on-surface placeholder:text-on-surface-variant/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 font-body-md text-body-md outline-none focus:border-secondary/40 transition-colors"
                />
              </div>
            </div>

            {/* Error Announcements */}
            {(localError || error) && (
              <div
                role="alert"
                aria-live="assertive"
                className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-lg font-body-sm text-body-sm mt-2"
              >
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{localError || error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-on-secondary font-label-md text-label-md font-bold py-2.5 rounded-lg hover:bg-secondary-fixed transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(211,254,50,0.2)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-4"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">
                    autorenew
                  </span>
                  Registering...
                </>
              ) : (
                <>
                  Create Account
                  <span className="material-symbols-outlined text-[20px]">
                    person_add
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Redirect to Login */}
          <div className="mt-6 pt-6 border-t border-white/5 text-center font-body-sm text-body-sm text-on-surface-variant">
            Already have an account?{' '}
            <Link to="/login" className="text-secondary hover:underline font-bold">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
