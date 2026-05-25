export interface CatalogItem {
  id: number;
  name: string;
  kind: 'base' | 'custom';
  image_url?: string;
  target_muscles?: string[];
}

export interface ExerciseConfig {
  sets: Array<{
    reps: number;
    weight: number;
  }>;
}

export interface ExerciseAttributes {
  equipments: string[];
  targetMuscles: string[];
}

export interface CreatedExercise {
  id: number;
  name: string;
  image_url?: string;
  metadata?: Record<string, unknown>;
}

export interface ImageUploadResult {
  public_url: string;
}

export interface CustomExercisePayload {
  name: string;
  equipment?: string;
  target_muscles?: string[];
  image_url?: string;
}
