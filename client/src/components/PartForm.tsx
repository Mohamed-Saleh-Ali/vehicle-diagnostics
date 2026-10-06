import { useState, type FormEvent } from 'react';
import type { Part, PartInput } from '../types';

type Props = {
  categories: string[];
  initial?: Part | null;
  busy: boolean;
  error?: string;
  onSubmit: (input: PartInput) => void;
  onCancel: () => void;
};

const empty: PartInput = { partNumber: '', name: '', category: '', description: '', compatibilityNote: '', price: 0 };

// used for create and edit
export default function PartForm({ categories, initial, busy, error, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<PartInput>(() =>
    initial
      ? {
          partNumber: initial.partNumber,
          name: initial.name,
          category: initial.category,
          description: initial.description,
          compatibilityNote: initial.compatibilityNote,
          price: initial.price
        }
      : { ...empty, category: categories[0] ?? '' }
  );

  const update = <K extends keyof PartInput>(key: K, value: PartInput[K]) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit({ ...form, partNumber: form.partNumber.trim().toUpperCase() });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Part number *</legend>
        <input
          className="input w-full font-mono uppercase"
          placeholder="BRK-1234"
          required
          value={form.partNumber}
          onChange={e => update('partNumber', e.target.value)}
        />
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Category *</legend>
        <select className="select w-full" value={form.category} onChange={e => update('category', e.target.value)}>
          {categories.map(category => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </fieldset>
      <fieldset className="fieldset sm:col-span-2">
        <legend className="fieldset-legend">Name *</legend>
        <input className="input w-full" required minLength={2} value={form.name} onChange={e => update('name', e.target.value)} />
      </fieldset>
      <fieldset className="fieldset sm:col-span-2">
        <legend className="fieldset-legend">Description</legend>
        <textarea
          className="textarea w-full"
          rows={3}
          value={form.description}
          onChange={e => update('description', e.target.value)}
        />
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Compatibility note</legend>
        <input
          className="input w-full"
          placeholder="e.g. Compact cars 2014-2022"
          value={form.compatibilityNote}
          onChange={e => update('compatibilityNote', e.target.value)}
        />
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Price (EUR) *</legend>
        <input
          className="input w-full"
          type="number"
          min={0}
          step="0.01"
          required
          value={form.price}
          onChange={e => update('price', Number(e.target.value))}
        />
      </fieldset>

      {error && (
        <div role="alert" className="alert alert-error alert-soft sm:col-span-2">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-2 sm:col-span-2">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy && <span className="loading loading-spinner loading-sm" />}
          {initial ? 'Save changes' : 'Add part'}
        </button>
      </div>
    </form>
  );
}
