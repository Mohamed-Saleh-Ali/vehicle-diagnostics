// Day 1: proves that Vite + React + TypeScript + Tailwind + daisyUI are wired up.
export default function App() {
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <div className="card card-border w-full max-w-md bg-base-100 shadow-sm">
        <div className="card-body items-center gap-4 text-center">
          <h1 className="text-3xl font-bold">
            Diag<span className="text-primary">Bay</span>
          </h1>
          <p className="text-base-content/70">Vehicle parts & diagnostics for small workshops. Coming soon.</p>
          <div className="flex gap-2">
            <span className="badge badge-primary">React + TS</span>
            <span className="badge badge-secondary">Tailwind + daisyUI</span>
          </div>
        </div>
      </div>
    </main>
  );
}
