import { useNavigate } from 'react-router-dom';
import type { Session, SessionExercise } from '../../../types/fitness';
import { calculateDurationParts } from '../utils/timeHelpers';

interface WorkoutCardProps {
  session: Session;
}

export default function WorkoutCard({ session }: WorkoutCardProps) {
  const navigate = useNavigate();
  const { start, end, mm, ss } = calculateDurationParts(session.started_at, session.finished_at, session.duration_seconds);
  const exerciseNames: string[] = (session.exercises || []).map((e: SessionExercise) => e.name);
  const preview = exerciseNames.slice(0, 4);
  const restCount = Math.max(0, exerciseNames.length - preview.length);

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (date: Date) => date.toLocaleDateString([], { day: 'numeric', month: 'numeric', year: 'numeric' });

  return (
    <div className="card workout-card">
      <div className="workout-card-header">
        <div className="workout-card-title-group">
          <strong className="workout-card-plan-name">{session.plan_name || 'Plan'}</strong>
          <div className="workout-card-date">
            {formatDate(start)}, {formatTime(start)} → {formatTime(end)}
          </div>
        </div>
        <div className="workout-card-actions">
          <span className="note">⏱ {mm}:{ss}</span>
          <button className="btn" onClick={() => navigate(`/history/${session.id}`)}>Details</button>
        </div>
      </div>
      {exerciseNames.length > 0 ? (
        <div className="workout-preview-tags">
          {preview.map((n, i) => (
            <span key={i} className="workout-preview-tag">{n}</span>
          ))}
          {restCount > 0 && (
            <span className="note workout-preview-more">+ {restCount} More…</span>
          )}
        </div>
      ) : (
        <p className="note workout-no-exercises">No exercises recorded in this session.</p>
      )}
    </div>
  );
}
