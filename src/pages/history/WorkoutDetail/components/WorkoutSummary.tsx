import type { Session } from '../../../../types/fitness';
import { calculateDurationParts } from '../../utils/timeHelpers';

interface WorkoutSummaryProps {
  data: Session;
  totalVolume: number;
  muscles: string[];
}

export default function WorkoutSummary({ data, totalVolume, muscles }: WorkoutSummaryProps) {
  const { start, end, mm, ss } = calculateDurationParts(data.started_at, data.finished_at, data.duration_seconds);

  return (
    <>
      <div className="wd-summary-row">
        <p className="wd-summary-date-time">
          {start.toLocaleString()} → {end.toLocaleTimeString()} • ⏱ {mm}:{ss}
        </p>
        <div className="wd-summary-volume-label">
          Total Volume: <span className="wd-summary-volume-value">{totalVolume.toLocaleString()} kg·reps</span>
        </div>
      </div>

      {muscles.length > 0 && (
        <div className="wd-muscles-container">
          {muscles.map((m) => (
            <span key={m} className="exercise-badge">Muscle: {m}</span>
          ))}
        </div>
      )}
    </>
  );
}
