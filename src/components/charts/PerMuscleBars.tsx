export default function PerMuscleBars({ data, repsData }: { data: any[]; repsData?: Array<{ name: string; reps: number; share: number }> }) {
  if (!data || data.length === 0) return null;
  if (repsData && repsData.length > 0) {
    const items = repsData.slice(0, 12);
    return (
      <div style={{ gridColumn: '1 / -1', marginTop: 36 }}>
        <strong>Muscle Training Distribution</strong>
        <div className="bar-chart">
          {items.map((m: any) => (
            <div className="bar-row" key={m.name}>
              <div style={{ color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
              <div className="bar-bg">
                <div className="bar-fill" style={{ width: `${Math.max(0, Math.min(100, (m.share || 0) * 100))}%` }} />
              </div>
              <div style={{ textAlign: 'right' }}>{((m.share || 0) * 100).toFixed(0)}% ({Math.round(m.reps || 0)} reps)</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}
