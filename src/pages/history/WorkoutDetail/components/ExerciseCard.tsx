import type { SessionExercise } from '../../../../types/fitness';
import { computeExerciseVolume } from '../utils/volumeHelpers';

interface ExerciseCardProps {
  ex: SessionExercise;
}

export default function ExerciseCard({ ex }: ExerciseCardProps) {
  const volume = computeExerciseVolume(ex);

  return (
    <div className="card wd-exercise-card">
      <div className="wd-exercise-grid">
        {ex.image_url ? (
          <div className="wd-exercise-image-wrapper">
            <img src={ex.image_url} alt={ex.name} className="wd-exercise-image" />
          </div>
        ) : (
          <div className="wd-exercise-no-image">
            No Image
          </div>
        )}

        <div>
          <div className="wd-exercise-header">
            <strong className="wd-exercise-name">{ex.name}</strong>
            <span className="note" title="Volume (kg * repetitions)">
              Volume: <b>{Math.round(volume * 100) / 100}</b>
            </span>
          </div>
          {ex.target_muscles && ex.target_muscles.length > 0 && (
            <div className="wd-exercise-target-muscles">
              {ex.target_muscles.map((m) => (
                <span key={m} className="exercise-badge">Muscle: {m}</span>
              ))}
            </div>
          )}

          <div className="wd-sets-container">
            <div className="wd-sets-header">
              <div className="wd-col-set">Set</div>
              <div className="wd-col-kg">kg</div>
              <div className="wd-col-reps">reps</div>
            </div>
            {(ex.sets || []).map((s) => (
              <div key={s.id} className="wd-set-row">
                <div className="wd-col-set">{s.set_index}</div>
                <div className="wd-col-kg">{s.weight_kg}</div>
                <div className="wd-col-reps">{s.reps}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
