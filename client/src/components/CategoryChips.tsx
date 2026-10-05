type Props = { categories: string[]; active?: string; onSelect: (category?: string) => void };

export default function CategoryChips({ categories, active, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button className={`btn btn-sm ${!active ? 'btn-primary' : 'btn-ghost bg-base-100'}`} onClick={() => onSelect()}>
        All
      </button>
      {categories.map(category => (
        <button
          key={category}
          className={`btn btn-sm ${active === category ? 'btn-primary' : 'btn-ghost bg-base-100'}`}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
