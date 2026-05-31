import { 
  BaseExercise, 
  HistorySession, 
  LifetimeStats, 
  PerMuscleRep, 
  Top5Exercise 
} from '../types';

export function getExerciseImagesMap(baseExercises: BaseExercise[]): Record<string, string | undefined> {
  const imgMap: Record<string, string | undefined> = {};
  if (Array.isArray(baseExercises)) {
    baseExercises.forEach((ex) => {
      if (ex && ex.name) {
        imgMap[String(ex.name)] = ex.image_url || undefined;
      }
    });
  }
  return imgMap;
}

export function calculateTop5Exercises(
  history: HistorySession[] | null, 
  lifetime: LifetimeStats | null
): Top5Exercise[] {
  const counts = new Map<string, number>();
  for (const sess of history || []) {
    const names = new Set<string>((sess.exercises || []).map((e) => e.name));
    names.forEach(n => counts.set(n, (counts.get(n) || 0) + 1));
  }
  
  const lifetimeByName = new Map<string, { sets: number; reps: number; volume: number }>();
  (lifetime?.exercises || []).forEach((e) => {
    lifetimeByName.set(e.name, { sets: e.sets, reps: e.reps, volume: e.volume });
  });
  
  return Array.from(counts.entries())
    .map(([name, occurrences]) => ({ 
      name, 
      occurrences, 
      ...(lifetimeByName.get(name) || { sets: 0, reps: 0, volume: 0 }) 
    }))
    .sort((a, b) => b.occurrences - a.occurrences)
    .slice(0, 5);
}

export function calculatePerMuscleReps(
  history: HistorySession[] | null, 
  days: number | 'all'
): PerMuscleRep[] {
  try {
    const now = new Date();
    const since = (days === 'all') ? null : new Date(now.getTime() - Number(days) * 24 * 60 * 60 * 1000);
    const repsByMuscle = new Map<string, number>();
    
    for (const sess of (history || [])) {
      const startedAt = sess?.started_at ? new Date(sess.started_at) : null;
      if (since && startedAt && startedAt < since) continue;
      
      for (const ex of (sess.exercises || [])) {
        let repsSum = 0;
        for (const st of (ex.sets || [])) {
          const r = Number(st.reps || 0);
          if (r > 0) repsSum += r;
        }
        if (repsSum <= 0) continue;
        
        let muscles: string[] = [];
        try {
          muscles = Array.isArray(ex.target_muscles) ? ex.target_muscles : [];
        } catch {}
        
        if (!muscles || muscles.length === 0) muscles = ['other'];
        const share = repsSum / Math.max(1, muscles.length);
        
        for (const m of muscles) {
          const key = String(m).trim().toLowerCase();
          repsByMuscle.set(key, (repsByMuscle.get(key) || 0) + share);
        }
      }
    }
    
    const totalReps = Array.from(repsByMuscle.values()).reduce((a, b) => a + b, 0) || 0;
    return Array.from(repsByMuscle.entries()).map(([name, reps]) => ({
      name,
      reps,
      share: totalReps > 0 ? reps / totalReps : 0,
    })).sort((a, b) => b.reps - a.reps);
  } catch (e) {
    return [];
  }
}
