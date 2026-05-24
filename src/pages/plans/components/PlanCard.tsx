import { useEffect, useState } from 'react';
import { getPlan } from '../../../services/api';
import { Plan, Session } from '../../../types/fitness';
import '../Plans.css';

export interface PlanCardProps {
  plan: Plan;
  activeSession: Session | null;
  onStart: () => void | Promise<void>;
  onContinue: (s: Session) => void;
  onDelete: () => void;
  onEditTemplate: () => void | Promise<void>;
  titleCaseName: (s: string) => string;
}

export default function PlanCard({
  plan,
  activeSession,
  onStart,
  onContinue,
  onDelete,
  onEditTemplate,
  titleCaseName
}: PlanCardProps) {
  const [detail, setDetail] = useState<any>(null); // Ideally, type detail properly when api has complete type

  useEffect(() => {
    let cancel = false;
    (async () => {
      const data = await getPlan(plan.id);
      if (!cancel) setDetail(data);
    })();
    return () => { cancel = true; };
  }, [plan.id]);

  return (
    <div className="card plan-card">
      <div className="plan-card-header-wrapper">
        <div className="plan-card-header-left">
          <h3 className="plan-card-title">{plan.name}</h3>
          {activeSession ? (
            <button className="btn teal" onClick={() => onContinue(activeSession)}>Continue</button>
          ) : (
            <button className="btn primary" onClick={onStart}>Start</button>
          )}
        </div>
        <div className="plan-card-header-right">
          <button className="btn outline" onClick={onEditTemplate}>Edit</button>
          <button className="btn delete" onClick={onDelete}>Delete</button>
        </div>
      </div>
      
      {/* Small summary badges */}
      <div className="plan-badges-row">
        <span className="plan-badge">
          Exercises: <strong>{(detail?.exercises || []).length}</strong>
        </span>
      </div>
      
      {/* Exercises as chips */}
      <div className="plan-exercises-container">
        {(detail?.exercises || []).length === 0 ? (
          <p className="note">No exercises</p>
        ) : (
          <div className="plan-exercises-chips">
            {(detail?.exercises || []).map((ex: any) => {
              const muscles: string[] = Array.isArray(ex.target_muscles) ? ex.target_muscles : [];
              return (
                <span
                  key={ex.id}
                  title={muscles && muscles.length ? muscles.join(', ') : undefined}
                  className="exercise-chip"
                >
                  {ex.name}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {plan.description && <p className="note plan-card-desc">{plan.description}</p>}
    </div>
  );
}