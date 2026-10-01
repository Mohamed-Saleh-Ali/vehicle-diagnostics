import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { errorMessage } from '../utils/api';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function RegisterPage() {
  useDocumentTitle('Sign up');
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/diagnose" replace />;

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (form.password.length < 8) return setError('Password must be at least 8 characters');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    setBusy(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/diagnose', { replace: true });
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
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-base-content/70">New accounts are technician accounts.</p>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Name</legend>
            <input className="input w-full" required minLength={2} value={form.name} onChange={update('name')} />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input className="input w-full" type="email" autoComplete="email" required value={form.email} onChange={update('email')} />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Password</legend>
            <input
              className="input w-full"
              type="password"
              autoComplete="new-password"
              required
              value={form.password}
              onChange={update('password')}
            />
            <span className="label">At least 8 characters</span>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Confirm password</legend>
            <input
              className="input w-full"
              type="password"
              autoComplete="new-password"
              required
              value={form.confirm}
              onChange={update('confirm')}
            />
          </fieldset>

          {error && (
            <div role="alert" className="alert alert-error alert-soft">
              {error}
            </div>
          )}

          <button className="btn btn-primary mt-2" disabled={busy}>
            {busy && <span className="loading loading-spinner loading-sm" />}
            Sign up
          </button>
          <p className="text-center text-sm">
            Already registered?{' '}
            <Link to="/login" className="link link-primary">
              Log in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
