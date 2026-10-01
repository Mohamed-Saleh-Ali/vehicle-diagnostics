import type { ReactNode } from 'react';
import { AlertTriangle, Inbox } from 'lucide-react';

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-base-content/60" role="status">
      <span className="loading loading-spinner loading-lg text-primary" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function ErrorAlert({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="alert alert-error alert-soft">
      <AlertTriangle size={20} />
      <span>{message}</span>
      {onRetry && (
        <button className="btn btn-sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-box border border-dashed border-base-300 bg-base-100 px-6 py-14 text-center">
      <Inbox size={36} className="text-base-content/40" />
      <h3 className="text-lg font-semibold">{title}</h3>
      {text && <p className="max-w-md text-sm text-base-content/70">{text}</p>}
      {action}
    </div>
  );
}
