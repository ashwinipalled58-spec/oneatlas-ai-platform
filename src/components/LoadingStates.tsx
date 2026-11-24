export function SkeletonCard() {
  return (
    <div className="card p-6 flex flex-col gap-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <div className="skeleton h-3 w-20" />
          <div className="skeleton h-5 w-36" />
        </div>
        <div className="skeleton h-5 w-14 rounded-full" />
      </div>
      <div className="skeleton h-10 w-full" />
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 grid grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="skeleton h-2 w-12" />
            <div className="skeleton h-4 w-10" />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-5 w-14 rounded-md" />
        ))}
      </div>
      <div className="flex gap-2 mt-1">
        <div className="skeleton h-8 flex-1 rounded-lg" />
        <div className="skeleton h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = 20 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="border-2 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin"
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size={32} />
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    </div>
  );
}
