export default function Loading() {
  return (
    <main className="px-4 py-6 max-w-4xl mx-auto">
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-32 bg-muted rounded" />
        <div className="h-32 bg-muted rounded" />
      </div>
    </main>
  );
}
