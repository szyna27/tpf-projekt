import { useState, useEffect, useMemo } from 'react';
import { getHistoryDetail } from '../../../../services/api';
import type { Session } from '../../../../types/fitness';
import { computeExerciseVolume } from '../utils/volumeHelpers';

export function useHistoryDetail(id: string | undefined) {
  const [data, setData] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;
    let cancel = false;
    (async () => {
      try {
        setLoading(true);
        const d = await getHistoryDetail(Number(id));
        if (!cancel) {
          setData(d);
          setError(null);
        }
      } catch (e: unknown) {
        if (!cancel) {
          setError(e instanceof Error ? e.message : 'Error loading workout details');
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [id]);

  const { totalVolume, muscles } = useMemo(() => {
    if (!data) return { totalVolume: 0, muscles: [] as string[] };
    const exercises = data.exercises || [];
    const vol = typeof data.total_volume === 'number'
      ? data.total_volume
      : exercises.reduce((acc, ex) => acc + computeExerciseVolume(ex), 0);
    const allMuscles = new Set<string>(Array.isArray(data.trained_muscles) ? data.trained_muscles : []);
    if (allMuscles.size === 0) {
      for (const ex of exercises) {
        (ex.target_muscles || []).forEach(m => allMuscles.add(m));
      }
    }
    return { totalVolume: Math.round(vol * 100) / 100, muscles: Array.from(allMuscles).sort() };
  }, [data]);

  const repsBreakdown = useMemo(() => {
    if (!data) return [] as { name: string; reps: number; share: number }[];
    const exercises = data.exercises || [];
    const buckets = new Map<string, number>();
    for (const ex of exercises) {
      const reps = (ex.sets || []).reduce((sum, s) => sum + Number(s.reps || 0), 0);
      if (!reps) continue;
      const mlist = (ex.target_muscles && ex.target_muscles.length > 0) ? ex.target_muscles : ['inne'];
      const sharePerMuscle = mlist.length > 0 ? reps / mlist.length : 0;
      for (const m of mlist) {
        const key = (m || 'inne').toLowerCase();
        buckets.set(key, (buckets.get(key) || 0) + sharePerMuscle);
      }
    }
    const totalReps = Array.from(buckets.values()).reduce((a, b) => a + b, 0) || 0;
    const arr = Array.from(buckets.entries()).map(([name, reps]) => ({
      name,
      reps,
      share: totalReps > 0 ? reps / totalReps : 0,
    })).sort((a, b) => b.reps - a.reps);
    return arr;
  }, [data]);

  return { data, error, loading, totalVolume, muscles, repsBreakdown };
}
