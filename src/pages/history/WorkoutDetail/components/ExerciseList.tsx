import type { SessionExercise } from '../../../../types/fitness';
import ExerciseCard from './ExerciseCard';

interface ExerciseListProps {
  exercises: SessionExercise[];
}

export default function ExerciseList({ exercises }: ExerciseListProps) {
  if (exercises.length === 0) return null;

  return (
    <div className="wd-exercise-list">
      {exercises.map((ex) => (
        <ExerciseCard key={ex.id} ex={ex} />
      ))}
    </div>
  );
}
