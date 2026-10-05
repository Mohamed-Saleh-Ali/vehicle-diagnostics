import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Search, Stethoscope } from 'lucide-react';
import { api, errorMessage } from '../utils/api';
import type { Part } from '../types';
import PartCard from '../components/PartCard';
import CategoryChips from '../components/CategoryChips';
import { EmptyState, ErrorAlert } from '../components/StatusViews';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function CatalogPage() {
  useDocumentTitle('Parts catalog');
  // filters live in the URL so /?category=Brakes can be linked
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? undefined;

  const [input, setInput] = useState(q);
  const [categories, setCategories] = useState<string[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const updateParams = (next: { q?: string; category?: string }) => {
    const params = new URLSearchParams();
    if (next.q) params.set('q', next.q);
    if (next.category) params.set('category', next.category);
    setSearchParams(params, { replace: true });
  };

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  // debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.trim() !== q) updateParams({ q: input.trim(), category });
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  useEffect(() => {
    let ignore = false; // ignore stale responses
    setLoading(true);
    setError('');
    api
      .getParts({ q: q || undefined, category })
      .then(data => !ignore && setParts(data))
      .catch(err => !ignore && setError(errorMessage(err)))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [q, category, reloadKey]);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden border-l-8 border-primary bg-neutral p-8 text-neutral-content md:p-10">
        <div className="max-w-2xl space-y-4">
          <p className="font-mono text-sm uppercase tracking-wider text-primary">§ For small workshops</p>
          <h1 className="text-4xl font-extrabold leading-none md:text-6xl">
            From a vague customer complaint to the right parts in seconds.
          </h1>
          <p className="text-neutral-content/80">
            Describe the symptom, get a structured first diagnosis, jump straight to matching part categories.
          </p>
          <Link to="/diagnose" className="btn btn-primary">
            <Stethoscope size={18} /> Run a diagnosis
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold">Parts catalog</h2>
          <label className="input w-full md:w-80">
            <Search size={16} className="opacity-60" />
            <input
              type="search"
              placeholder="Search name, number, description…"
              value={input}
              onChange={e => setInput(e.target.value)}
              aria-label="Search parts"
            />
          </label>
        </div>
        <CategoryChips categories={categories} active={category} onSelect={c => updateParams({ q, category: c })} />

        {error ? (
          <ErrorAlert message={error} onRetry={() => setReloadKey(k => k + 1)} />
        ) : loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="skeleton h-44 w-full" />
            ))}
          </div>
        ) : parts.length === 0 ? (
          <EmptyState
            title="No parts found"
            text="Try another search term or category."
            action={
              <button
                className="btn btn-sm"
                onClick={() => {
                  setInput('');
                  updateParams({});
                }}
              >
                Clear filters
              </button>
            }
          />
        ) : (
          <>
            <p className="text-sm text-base-content/60">{parts.length} parts</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {parts.map(part => (
                <PartCard key={part._id} part={part} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
