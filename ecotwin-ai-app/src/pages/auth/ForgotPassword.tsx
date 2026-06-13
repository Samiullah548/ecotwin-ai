import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { sanitizeText, isValidEmail } from '../../utils/sanitize';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const { resetPassword, error, clearError } = useAuthStore();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();
    setSuccess(false);

    const sanitizedEmail = sanitizeText(email).trim();
    if (!sanitizedEmail) {
      setLocalError('Please enter your email address.');
      return;
    }

    if (!isValidEmail(sanitizedEmail)) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    const res = await resetPassword(sanitizedEmail);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setEmail('');
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
        </div>

        {/* Card Form */}
        <div className="glass-panel rounded-2xl p-8 border border-white/5 bg-surface-container-low/80 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-white/10 to-transparent" />

          <h2 className="font-headline-md text-headline-md text-on-surface mb-4 font-bold">
            Reset Password
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            Enter your registered email address and we'll send you instructions to reset your password.
          </p>

          {success ? (
            <div className="space-y-6">
              <div
                role="status"
                aria-live="polite"
                className="flex flex-col items-center text-center bg-secondary/10 border border-secondary/20 p-6 rounded-xl gap-3"
              >
                <span className="material-symbols-outlined text-secondary text-4xl animate-[bounce_1s_infinite]">
                  check_circle
                </span>
                <span className="font-label-md text-label-md text-secondary font-bold">
                  Reset Email Sent
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  We've dispatched a password reset link to your email inbox. Please check your junk/spam folder if it doesn't appear shortly.
                </span>
              </div>
              <Link
                to="/login"
                className="w-full bg-secondary text-on-secondary font-label-md text-label-md font-bold py-2.5 rounded-lg hover:bg-secondary-fixed transition-all flex items-center justify-center gap-2"
              >
                Back to Login
                <span className="material-symbols-outlined text-[20px]">
                  arrow_back
                </span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="reset-email" className="font-label-md text-label-md text-on-surface-variant">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[20px]">
                    mail
                  </span>
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="explorer@ecotwin.ai"
                    className="w-full bg-surface-container-lowest/60 text-on-surface placeholder:text-on-surface-variant/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 font-body-md text-body-md outline-none focus:border-secondary/40 transition-colors"
                  />
                </div>
              </div>

              {/* Error Announcements */}
              {(localError || error) && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 rounded-lg font-body-sm text-body-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{localError || error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary text-on-secondary font-label-md text-label-md font-bold py-3 rounded-lg hover:bg-secondary-fixed transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(211,254,50,0.2)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-[20px] animate-spin">
                      autorenew
                    </span>
                    Sending link...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <span className="material-symbols-outlined text-[20px]">
                      send
                    </span>
                  </>
                )}
              </button>

              {/* Go Back to Login */}
              <div className="text-center pt-2">
                <Link to="/login" className="text-on-surface-variant hover:text-secondary hover:underline font-label-sm text-label-sm">
                  Cancel and return to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
