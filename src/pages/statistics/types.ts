export interface BaseExercise {
  id?: number;
  name?: string;
  image_url?: string;
}

export interface ExerciseSet {
  reps?: number;
}

export interface SessionExercise {
  name: string;
  sets?: ExerciseSet[];
  target_muscles?: string[];
}

export interface HistorySession {
  started_at?: string;
  exercises?: SessionExercise[];
}

export interface LifetimeExercise {
  name: string;
  sets: number;
  reps: number;
  volume: number;
}

export interface LifetimeStats {
  exercises?: LifetimeExercise[];
}

export interface DailyVolume {
  date: string;
  volume: number;
}

export interface StatsSummaryResponse {
  all_time?: boolean;
  period_days?: number;
  sessions_count: number;
  sets_count: number;
  repetitions_count: number;
  exercises_count: number;
  total_volume: number;
  daily_volume?: DailyVolume[];
  per_muscle?: unknown[];
}

export interface AiRecommendationItem {
  id: number;
  name: string;
  muscles: string[];
  image_url?: string;
}

export interface AiMuscleVolume {
  name: string;
  volume: number;
}

export interface AiRecommendationResponse {
  period_days: number;
  most_trained_muscle: string;
  most_trained_reps: number;
  muscles: AiMuscleVolume[];
  recommendations: AiRecommendationItem[];
  is_balanced?: boolean;
}

export interface Top5Exercise {
  name: string;
  occurrences: number;
  sets: number;
  reps: number;
  volume: number;
}

export interface PerMuscleRep {
  name: string;
  reps: number;
  share: number;
}

export interface CatalogItem {
  id: number;
  name: string;
  kind: string;
}
