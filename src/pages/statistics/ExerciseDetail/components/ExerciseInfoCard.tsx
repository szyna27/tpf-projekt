import { ExerciseStatsData } from '../types';

interface ExerciseInfoCardProps {
  exerciseName: string;
  data: ExerciseStatsData;
  imageUrl?: string;
  muscleLabels: string[];
}

export default function ExerciseInfoCard({ exerciseName, data, imageUrl, muscleLabels }: ExerciseInfoCardProps) {
  return (
    <div className="card ed-info-card">
      <h2 className="ed-title">{exerciseName}</h2>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={exerciseName}
          className="ed-image"
        />
      )}
      <div className="stat-cards big-stats ed-stats-grid">
        {muscleLabels.length > 0 && (
          <div className="stat-card">
            <h4>Muscles</h4>
            <div className="value ed-muscles-value">
              {muscleLabels.join(', ')}
            </div>
          </div>
        )}
        <div className="stat-card"><h4>Workouts</h4><div className="value">{data.sessions_count || 0}</div></div>
        <div className="stat-card"><h4>Sets</h4><div className="value">{data.total_sets || 0}</div></div>
        <div className="stat-card"><h4>Repetitions</h4><div className="value">{data.total_reps || 0}</div></div>
        <div className="stat-card"><h4>Volume</h4><div className="value">{Math.round(data.total_volume || 0)}</div></div>
        <div className="stat-card"><h4>1RM Record</h4><div className="value">{data.record_1rm ? `${data.record_1rm.toFixed(2)} kg` : '–'}</div></div>
      </div>
    </div>
  );
}
