import { useState, type FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Mail, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export function LoginPage() {
  const { session, loading, signInWithEmail } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center text-ink-muted text-sm">
        Loading…
      </div>
    );
  }

  if (session) {
    const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/';
    return <Navigate to={from} replace />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    const { error: err } = await signInWithEmail(email.trim());
    setSubmitting(false);
    if (err) setError(err);
    else setSent(true);
  }

  return (
    <div className="min-h-full flex items-center justify-center px-5 py-16 bg-bone-warm">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">Lead Tracker</p>
          <h1 className="font-serif text-4xl text-ink mt-2 leading-tight">
            Sign in.
          </h1>
          <p className="text-sm text-ink-muted mt-3">
            Camp Hill · Brisbane. We'll email you a one-tap link.
          </p>
        </div>

        {sent ? (
          <div className="card p-6">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-8 w-8 rounded-full bg-forest/10 text-forest flex items-center justify-center">
                <Check className="h-4 w-4" />
              </div>
              <div>
                <p className="font-serif text-lg text-ink">Check your inbox.</p>
                <p className="text-sm text-ink-muted mt-1">
                  We sent a magic link to <span className="text-ink">{email}</span>.
                  Tap it on this device to sign in.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="card p-6 space-y-4">
            <label className="block">
              <span className="block text-xs font-medium text-ink-muted mb-2">
                Email
              </span>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  className="input pl-10"
                  placeholder="you@place.com.au"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </label>

            {error && (
              <p className="text-xs text-urgent-overdue">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting || !email.trim()}
              className="btn-primary w-full"
            >
              {submitting ? 'Sending…' : 'Send magic link'}
              {!submitting && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
