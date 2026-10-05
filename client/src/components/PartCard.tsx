import { Link } from 'react-router';
import type { Part } from '../types';
import { formatPrice } from '../utils/format';

export default function PartCard({ part }: { part: Part }) {
  return (
    <Link
      to={`/parts/${part._id}`}
      className="card card-border bg-base-100 transition hover:-translate-y-0.5 hover:border-primary"
    >
      <div className="card-body gap-2 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="badge badge-soft badge-primary badge-sm">{part.category}</span>
          <span className="font-mono text-xs text-base-content/60">{part.partNumber}</span>
        </div>
        <h3 className="card-title text-base leading-snug">{part.name}</h3>
        <p className="line-clamp-2 text-sm text-base-content/70">{part.description || 'No description'}</p>
        <div className="mt-auto flex items-end justify-between pt-2">
          <span className="text-xs text-base-content/60">{part.compatibilityNote}</span>
          <span className="text-lg font-bold text-primary">{formatPrice(part.price)}</span>
        </div>
      </div>
    </Link>
  );
}
