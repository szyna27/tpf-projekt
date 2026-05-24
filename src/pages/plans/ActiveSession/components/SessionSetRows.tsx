import { useEffect, useState } from 'react';
import { addSet, updateSet } from '../../../../services/api';
import { ExerciseSet } from '../../../../types/fitness';
import '../ActiveSession.css';

export interface SetRowProps {
  sessionId: number;
  exId: number;
  setObj: ExerciseSet;
  previous?: Pick<ExerciseSet, 'set_index' | 'weight_kg' | 'reps'>;
  onChange: (upd: ExerciseSet) => void;
  onRemove: () => void;
}

export function SetRow({ sessionId, exId, setObj, previous, onChange, onRemove }: SetRowProps) {
  const [w, setW] = useState<string>('');
  const [r, setR] = useState<string>('');
  
  useEffect(() => {
    const weight = setObj.weight_kg;
    const reps = setObj.reps;
    
    const hasWeight = weight && weight > 0;
    const hasReps = reps && reps > 0;
    
    setW(hasWeight ? String(weight) : '');
    setR(hasReps ? String(reps) : '');
  }, [setObj.id, setObj.weight_kg, setObj.reps]);

  async function save() {
    const weight = parseFloat(w);
    const reps = parseInt(r, 10);
    const res = await updateSet(sessionId, exId, setObj.id, {
      weight_kg: isNaN(weight) ? 0 : weight,
      reps: isNaN(reps) ? 0 : reps,
    });
    onChange(res);
  }

  return (
    <div className="set-row session-exercise-set-grid">
      <div className="set-index-col">#{setObj.set_index}</div>
      <div className="set-prev-col">
        {previous ? `${previous.weight_kg}kg x${previous.reps}` : '—'}
      </div>
      <div className="set-input-col">
        <input
          type="number"
          step="0.25"
          value={w}
          onChange={(e) => {
            let val = e.target.value;
            if (val.length > 1 && val.startsWith('0') && val[1] !== '.') val = val.substring(1);
            setW(val);
          }}
          onBlur={save}
          placeholder={previous ? String(previous.weight_kg) : '0'}
          className="set-input"
        />
      </div>
      <div className="set-input-col">
        <input
          type="number"
          value={r}
          onChange={(e) => {
            let val = e.target.value;
            if (val.length > 1 && val.startsWith('0')) val = val.substring(1);
            setR(val);
          }}
          onBlur={save}
          placeholder={previous ? String(previous.reps) : '0'}
          className="set-input"
        />
      </div>
      <button className="btn-remove-set" onClick={onRemove} title="Remove set">✕</button>
    </div>
  );
}

export interface PlaceholderSetRowProps {
  sessionId: number;
  exId: number;
  setIndex: number;
  previous?: Pick<ExerciseSet, 'set_index' | 'weight_kg' | 'reps'>;
  onCreate: (created: ExerciseSet) => void;
}

export function PlaceholderSetRow({ sessionId, exId, setIndex, previous, onCreate }: PlaceholderSetRowProps) {
  const [w, setW] = useState<string>('');
  const [r, setR] = useState<string>('');
  const dirty = w.trim() !== '' || r.trim() !== '';

  async function createIfDirty() {
    if (!dirty) return;
    const weight = parseFloat(w);
    const reps = parseInt(r, 10);
    const payload: any = { set_index: setIndex };
    if (!isNaN(weight)) payload.weight_kg = weight;
    if (!isNaN(reps)) payload.reps = reps;
    const created = await addSet(sessionId, exId, payload) as ExerciseSet;
    onCreate(created);
  }

  return (
    <div className="set-row session-exercise-set-grid session-placeholder-row">
      <div className="set-index-col">#{setIndex}</div>
      <div className="set-prev-col">
        {previous ? `${previous.weight_kg}kg x${previous.reps}` : '—'}
      </div>
      <div className="set-input-col">
        <input
          type="number"
          step="0.5"
          value={w}
          onChange={(e) => {
            let val = e.target.value;
            if (val.length > 1 && val.startsWith('0') && val[1] !== '.') val = val.substring(1);
            setW(val);
          }}
          onBlur={createIfDirty}
          placeholder={previous ? String(previous.weight_kg) : '0'}
          className="set-input"
        />
      </div>
      <div className="set-input-col">
        <input
          type="number"
          value={r}
          onChange={(e) => {
            let val = e.target.value;
            if (val.length > 1 && val.startsWith('0')) val = val.substring(1);
            setR(val);
          }}
          onBlur={createIfDirty}
          placeholder={previous ? String(previous.reps) : '0'}
          className="set-input"
        />
      </div>
      <div />
    </div>
  );
}