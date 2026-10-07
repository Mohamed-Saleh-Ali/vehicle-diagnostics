import { useState, type FormEvent } from 'react';
import { Sparkles } from 'lucide-react';
import type { DiagnosisInput } from '../types';

const EXAMPLES = [
  'Grinding noise from the front when braking, pedal feels soft',
  'Engine temperature goes into the red on the highway, sweet smell',
  'Car shakes at idle and the check engine light is on',
  'Clunking from the front left over speed bumps'
];

type Props = { busy: boolean; onSubmit: (input: DiagnosisInput) => void };

export default function SymptomForm({ busy, onSubmit }: Props) {
  const [symptomDescription, setSymptomDescription] = useState('');
  const [vehicleNote, setVehicleNote] = useState('');
  const [touched, setTouched] = useState(false);

  const length = symptomDescription.trim().length;
  const tooShort = length < 10;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (tooShort || busy) return;
    onSubmit({ symptomDescription: symptomDescription.trim(), vehicleNote: vehicleNote.trim() || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="card card-border bg-base-100">
      <div className="card-body gap-4">
        <h2 className="card-title">What does the customer report?</h2>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Symptom description *</legend>
          <textarea
            className={`textarea h-36 w-full ${touched && tooShort ? 'textarea-error' : ''}`}
            placeholder="e.g. Squealing noise from the front when braking at low speed…"
            value={symptomDescription}
            maxLength={1000}
            onChange={e => setSymptomDescription(e.target.value)}
            disabled={busy}
          />
          <div className="flex justify-between text-xs">
            <span className={touched && tooShort ? 'text-error' : 'text-base-content/60'}>
              {touched && tooShort ? 'Please write at least 10 characters.' : 'Do not enter names, plates or VINs.'}
            </span>
            <span className="text-base-content/60">{length}/1000</span>
          </div>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Vehicle (optional)</legend>
          <input
            className="input w-full"
            placeholder="e.g. Compact hatchback, 2017, 120,000 km"
            value={vehicleNote}
            maxLength={200}
            onChange={e => setVehicleNote(e.target.value)}
            disabled={busy}
          />
        </fieldset>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-base-content/60">Try an example</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map(example => (
              <button
                type="button"
                key={example}
                className="btn btn-xs btn-ghost bg-base-200 font-normal"
                onClick={() => setSymptomDescription(example)}
                disabled={busy}
              >
                {example.slice(0, 38)}…
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>
          {busy ? <span className="loading loading-spinner" /> : <Sparkles size={18} />}
          {busy ? 'Analysing…' : 'Run diagnosis'}
        </button>
      </div>
    </form>
  );
}
