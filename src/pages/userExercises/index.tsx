import { useState } from 'react';
import CustomExerciseModal from '../../components/exercises/CustomExerciseModal';
import ExerciseEditModal from './components/ExerciseEditModal';
import ExerciseCard from './components/ExerciseCard';
import { useUserExercises } from './hooks/useUserExercises';
import { UserExercise } from './types';
import './UserExercises.css';

export default function UserExercises() {
  const {
    loading,
    error,
    attrs,
    query,
    setQuery,
    filtered,
    onCreated,
    onDelete,
    onUpdated,
    onDeletedItem
  } = useUserExercises();

  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState<UserExercise | null>(null);

  return (
    <div className="card">
      <div className="ue-header-row">
        <h2 className="ue-title">My Exercises</h2>
        <div className="ue-header-actions">
          <input 
            placeholder="Search…" 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
          />
          <button className="btn btn-add-exercise" onClick={() => setShowNew(true)}>
            + Add Exercise
          </button>
        </div>
      </div>
      
      {loading && <p className="note">Loading…</p>}
      {error && <p className="ue-error-msg">{error}</p>}
      
      {!loading && !error && (
        <div className="plans-list ue-table-wrap" style={{ marginTop: '16px' }}>
          {filtered.length === 0 ? (
            <p className="note ue-no-exercises">No exercises found.</p>
          ) : (
            filtered.map(item => (
              <ExerciseCard 
                key={item.id}
                item={item} 
                onEdit={() => setEditing(item)} 
                onDelete={() => onDelete(item.id)} 
              />
            ))
          )}
        </div>
      )}

      {showNew && (
        <CustomExerciseModal 
          onClose={() => setShowNew(false)} 
          onCreated={item => {
            onCreated(item);
            setShowNew(false);
          }} 
        />
      )}

      {editing && (
        <ExerciseEditModal
          exercise={editing}
          attributes={attrs}
          onClose={() => setEditing(null)}
          onUpdated={updated => {
            onUpdated(updated);
            setEditing(null);
          }}
          onDeleted={() => {
            onDeletedItem(editing.id);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
