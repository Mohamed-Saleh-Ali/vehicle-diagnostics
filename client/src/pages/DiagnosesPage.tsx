import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ChevronRight, Plus } from 'lucide-react';
import { api, errorMessage } from '../utils/api';
import type { Diagnosis } from '../types';
import UrgencyBadge from '../components/UrgencyBadge';
import { EmptyState, ErrorAlert, Loading } from '../components/StatusViews';
import { formatDate } from '../utils/format';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function DiagnosesPage() {
  useDocumentTitle('My diagnoses');
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .getDiagnoses()
      .then(setDiagnoses)
      .catch(err => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [reloadKey]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My diagnoses</h1>
          <p className="text-base-content/70">Only you can see these.</p>
        </div>
        <Link to="/diagnose" className="btn btn-primary">
          <Plus size={18} /> New diagnosis
        </Link>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorAlert message={error} onRetry={() => setReloadKey(k => k + 1)} />
      ) : diagnoses.length === 0 ? (
        <EmptyState
          title="No diagnoses yet"
          text="Run your first diagnosis. It will show up here."
          action={
            <Link to="/diagnose" className="btn btn-primary btn-sm">
              Run a diagnosis
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {diagnoses.map(diagnosis => (
            <li key={diagnosis._id}>
              <Link
                to={`/diagnoses/${diagnosis._id}`}
                className="flex items-center gap-4 rounded-box border border-base-300 bg-base-100 p-4 transition hover:border-primary"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{diagnosis.result.subsystem}</span>
                    <UrgencyBadge urgency={diagnosis.result.urgency} />
                  </div>
                  <p className="truncate text-sm text-base-content/70">“{diagnosis.symptomDescription}”</p>
                  <p className="text-xs text-base-content/50">{formatDate(diagnosis.createdAt)}</p>
                </div>
                <ChevronRight size={18} className="shrink-0 text-base-content/40" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
