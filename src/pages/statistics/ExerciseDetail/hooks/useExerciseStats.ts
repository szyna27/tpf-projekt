import { useState, useEffect, useMemo } from 'react';
import { getExerciseStats } from '../../../../services/api';
import { ExerciseStatsData } from '../types';
import { parseExerciseImageUrl, parseTargetMuscles } from '../utils/exerciseDataParser';

export function useExerciseStats(exerciseName: string) {
  const [data, setData] = useState<ExerciseStatsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!exerciseName) return;
    setLoading(true);
    getExerciseStats({ name: exerciseName })
      .then((d) => { 
        setData(d as ExerciseStatsData); 
        setError(null); 
      })
      .catch((e) => setError(e.message || 'Error loading exercise statistics'))
      .finally(() => setLoading(false));
  }, [exerciseName]);

  const parsedData = useMemo(() => {
    if (!data) return null;
    const imageUrl = parseExerciseImageUrl(data.metadata);
    const targetMuscles = parseTargetMuscles(data.metadata);
    const muscleLabels = targetMuscles.map(m => m.charAt(0).toUpperCase() + m.slice(1));
    return {
      imageUrl,
      muscleLabels
    };
  }, [data]);

  return {
    data,
    loading,
    error,
    imageUrl: parsedData?.imageUrl,
    muscleLabels: parsedData?.muscleLabels || []
  };
}
