interface RepsBreakdownChartProps {
  repsBreakdown: { name: string; reps: number; share: number }[];
}

export default function RepsBreakdownChart({ repsBreakdown }: RepsBreakdownChartProps) {
  if (repsBreakdown.length === 0) return null;

  return (
    <div className="card wd-chart-card">
      <div className="wd-chart-header">
        <strong>Muscle Repetitions Breakdown</strong>
      </div>
      <div className="bar-chart">
        {repsBreakdown.map((m) => (
          <div className="bar-row" key={m.name}>
            <div className="wd-bar-row-name">{m.name}</div>
            <div className="bar-bg">
              <div
                className="bar-fill"
                style={{ width: `${Math.max(0, Math.min(100, (m.share || 0) * 100))}%` }}
              />
            </div>
            <div className="wd-bar-row-percent">
              {((m.share || 0) * 100).toFixed(0)}% ({Math.round(m.reps || 0)} reps)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
