import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, Car, Trash2 } from 'lucide-react';
import { api, errorMessage } from '../utils/api';
import type { Diagnosis } from '../types';
import DiagnosisCard from '../components/DiagnosisCard';
import ConfirmDialog from '../components/ConfirmDialog';
import { ErrorAlert, Loading } from '../components/StatusViews';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function DiagnosisDetailsPage() {
  useDocumentTitle('Diagnosis');
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .getDiagnosis(id)
      .then(setDiagnosis)
      .catch(err => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.deleteDiagnosis(id);
      navigate('/diagnoses', { replace: true });
    } catch (err) {
      setError(errorMessage(err));
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/diagnoses" className="btn btn-ghost btn-sm">
        <ArrowLeft size={16} /> My diagnoses
      </Link>

      {error && <ErrorAlert message={error} />}

      {diagnosis && (
        <>
          <section className="rounded-box border border-base-300 bg-base-100 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-base-content/60">Customer reported</p>
            <blockquote className="mt-1 text-lg">“{diagnosis.symptomDescription}”</blockquote>
            {diagnosis.vehicleNote && (
              <p className="mt-2 flex items-center gap-2 text-sm text-base-content/70">
                <Car size={16} /> {diagnosis.vehicleNote}
              </p>
            )}
          </section>

          <DiagnosisCard diagnosis={diagnosis} />

          <div className="flex justify-end">
            <button className="btn btn-error btn-outline" onClick={() => setConfirmOpen(true)}>
              <Trash2 size={16} /> Delete diagnosis
            </button>
          </div>
        </>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this diagnosis?"
        text="It will be removed from your history. This cannot be undone."
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
