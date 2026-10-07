import type { Urgency } from '../types';

const styles: Record<Urgency, string> = {
  high: 'badge-error',
  medium: 'badge-warning',
  low: 'badge-success'
};

export default function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  return <span className={`badge ${styles[urgency]} font-semibold uppercase`}>{urgency} urgency</span>;
}
