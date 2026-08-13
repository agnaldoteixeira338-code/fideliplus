export default function BarraProgresso({ current, total }) {
  const pct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
  return (
    <div className="progress-bar">
      <div className="fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
