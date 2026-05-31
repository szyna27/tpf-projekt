export interface ExerciseDetailMetadata {
  image_url?: string;
  imageUrl?: string;
  gifUrl?: string;
  gifURL?: string;
  image?: string;
  url?: string;
  targetMuscles?: string | string[];
  target_muscles?: string | string[];
  primaryMuscles?: string | string[];
  primary_muscles?: string | string[];
  muscles?: string | string[];
  bodyPart?: string | string[];
  body_part?: string | string[];
  [key: string]: unknown;
}

export interface OneRmHistoryItem {
  date: string;
  one_rm: number;
}

export interface WeightTrendItem {
  date: string;
  max_weight: number;
}

export interface VolumeTrendItem {
  date: string;
  volume: number;
}

export interface ExerciseStatsData {
  metadata?: ExerciseDetailMetadata;
  sessions_count?: number;
  total_sets?: number;
  total_reps?: number;
  total_volume?: number;
  record_1rm?: number;
  one_rm_history?: OneRmHistoryItem[];
  weight_trend?: WeightTrendItem[];
  volume_trend?: VolumeTrendItem[];
}
