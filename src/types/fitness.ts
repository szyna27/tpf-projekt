export interface Plan {
  id: number;
  name: string;
  description?: string;
}

export interface ExerciseSet {
  id: number;
  set_index: number;
  weight_kg: number;
  reps: number;
}

export interface SessionExercise {
  id: number;
  name: string;
  order?: number;
  sets: ExerciseSet[];
  previous_sets?: Array<Pick<ExerciseSet, 'set_index' | 'weight_kg' | 'reps'>>;
  image_url?: string;
  body_parts?: string[];
  target_muscles?: string[];
  exercise_volume?: number; // sum(weight_kg * reps) across sets
}

export interface Session {
  id: number;
  plan: number;
  plan_name: string;
  started_at: string;
  exercises: SessionExercise[];
  finished_at?: string;
  duration_seconds?: number;
  total_volume?: number;
  trained_muscles?: string[];
}
