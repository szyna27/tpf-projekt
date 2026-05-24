import { useEffect, useState } from 'react';
import { updatePlanSet } from '../../../../services/api';
import type { ExerciseSet } from '../../../../types/fitness';

export interface PlanSetRowProps {
  planId: number;
  exId: number;
  setObj: ExerciseSet;
  onChange: (upd: ExerciseSet) => void;
  onRemove: () => void;
}

export function PlanSetRow({ planId, exId, setObj, onChange, onRemove }: PlanSetRowProps) {
  const [w, setW] = useState<string>('');
  const [r, setR] = useState<string>('');

  useEffect(() => {
    const weight = setObj.weight_kg;
    const reps = setObj.reps;
    // Check for non-zero values to populate the inputs
    const hasWeight = weight && weight > 0;
    const hasReps = reps && reps > 0;

    setW(hasWeight ? String(weight) : '');
    setR(hasReps ? String(reps) : '');
  }, [setObj.id, setObj.weight_kg, setObj.reps]);

  async function save() {
    const weight = parseFloat(w);
    const reps = parseInt(r, 10);
    const res = await updatePlanSet(planId, exId, setObj.id, {
      weight_kg: isNaN(weight) ? 0 : weight,
      reps: isNaN(reps) ? 0 : reps,
    });
      onChange(res as ExerciseSet);
  }

  return (
    <div className="set-row">
      <div className="set-index-col">#{setObj.set_index}</div>
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
          placeholder="0"
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
          placeholder="0"
          className="set-input"
        />
      </div>
      <button className="btn-remove-set" onClick={onRemove} title="Remove set">✕</button>
    </div>
  );
}
