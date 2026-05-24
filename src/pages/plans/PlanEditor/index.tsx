import React from 'react';
import ExerciseCatalogModal from '../../../components/exercises/ExerciseCatalogModal';
import { usePlanEditor } from './hooks/usePlanEditor';
import { TemplateExerciseCard } from './components/TemplateExerciseCard';
import './PlanEditor.css';

export default function PlanTemplateEditor() {
  const {
    planId,
    detail,
    setDetail,
    catalog,
    setCatalog,
    catalogOpen,
    setCatalogOpen,
    loading,
    remove,
    move,
    handleAddSet,
    handleRemoveSet,
    handleSetChange,
    saveName,
    saveDescription,
    handleAddExerciseSubmit,
    navigate
  } = usePlanEditor();

  if (loading) return <div className="card"><p>Loading...</p></div>;
  if (!detail) return <div className="card"><p>Plan not found</p><button className="btn" onClick={() => navigate('/plans')}>Back</button></div>;

  return (
    <div className="card plan-editor-container">
      <div className="plan-editor-header">
        <input 
          className="plan-editor-title-input"
          value={detail.name} 
          onChange={e => setDetail({ ...detail, name: e.target.value })}
          onBlur={e => saveName(e.target.value)}
        />
        <button className="btn cancel" onClick={() => navigate('/plans')}>Done</button>
      </div>

      <div className="plan-description-container">
        <label className="plan-description-label">Plan Description</label>
        <textarea
          className="plan-description-input"
          value={detail.description || ''}
          onChange={e => setDetail({ ...detail, description: e.target.value })}
          onBlur={e => saveDescription(e.target.value)}
          placeholder="Add a description for this plan..."
        />
      </div>

      <div className="plan-editor-list">
        {(detail.exercises || []).map((ex: any) => (
          <TemplateExerciseCard
            key={ex.id}
            ex={ex}
            planId={planId}
            onMove={(dir) => move(ex.id, dir)}
            onRemove={() => remove(ex.id)}
            onChangeSet={(u) => handleSetChange(ex.id, u)}
            onRemoveSet={(setId) => handleRemoveSet(ex.id, setId)}
            onAddSet={() => handleAddSet(ex.id)}
          />
        ))}
      </div>

      <div className="add-exercise-container">
        <button className="btn primary add-exercise-btn" onClick={() => setCatalogOpen(true)}>+ Add Exercise</button>
      </div>

      {catalogOpen && (
        <ExerciseCatalogModal
          catalog={catalog}
          onClose={() => setCatalogOpen(false)}
          onAddCustom={(item: { id: number; name: string }) => {
            setCatalog(c => [...c, { id: item.id, name: item.name, kind: 'custom' }]);
          }}
          onSelect={handleAddExerciseSubmit}
        />
      )}
    </div>
  );
}
