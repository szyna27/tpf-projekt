import type { SessionExercise } from '../../../../types/fitness';

export const computeExerciseVolume = (ex: SessionExercise) => {
  if (!ex) return 0;
  if (typeof ex.exercise_volume === 'number') return ex.exercise_volume;
  return (ex.sets || []).reduce((sum, s) => sum + Number(s.weight_kg || 0) * Number(s.reps || 0), 0);
};
