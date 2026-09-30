import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

type Health = { status: string; time: string };

export default function App() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then(res => res.json() as Promise<Health>)
      .then(setHealth)
      .catch(() => setError('API not reachable (the free server may be waking up, try again in a minute)'));
  }, []);

  return (
    <main className="grid min-h-screen place-items-center p-6">
      <div className="card card-border w-full max-w-md bg-base-100 shadow-sm">
        <div className="card-body items-center gap-4 text-center">
          <h1 className="text-3xl font-bold">
            Diag<span className="text-primary">Bay</span>
          </h1>
          <p className="text-base-content/70">Vehicle parts & diagnostics for small workshops. Coming soon.</p>
          {!health && !error && <span className="loading loading-dots loading-md text-primary" />}
          {health && <div className="badge badge-success">API: {health.status}</div>}
          {error && <div className="alert alert-error alert-soft text-sm">{error}</div>}
          <code className="text-xs text-base-content/50">{API_URL}</code>
        </div>
      </div>
    </main>
  );
}
