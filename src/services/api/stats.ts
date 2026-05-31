import { API_BASE } from './client';

export async function getHistory(page: number = 1) {
  try { 
    const res = await fetch(`${API_BASE}/history`); 
    const data = await res.json();
    return data;
  } catch { return []; }
}

export async function getStatistics(period: string = 'all') {
  try { const res = await fetch(`${API_BASE}/statistics`); return await res.json(); } catch { return {}; }
}

export async function getStatsSummary(period: string | number = 'all') {
  try {
    const historyData = await getHistory();
    if (!historyData || !Array.isArray(historyData)) return {};
    let sessions_count = 0;
    let sets_count = 0;
    let repetitions_count = 0;
    let exercises_count = 0;
    let total_volume = 0;
    const daily_volume: Record<string, number> = {};
    const per_muscle: Record<string, number> = {};

    const now = Date.now();
    const days = period === 'all' ? Infinity : Number(period);
    
    for (const h of historyData) {
      if (days < Infinity && h.started_at) {
        const hTime = new Date(h.started_at).getTime();
        if ((now - hTime) / 86400000 > days) continue;
      }
      sessions_count++;
      total_volume += (h.total_volume || 0);

      const dStr = typeof h.started_at === 'string' ? h.started_at.slice(0, 10) : '';
      if (dStr) {
        daily_volume[dStr] = (daily_volume[dStr] || 0) + (h.total_volume || 0);
      }

      for (const ex of (h.exercises || [])) {
        exercises_count++;
        for (const s of (ex.sets || [])) {
          sets_count++;
          repetitions_count += (s.reps || 0);
          for (const m of (ex.target_muscles || [])) {
             per_muscle[m] = (per_muscle[m] || 0) + 1;
          }
        }
      }
    }
    
    return {
      all_time: period === 'all',
      period_days: period === 'all' ? null : Number(period),
      sessions_count,
      sets_count,
      repetitions_count,
      exercises_count,
      total_volume,
      daily_volume: Object.entries(daily_volume).map(([date, volume]) => ({ date, volume })).sort((a,b) => a.date.localeCompare(b.date)),
      per_muscle: Object.entries(per_muscle).map(([muscle, volume]) => ({ muscle, volume }))
    };
  } catch { return {}; }
}

export async function getStatsLifetime() {
  try {
    const historyData = await getHistory();
    if (!historyData || !Array.isArray(historyData)) return {};
    const exMap: Record<string, any> = {};

    for (const h of historyData) {
      for (const ex of (h.exercises || [])) {
         if (!exMap[ex.name]) exMap[ex.name] = { name: ex.name, sets: 0, reps: 0, volume: 0 };
         for (const s of (ex.sets || [])) {
           exMap[ex.name].sets++;
           exMap[ex.name].reps += (s.reps || 0);
           exMap[ex.name].volume += (s.weight_kg || 0) * (s.reps || 0);
         }
      }
    }

    return { exercises: Object.values(exMap) };
  } catch { return {}; }
}

export async function getExerciseStats(filters: any) { 
  try {
    const name = filters?.name || '';
    const historyData = await getHistory();
    if (!historyData || !Array.isArray(historyData)) { 
      return { 
        metadata: {}, 
        one_rm_history: [], 
        weight_trend: [], 
        volume_trend: [],
        sessions_count: 0,
        total_sets: 0,
        total_reps: 0,
        total_volume: 0,
        record_1rm: 0
      }; 
    }
    const one_rm_history: any[] = [];
    const weight_trend: any[] = [];
    const volume_trend: any[] = [];
    let metadata = { targetMuscles: [] as string[] };

    let sessions_count = 0;
    let total_sets = 0;
    let total_reps = 0;
    let total_volume = 0;
    let record_1rm = 0;

    for (const h of historyData) {
      const dStr = typeof h.started_at === 'string' ? h.started_at.slice(0, 10) : '';
      if (!dStr) continue;
      
      let matched_in_session = false;

      for (const ex of (h.exercises || [])) {
         if (ex.name === name || ex.exercise_name === name || (ex.name && ex.name.toLowerCase() === name.toLowerCase())) {
             if (!matched_in_session) {
                 sessions_count++;
                 matched_in_session = true;
             }
             if (ex.target_muscles) (metadata as any).targetMuscles = ex.target_muscles;
             if (ex.image_url) (metadata as any).image_url = ex.image_url;
             
           let max_w = 0;
           let v = 0;
           let max_1rm = 0;
           for (const s of (ex.sets || [])) {
             total_sets++;
             total_reps += (s.reps || 0);
             const set_vol = (s.weight_kg || 0) * (s.reps || 0);
             total_volume += set_vol;

             if ((s.weight_kg || 0) > max_w) max_w = s.weight_kg || 0;
             v += set_vol;
             const e1rm = (s.weight_kg || 0) * (1 + (s.reps || 0)/30);
             if (e1rm > max_1rm) max_1rm = e1rm;
           }
           
           if (max_1rm > record_1rm) record_1rm = max_1rm;

           weight_trend.push({ date: dStr, max_weight: max_w });
           volume_trend.push({ date: dStr, volume: v });
           one_rm_history.push({ date: dStr, one_rm: Math.round(max_1rm) });
         }
      }
    }
    return { 
      metadata, 
      one_rm_history, 
      weight_trend, 
      volume_trend,
      sessions_count,
      total_sets,
      total_reps,
      total_volume,
      record_1rm
    };
  } catch {
    return { 
      metadata: {}, 
      one_rm_history: [], 
      weight_trend: [], 
      volume_trend: [],
      sessions_count: 0,
      total_sets: 0,
      total_reps: 0,
      total_volume: 0,
      record_1rm: 0
    }; 
  } 
}

export async function getHistoryDetail(id: number | string) {
  try { const res = await fetch(`${API_BASE}/history/${id}`); return await res.json(); } catch { return {}; }
}

export async function getAiRecommendations(planId?: number | string) { 
  return { 
    period_days: 30,
    most_trained_muscle: 'Traps',
    most_trained_reps: 150,
    muscles: [{ name: 'Triceps', volume: 0 }, { name: 'Legs', volume: 20 }],
    recommendations: [
      { id: 1, name: 'Band shrug', muscles: ['Traps'], image_url: '/media/trmte8s.gif' },
      { id: 2, name: 'Barbell decline close grip to skull press', muscles: ['Triceps'], image_url: '/media/LMGXZn8.gif' }
    ],
    is_balanced: false
  }; 
}