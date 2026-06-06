import { useNavigate } from 'react-router-dom';
import { AiRecommendationResponse } from '../types';

interface AiRecommendationsProps {
  aiRec: AiRecommendationResponse | null;
  aiLoading: boolean;
  aiError: string | null;
}

export default function AiRecommendations({ aiRec, aiLoading, aiError }: AiRecommendationsProps) {
  const navigate = useNavigate();

  return (
    <div className="card ai-recommendation-card">
      <div className="ai-bg-gradient" />
      <div className="ai-recommendation-wrapper">
        <h3>
          <span className="ai-recommendation-icon">🤖</span>
          AI: balance your training
        </h3>
        
        {aiLoading && <p>Calculating recommendations...</p>}
        {aiError && <p className="error-message">{aiError}</p>}
        
        {!aiLoading && !aiError && aiRec && (
          <div className="ai-recommendation-content">
            <p className="ai-analysis-text">
              Analysis of the last {aiRec.period_days} days: the most trained muscle group is
              {' '}<strong>{aiRec.most_trained_muscle}</strong> ({aiRec.most_trained_reps.toFixed(0)} reps).
            </p>
            
            {aiRec.is_balanced && (
              <div className="ai-balanced-msg">
                <strong>Great job!</strong> Your recent training appears to be well balanced across the main muscle groups.
              </div>
            )}
            
            {!aiRec.is_balanced && aiRec.muscles.length > 0 ? (
              <>
                <p className="ai-undertrained-title">Undertrained muscle groups to work on:</p>
                <div className="ai-muscle-tags">
                  {aiRec.muscles.map(m => (
                    <span key={m.name} className="ai-muscle-tag">
                      <strong>{m.name}</strong>
                      <span className="ai-muscle-tag-reps">
                        {m.volume > 0 ? `${m.volume.toFixed(0)} reps` : 'no reps'}
                      </span>
                    </span>
                  ))}
                </div>
                
                {aiRec.recommendations.length > 0 && (
                  <>
                    <p className="ai-suggested-title">Suggested exercises for these muscle groups:</p>
                    <div className="ai-rec-list">
                      <div className="ai-rec-items-list">
                        {aiRec.recommendations.map(ex => (
                          <button
                            key={ex.id}
                            type="button"
                            onClick={() => navigate(`/stats/${encodeURIComponent(ex.name)}`)}
                            className="ai-rec-item"
                          >
                            <div className="ai-rec-item-content">
                              {ex.image_url && (
                                <img 
                                  src={ex.image_url} 
                                  alt={ex.name} 
                                  className="ai-rec-image" 
                                  onClick={e => e.stopPropagation()} 
                                />
                              )}
                              <div className="ai-rec-item-details">
                                <div className="ai-rec-item-name">{ex.name}</div>
                                {ex.muscles && ex.muscles.length > 0 && (
                                  <div className="ai-rec-item-muscles">
                                    {ex.muscles.map(m => (
                                      <span key={m} className="exercise-badge">Muscle: {m}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="ai-rec-item-actions">
                              <span className="ai-rec-item-details-text">→</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : !aiRec.is_balanced ? (
              <p className="note">No muscle groups appear to be undertrained.</p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
