import { useState } from 'react';
import { Link } from 'react-router';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { api, errorMessage } from '../utils/api';
import type { Diagnosis, DiagnosisInput } from '../types';
import SymptomForm from '../components/SymptomForm';
import DiagnosisCard from '../components/DiagnosisCard';
import { ErrorAlert } from '../components/StatusViews';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function DiagnosePage() {
  useDocumentTitle('Diagnose');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [error, setError] = useState('');
  const [lastInput, setLastInput] = useState<DiagnosisInput | null>(null);

  const runDiagnosis = async (input: DiagnosisInput) => {
    setLastInput(input);
    setStatus('loading');
    setError('');
    try {
      setDiagnosis(await api.createDiagnosis(input));
      setStatus('success');
    } catch (err) {
      setError(errorMessage(err));
      setStatus('error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI diagnosis</h1>
        <p className="text-base-content/70">Describe the symptom in the customer's words. The result is saved to your history.</p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <SymptomForm busy={status === 'loading'} onSubmit={runDiagnosis} />

        <div className="space-y-4" aria-live="polite">
          {status === 'idle' && (
            <div className="flex flex-col items-center gap-3 rounded-box border border-dashed border-base-300 bg-base-100 px-6 py-16 text-center text-base-content/60">
              <Sparkles size={32} />
              <p>The structured diagnosis will appear here.</p>
            </div>
          )}

          {status === 'loading' && (
            <div className="card card-border bg-base-100">
              <div className="card-body gap-4">
                <div className="flex items-center gap-3">
                  <span className="loading loading-dots loading-md text-primary" />
                  <span className="font-medium">Analysing the symptom…</span>
                </div>
                <div className="skeleton h-8 w-1/2" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-5/6" />
                <div className="skeleton h-4 w-2/3" />
                <div className="skeleton h-10 w-40" />
              </div>
            </div>
          )}

          {status === 'error' && (
            <ErrorAlert message={error} onRetry={lastInput ? () => runDiagnosis(lastInput) : undefined} />
          )}

          {status === 'success' && diagnosis && (
            <>
              <DiagnosisCard diagnosis={diagnosis} />
              <div className="alert alert-success alert-soft">
                <CheckCircle2 size={18} />
                <span>Saved to your history.</span>
                <Link to={`/diagnoses/${diagnosis._id}`} className="btn btn-sm">
                  Open
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
