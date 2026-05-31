import { ExerciseDetailMetadata } from '../types';

export function parseExerciseImageUrl(metadata?: ExerciseDetailMetadata): string | undefined {
  if (!metadata) return undefined;
  return metadata.image_url || metadata.imageUrl || metadata.gifUrl || metadata.gifURL || metadata.image || metadata.url;
}

export function parseTargetMuscles(metadata?: ExerciseDetailMetadata): string[] {
  if (!metadata) return [];
  const raw = metadata.targetMuscles || metadata.target_muscles || metadata.primaryMuscles || metadata.primary_muscles || metadata.muscles || metadata.bodyPart || metadata.body_part;
  
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((x) => String(x).trim()).filter(Boolean);
  }
  if (typeof raw === 'string') {
    return raw.split(/[,;]/).map(s => s.trim()).filter(Boolean);
  }
  return [];
}
