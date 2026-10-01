import { Construction } from 'lucide-react';

// temporary placeholder
export default function ComingSoon({ title, note }: { title: string; note: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-box border border-dashed border-base-300 bg-base-100 px-6 py-20 text-center">
      <Construction size={36} className="text-secondary" />
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-base-content/70">Coming soon: {note}</p>
    </div>
  );
}
