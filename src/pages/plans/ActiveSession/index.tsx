import React from 'react';
import type { Session, SessionExercise, ExerciseSet } from '../../../types/fitness';
import { ConfirmModal } from '../../../components/ui/ConfirmModal';
import { titleCaseName } from '../../../services/api';
import { SetRow } from './components/SessionSetRows';
import { FinishConfirmModal } from './components/FinishConfirmModal';
import { useActiveSession } from './hooks/useActiveSession';
import '../PlanEditor/PlanEditor.css';
import './ActiveSession.css';

export interface SessionModalProps {
  session: Session;
  catalog: any[];
  onOpenCatalog: () => void;
  onClose: () => void;
  onUpdate: (s: Session) => void;
  onFinished: (s: Session) => void;
  onDiscarded: (id: number) => void;
}

export default function SessionModal({
  session,
  catalog, // passed but might be used by the caller for catalog display instead of here directly, keeping for compatibility
  onOpenCatalog,
  onClose,
  onUpdate,
  onFinished,
  onDiscarded
}: SessionModalProps) {
  const {
    local,
    elapsed,
    mm,
    ss,
    confirmDiscard,
    setConfirmDiscard,
    confirmFinish,
    setConfirmFinish,
    finishMinutes,
    setFinishMinutes,
    finishSeconds,
    setFinishSeconds,
    testDate,
    setTestDate,
    removeSessExercise,
    move,
    addNewSet,
    removeSet,
    handleUpdateExerciseSet,
    finishWithOptionalDuration,
    discardConfirmed,
    showConfirmFinish
  } = useActiveSession(session, onUpdate, onFinished, onDiscarded);

  return (
    <>
      <div className="modal-overlay session-modal-overlay">
        <div className="card modal-content session-modal-content">
          <div className="row session-modal-header items-center justify-between">
            <h2 className="session-modal-title">{local.plan_name}</h2>
            <div className="row items-center session-modal-actions">
              <span className="btn cancel timer-badge">⏱ {mm}:{ss}</span>
              <button className="btn delete" onClick={() => setConfirmDiscard(true)}>Discard</button>
              <button className="btn teal" onClick={showConfirmFinish}>Save and Finish</button>
              <button className="btn cancel" onClick={onClose}>✕</button>
            </div>
          </div>

          <div className="row flex-wrap session-add-row">
            <button className="btn" onClick={onOpenCatalog}>+ Add Exercise</button>
          </div>

          <div className="session-exercises-list">
            {(local.exercises || []).map((ex: SessionExercise) => (
              <div key={ex.id} className="card template-exercise-card">
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
                        {(() => {
                          const bp = Array.isArray(ex.body_parts) && ex.body_parts.length ? ex.body_parts[0] : null;
                          const muscles: string[] = Array.isArray(ex.target_muscles) ? ex.target_muscles : [];
                          if (!bp && (!muscles || muscles.length === 0)) return null;

                          return (
                            <>
                              {muscles.map((m: string) => (
                                <span key={m} className="exercise-badge">Muscle: {titleCaseName(String(m))}</span>
                              ))}
                              {bp && <span className="exercise-badge">Body Part: {titleCaseName(String(bp))}</span>}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <button className="btn" onClick={() => move(ex.id, -1)}>↑</button>
                    <button className="btn" onClick={() => move(ex.id, 1)}>↓</button>
                    <button className="btn btn-delete" onClick={() => removeSessExercise(ex.id)}>✕</button>
                  </div>
                </div>

                <div className="template-exercise-sets-container">
                  <div className="template-exercise-set-header session-exercise-set-grid">
                    <div className="template-exercise-set-col-set">SET</div>
                    <div className="template-exercise-set-col-prev">PREV</div>
                    <div className="template-exercise-set-col-kg">KG</div>
                    <div className="template-exercise-set-col-reps">REPS</div>
                    <div /> {/* Spacer for removal column */}
                  </div>
                  {(() => {
                    const prevMap: Record<number, Pick<ExerciseSet, 'set_index' | 'weight_kg' | 'reps'>> = {};
                    (ex.previous_sets || []).forEach((p) => { prevMap[p.set_index] = p; });
                    const existingSets = (ex.sets || [])
                      .slice()
                      .sort((a, b) => a.set_index - b.set_index)
                      .map((s, idx) => ({ ...s, set_index: idx + 1 }));

                    return existingSets.map((current: ExerciseSet) => (
                      <SetRow
                        key={current.id}
                        sessionId={local.id}
                        exId={ex.id}
                        setObj={current}
                        previous={prevMap[current.set_index]}
                        onChange={(upd) => handleUpdateExerciseSet(ex.id, current.id, upd)}
                        onRemove={() => removeSet(ex.id, current.id)}
                      />
                    ));
                  })()}
                  <button className="btn add-set-btn" onClick={() => addNewSet(ex.id)}>+ Add Set</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {confirmDiscard && (
        <ConfirmModal
          title="Cancel Workout?"
          message="Canceling will discard the current workout without saving to history."
          confirmLabel="Yes, cancel"
          onCancel={() => setConfirmDiscard(false)}
          onConfirm={discardConfirmed}
        />
      )}

      {confirmFinish && (
        <FinishConfirmModal
          defaultMinutes={Math.floor(elapsed / 60)}
          defaultSeconds={elapsed % 60}
          minutes={finishMinutes}
          seconds={finishSeconds}
          testDate={testDate}
          onTestDateChange={setTestDate}
          onMinutesChange={setFinishMinutes}
          onSecondsChange={setFinishSeconds}
          onCancel={() => setConfirmFinish(false)}
          onConfirm={() => finishWithOptionalDuration()}
        />
      )}
    </>
  );
}
