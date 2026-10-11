import { useState } from 'react';
import type { Part } from '../types';

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

type Props = { part: Pick<Part, 'partNumber' | 'name' | 'category'>; className?: string; eager?: boolean };

export default function PartImage({ part, className = '', eager = false }: Props) {
  const candidates = [
    `/parts/${part.partNumber}.svg`,
    `/parts/category/${slug(part.category)}.svg`,
    '/parts/default.svg',
  ];
  const [i, setI] = useState(0);
  return (
    <img
      src={candidates[i]}
      alt={part.name}
      width={480}
      height={360}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setI((n) => Math.min(n + 1, candidates.length - 1))}
      className={`aspect-[4/3] w-full object-contain bg-base-200 ${className}`}
    />
  );
}