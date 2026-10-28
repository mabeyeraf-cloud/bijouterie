export default function Flash({ error, ok }: { error?: string; ok?: string }) {
  if (error) return <p className="alert alert--error" role="alert">{error}</p>;
  if (ok) return <p className="alert" role="status">{ok}</p>;
  return null;
}
