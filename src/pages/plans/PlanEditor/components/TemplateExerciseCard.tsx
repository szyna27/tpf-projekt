import React from 'react';
import { PlanSetRow } from './PlanSetRow';
import '../PlanEditor.css';

interface TemplateExerciseCardProps {
  ex: any;
  planId: number;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
  onChangeSet: (updatedSet: any) => void;
  onRemoveSet: (setId: number) => void;
  onAddSet: () => void;
}

export const TemplateExerciseCard: React.FC<TemplateExerciseCardProps> = ({
  ex,
  planId,
  onMove,
  onRemove,
  onChangeSet,
  onRemoveSet,
  onAddSet
}) => {
  return (
    <div className="card template-exercise-card">
      <div className="row template-exercise-card-header">
        <div className="row template-exercise-card-info">
          <div className="template-exercise-card-image-box">
            {ex.image_url ? (
              <img src={ex.image_url} alt="" className="template-exercise-card-image" />
            ) : (
              <div className="template-exercise-card-no-image">No Img</div>
            )}
          </div>
          <div>
            <div className="template-exercise-card-name">{ex.name}</div>
            <div className="template-exercise-card-muscles">
              {(ex.target_muscles || []).map((m: string) => (
                <span key={m} className="exercise-badge">Muscle: {m}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="row">
          <button className="btn" onClick={() => onMove(-1)} disabled={ex.order === 0}>↑</button>
          <button className="btn" onClick={() => onMove(1)}>↓</button>
          <button className="btn btn-delete" onClick={onRemove}>✕</button>
        </div>
      </div>

      <div className="template-exercise-sets-container">
        <div className="template-exercise-set-header">
          <div className="template-exercise-set-col-set">SET</div>
          <div className="template-exercise-set-col-kg">KG</div>
          <div className="template-exercise-set-col-reps">REPS</div>
          <div /> {/* Spacer for removal column */}
        </div>
        {(ex.sets_detail || []).map((s: any) => (
          <PlanSetRow 
            key={s.id} 
            planId={planId} 
            exId={ex.id} 
            setObj={s} 
            onChange={onChangeSet}
            onRemove={() => onRemoveSet(s.id)}
          />
        ))}
        <button className="btn add-set-btn" onClick={onAddSet}>+ Add Set</button>
      </div>
    </div>
  );
};
