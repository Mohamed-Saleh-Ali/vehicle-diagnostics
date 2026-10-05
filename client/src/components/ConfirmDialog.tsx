type Props = {
  open: boolean;
  title: string;
  text: string;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({ open, title, text, confirmLabel = 'Delete', busy, onConfirm, onCancel }: Props) {
  if (!open) return null;
  return (
    <div className="modal modal-open" role="dialog" aria-modal="true">
      <div className="modal-box">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="py-4 text-base-content/80">{text}</p>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={onConfirm} disabled={busy}>
            {busy && <span className="loading loading-spinner loading-sm" />}
            {confirmLabel}
          </button>
        </div>
      </div>
      <button className="modal-backdrop" onClick={onCancel} aria-label="Close" />
    </div>
  );
}
