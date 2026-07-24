export function LoadingState() {
  return (
    <div className="state state--loading" role="status" aria-live="polite">
      <span className="spinner" />
      <strong>Loading real DSR data...</strong>
      <p>Using the synchronized local copies from public/data.</p>
    </div>
  )
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="state state--error" role="alert">
      <strong>The map could not be opened.</strong>
      <p>{message}</p>
      <p>Run npm run sync-data to refresh the local data copy.</p>
    </div>
  )
}
