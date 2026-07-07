export function LoadingState() {
  return (
    <div className="flex h-64 items-center justify-center" role="status" aria-live="polite">
      <span className="text-sm text-neutral-500">Loading…</span>
    </div>
  );
}
