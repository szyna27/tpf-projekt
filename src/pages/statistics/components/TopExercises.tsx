import { useNavigate } from 'react-router-dom';
import { Top5Exercise } from '../types';

interface TopExercisesProps {
  top5: Top5Exercise[];
  top5Loading: boolean;
  exerciseImages: Record<string, string | undefined>;
}

export default function TopExercises({ top5, top5Loading, exerciseImages }: TopExercisesProps) {
  const navigate = useNavigate();

  return (
    <div className="card top5-card">
      <h3>Top 5 most frequently trained exercises</h3>
      <div className="top5-container">
        {top5Loading ? (
          <div className="top5-loading-grid">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="stat-card pulse">
                <div className="placeholder-bar primary" />
                <div className="placeholder-bar secondary" />
              </div>
            ))}
          </div>
        ) : top5.length === 0 ? (
          <p className="note">No data</p>
        ) : (
          <div className="top5-list">
            {top5.map((it, idx) => (
              <button
                key={it.name}
                type="button"
                onClick={() => navigate(`/stats/${encodeURIComponent(it.name)}`)}
                className="top5-item"
              >
                <div className="top5-rank">
                  {idx + 1}
                </div>
                {exerciseImages[it.name] && (
                  <img
                    src={exerciseImages[it.name]}
                    alt={it.name}
                    className="top5-image"
                    onClick={e => e.stopPropagation()}
                  />
                )}
                <div className="top5-item-details">
                  <div className="top5-item-name">{it.name}</div>
                </div>
                <div className="top5-item-stats">
                  <div className="top5-item-stat">Volume: <strong>{Math.round(it.volume)}</strong></div>
                  <div className="top5-item-stat">Trained days: <strong>{it.occurrences}</strong></div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
