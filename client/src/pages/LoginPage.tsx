import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { errorMessage } from '../utils/api';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function LoginPage() {
  useDocumentTitle('Log in');
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/diagnose';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={from} replace />;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <form onSubmit={handleSubmit} className="card card-border bg-base-100">
        <div className="card-body gap-3">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-base-content/70">Log in to run diagnoses and see your history.</p>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input
              className="input w-full"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Password</legend>
            <input
              className="input w-full"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </fieldset>

          {error && (
            <div role="alert" className="alert alert-error alert-soft">
              {error}
            </div>
          )}

          <button className="btn btn-primary mt-2" disabled={busy}>
            {busy && <span className="loading loading-spinner loading-sm" />}
            Log in
          </button>
          <p className="text-center text-sm">
            No account yet?{' '}
            <Link to="/register" className="link link-primary">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
