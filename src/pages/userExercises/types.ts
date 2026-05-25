export interface ExerciseMetadata {
  equipments?: string[];
  targetMuscles?: string[];
  image_url?: string;
  [key: string]: unknown;
}

export interface UserExercise {
  id: number;
  name: string;
  image_url?: string;
  equipment?: string;
  target_muscles?: string[];
  body_part?: string;
  metadata?: ExerciseMetadata;
}

export interface ExerciseAttributes {
  equipments: string[];
  targetMuscles: string[];
}
