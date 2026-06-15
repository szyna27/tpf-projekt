import { useState, useEffect } from 'react';
import { getStatsSummary, getStatsLifetime, getHistory, getAiRecommendations, getBaseExercises } from '../../../services/api';
import { 
  StatsSummaryResponse, 
  AiRecommendationResponse, 
  Top5Exercise, 
  PerMuscleRep,
  BaseExercise,
  HistorySession,
  LifetimeStats
} from '../types';
import { 
  getExerciseImagesMap, 
  calculateTop5Exercises, 
  calculatePerMuscleReps 
} from '../utils/statisticsHelpers';

export function useStatisticsData() {
  const [days, setDays] = useState<number | 'all'>('all');
  const [summary, setSummary] = useState<StatsSummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [top5, setTop5] = useState<Top5Exercise[]>([]);
  const [top5Loading, setTop5Loading] = useState<boolean>(true);
  const [exerciseImages, setExerciseImages] = useState<Record<string, string | undefined>>({});
  const [perMuscleReps, setPerMuscleReps] = useState<PerMuscleRep[]>([]);
  
  const [aiRec, setAiRec] = useState<AiRecommendationResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setTop5Loading(true);
    setAiLoading(true);
    
    Promise.all([
      getStatsSummary(days), 
      getStatsLifetime(), 
      getHistory(), 
      getAiRecommendations(), 
      getBaseExercises()
    ])
      .then(([s, l, hist, rec, baseExercises]) => {
        setSummary(s as StatsSummaryResponse);
        setAiRec(rec as AiRecommendationResponse);
        
        const imgMap = getExerciseImagesMap(baseExercises as BaseExercise[]);
        setExerciseImages(imgMap);
        
        const top5Items = calculateTop5Exercises(hist as HistorySession[], l as LifetimeStats);
        setTop5(top5Items);
        
        const perMuscle = calculatePerMuscleReps(hist as HistorySession[], days);
        setPerMuscleReps(perMuscle);
        
        setError(null);
        setAiError(null);
      })
      .catch(e => {
        setError(e.message || 'Error fetching statistics');
        setAiError(e.message || 'Error fetching AI recommendations');
      })
      .finally(() => { 
        setLoading(false); 
        setTop5Loading(false); 
        setAiLoading(false); 
      });
  }, [days]);

  return {
    days,
    setDays,
    summary,
    loading,
    error,
    top5,
    top5Loading,
    exerciseImages,
    perMuscleReps,
    aiRec,
    aiLoading,
    aiError
  };
}
