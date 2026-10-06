import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { api, errorMessage } from '../utils/api';
import type { Part, PartInput } from '../types';
import PartForm from '../components/PartForm';
import ConfirmDialog from '../components/ConfirmDialog';
import { EmptyState, ErrorAlert, Loading } from '../components/StatusViews';
import { formatPrice } from '../utils/format';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

type FormState = { open: false } | { open: true; part: Part | null };

export default function ManagePartsPage() {
  useDocumentTitle('Manage parts');
  const [searchParams, setSearchParams] = useSearchParams();
  const [parts, setParts] = useState<Part[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState<FormState>({ open: false });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Part | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    Promise.all([api.getParts(), api.getCategories()])
      .then(([partList, categoryList]) => {
        setParts(partList);
        setCategories(categoryList);
        // ?edit=<id> opens the form directly
        const editId = searchParams.get('edit');
        const toEdit = editId ? partList.find(p => p._id === editId) : undefined;
        if (toEdit) setForm({ open: true, part: toEdit });
      })
      .catch(err => setError(errorMessage(err)))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleParts = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) return parts;
    return parts.filter(p => `${p.partNumber} ${p.name} ${p.category}`.toLowerCase().includes(term));
  }, [parts, filter]);

  const openForm = (part: Part | null) => {
    setFormError('');
    setForm({ open: true, part });
  };

  const closeForm = () => {
    setForm({ open: false });
    if (searchParams.has('edit')) setSearchParams({}, { replace: true });
  };

  const handleSave = async (input: PartInput) => {
    if (!form.open) return;
    setSaving(true);
    setFormError('');
    try {
      if (form.part) {
        const updated = await api.updatePart(form.part._id, input);
        setParts(prev => prev.map(p => (p._id === updated._id ? updated : p)));
      } else {
        const created = await api.createPart(input);
        setParts(prev => [created, ...prev]);
      }
      closeForm();
    } catch (err) {
      setFormError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.deletePart(toDelete._id);
      setParts(prev => prev.filter(p => p._id !== toDelete._id));
      setToDelete(null);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage parts</h1>
          <p className="text-base-content/70">{parts.length} parts in the catalog · admin only</p>
        </div>
        <button className="btn btn-primary" onClick={() => openForm(null)}>
          <Plus size={18} /> Add part
        </button>
      </div>

      {error && <ErrorAlert message={error} />}

      <label className="input w-full sm:w-80">
        <Search size={16} className="opacity-60" />
        <input type="search" placeholder="Filter…" value={filter} onChange={e => setFilter(e.target.value)} />
      </label>

      {visibleParts.length === 0 ? (
        <EmptyState title="No parts" text="Add the first part or change the filter." />
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Part no.</th>
                <th>Name</th>
                <th className="hidden md:table-cell">Category</th>
                <th className="text-right">Price</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleParts.map(part => (
                <tr key={part._id}>
                  <td className="font-mono text-xs">{part.partNumber}</td>
                  <td>
                    <Link to={`/parts/${part._id}`} className="link-hover">
                      {part.name}
                    </Link>
                  </td>
                  <td className="hidden md:table-cell">
                    <span className="badge badge-ghost badge-sm">{part.category}</span>
                  </td>
                  <td className="text-right">{formatPrice(part.price)}</td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button className="btn btn-ghost btn-xs" onClick={() => openForm(part)} aria-label="Edit">
                        <Pencil size={14} />
                      </button>
                      <button className="btn btn-ghost btn-xs text-error" onClick={() => setToDelete(part)} aria-label="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {form.open && (
        <div className="modal modal-open" role="dialog" aria-modal="true">
          <div className="modal-box max-w-2xl">
            <h3 className="mb-4 text-lg font-bold">{form.part ? `Edit ${form.part.partNumber}` : 'Add a part'}</h3>
            <PartForm
              key={form.part?._id ?? 'new'}
              categories={categories}
              initial={form.part}
              busy={saving}
              error={formError}
              onSubmit={handleSave}
              onCancel={closeForm}
            />
          </div>
          <button className="modal-backdrop" onClick={closeForm} aria-label="Close" />
        </div>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this part?"
        text={`${toDelete?.partNumber} · ${toDelete?.name} will be removed from the catalog.`}
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
