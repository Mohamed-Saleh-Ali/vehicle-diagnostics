import { Link } from 'react-router';
import { Bot, FlaskConical, ShieldAlert } from 'lucide-react';
import type { Diagnosis } from '../types';
import { formatDate } from '../utils/format';
import UrgencyBadge from './UrgencyBadge';

export default function DiagnosisCard({ diagnosis }: { diagnosis: Diagnosis }) {
  const { result, source, createdAt } = diagnosis;
  const confidence = Math.round(result.confidence * 100);

  return (
    <article className="card border-2 border-neutral bg-base-100 shadow-[6px_6px_0_#191919]">
      <div className="card-body gap-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="label-mono">Job ticket · likely subsystem</p>
            <h2 className="text-4xl font-extrabold leading-none">{result.subsystem}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <UrgencyBadge urgency={result.urgency} />
              <span className={`badge badge-ghost gap-1 ${source === 'mock' ? 'badge-dash' : ''}`}>
                {source === 'ai' ? <Bot size={12} /> : <FlaskConical size={12} />}
                {source === 'ai' ? 'AI' : 'Mock'}
              </span>
              <span className="text-xs text-base-content/60">{formatDate(createdAt)}</span>
            </div>
          </div>
          <div
            className="radial-progress text-primary"
            style={{ '--value': confidence, '--size': '4.5rem' } as React.CSSProperties}
            role="progressbar"
            aria-valuenow={confidence}
            aria-label="Confidence"
          >
            <span className="text-sm font-bold text-base-content">{confidence}%</span>
          </div>
        </div>

        <section>
          <h3 className="mb-2 font-semibold">Possible causes</h3>
          <ol className="list-decimal space-y-1 pl-5 text-base-content/90">
            {result.possibleCauses.map(cause => (
              <li key={cause}>{cause}</li>
            ))}
          </ol>
        </section>

        <section>
          <h3 className="mb-2 font-semibold">Recommended part categories</h3>
          <div className="flex flex-wrap gap-2">
            {result.recommendedPartCategories.map(category => (
              <Link
                key={category}
                to={`/?category=${encodeURIComponent(category)}`}
                className="btn btn-sm btn-outline btn-primary"
              >
                {category} →
              </Link>
            ))}
          </div>
        </section>

        <p className="flex items-start gap-2 rounded-box bg-base-200 p-3 text-xs text-base-content/70">
          <ShieldAlert size={16} className="mt-0.5 shrink-0" />
          This is a first suggestion for a trained technician, not a safety decision. Always verify on the vehicle.
        </p>
      </div>
    </article>
  );
}
