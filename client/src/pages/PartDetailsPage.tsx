import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { api, errorMessage } from '../utils/api';
import type { Part } from '../types';
import { useAuth } from '../hooks/useAuth';
import { ErrorAlert, Loading } from '../components/StatusViews';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatDate, formatPrice } from '../utils/format';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function PartDetailsPage() {
  const { id = '' } = useParams();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [part, setPart] = useState<Part | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  useDocumentTitle(part?.name ?? 'Part');

  useEffect(() => {
    setLoading(true);
    api
      .getPart(id)
      .then(setPart)
      .catch(err => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.deletePart(id);
      navigate('/', { replace: true });
    } catch (err) {
      setError(errorMessage(err));
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/" className="btn btn-ghost btn-sm">
        <ArrowLeft size={16} /> Back to catalog
      </Link>

      {error && <ErrorAlert message={error} />}

      {part && (
        <article className="card card-border bg-base-100">
          <div className="card-body gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Link to={`/?category=${encodeURIComponent(part.category)}`} className="badge badge-soft badge-primary">
                {part.category}
              </Link>
              <span className="font-mono text-sm text-base-content/60">{part.partNumber}</span>
            </div>
            <h1 className="text-3xl font-bold">{part.name}</h1>
            <p className="text-3xl font-bold text-primary">{formatPrice(part.price)}</p>
            <p className="text-base-content/80">{part.description || 'No description.'}</p>
            <div className="rounded-box bg-base-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-base-content/60">Compatibility</p>
              <p>{part.compatibilityNote || 'Not specified'}</p>
            </div>
            <p className="text-xs text-base-content/50">Last updated {formatDate(part.updatedAt)}</p>

            {isAdmin && (
              <div className="card-actions justify-end border-t border-base-300 pt-4">
                <Link to={`/admin/parts?edit=${part._id}`} className="btn btn-outline btn-sm">
                  <Pencil size={14} /> Edit
                </Link>
                <button className="btn btn-error btn-outline btn-sm" onClick={() => setConfirmOpen(true)}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        </article>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this part?"
        text={`${part?.partNumber} · ${part?.name} will be removed from the catalog.`}
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
