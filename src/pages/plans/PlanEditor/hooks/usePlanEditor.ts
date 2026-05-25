import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getTrainingPlan, getExerciseCatalog, 
  deleteExercise, updateExercise, addPlanSet, deletePlanSet,
  updateTrainingPlan, addExercise
} from '../../../../services/api';
import { CatalogItem, ExerciseConfig } from '../../../../components/exercises/ExerciseCatalogModal';

export function usePlanEditor() {
  const { id } = useParams();
  const planId = Number(id);
  const navigate = useNavigate();
  const [detail, setDetail] = useState<any | null>(null);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const [plan, cat] = await Promise.all([getTrainingPlan(planId), getExerciseCatalog()]);
        if (!cancel) { setDetail(plan); setCatalog(cat); }
      } catch {
        if (!cancel) setDetail(null);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [planId]);

  async function remove(exId: number) {
    if (!window.confirm('Remove exercise from template?')) return;
    await deleteExercise(planId, exId);
    setDetail((d: any) => ({ ...d, exercises: (d?.exercises || []).filter((x: any) => x.id !== exId) }));
  }

  async function move(exId: number, dir: -1 | 1) {
    if (!detail) return;
    const list = [...(detail.exercises || [])];
    const idx = list.findIndex((x: any) => x.id === exId);
    const j = idx + dir;
    if (idx === -1 || j < 0 || j >= list.length) return;
    const [a, b] = [list[idx], list[j]];
    list[idx] = b; list[j] = a;
    await updateExercise(planId, a.id, { order: j });
    await updateExercise(planId, b.id, { order: idx });
    setDetail((d: any) => ({ ...d, exercises: list }));
  }

  async function handleAddSet(exId: number) {
    try {
      const newSet = await addPlanSet(planId, exId, {});
      setDetail((d: any) => ({
        ...d,
        exercises: d.exercises.map((ex: any) => {
          if (ex.id !== exId) return ex;
          return { ...ex, sets_detail: [...(ex.sets_detail || []), newSet] };
        })
      }));
    } catch (e) {
      alert('Failed to add set');
    }
  }

  async function handleRemoveSet(exId: number, setId: number) {
    try {
      await deletePlanSet(planId, exId, setId);
      setDetail((d: any) => ({
        ...d,
        exercises: d.exercises.map((ex: any) => {
          if (ex.id !== exId) return ex;
          const remaining = (ex.sets_detail || []).filter((s: any) => s.id !== setId);
          const reindexed = remaining.map((s: any, i: number) => ({ ...s, set_index: i + 1 }));
          return { ...ex, sets_detail: reindexed };
        })
      }));
    } catch (e) {
      alert('Failed to remove set');
    }
  }

  function handleSetChange(exId: number, updatedSet: any) {
    setDetail((d: any) => ({
      ...d,
      exercises: d.exercises.map((ex: any) => {
        if (ex.id !== exId) return ex;
        return {
          ...ex,
          sets_detail: (ex.sets_detail || []).map((s: any) => s.id === updatedSet.id ? updatedSet : s)
        };
      })
    }));
  }

  async function saveName(name: string) {
    await updateTrainingPlan(planId, { name });
    setDetail((d: any) => ({ ...d, name }));
  }

  async function saveDescription(description: string) {
    await updateTrainingPlan(planId, { description });
    setDetail((d: any) => ({ ...d, description }));
  }

  async function handleAddExerciseSubmit(item: CatalogItem, config?: ExerciseConfig) {
    try {
      const payload: any = item.kind === 'base' ? { base_exercise_id: item.id } : { name: item.name };
      if (config && config.sets.length > 0) {
        payload.sets_detail = config.sets.map(s => ({ reps: s.reps, weight_kg: s.weight }));
      }
      const created = await addExercise(planId, payload);
      setDetail((d: any) => ({ ...d, exercises: [...(d?.exercises || []), created] }));
      setCatalogOpen(false);
    } catch (e: any) {
      alert(e.message || 'Failed to add to template');
    }
  }

  return {
    planId,
    detail,
    setDetail,
    catalog,
    setCatalog,
    catalogOpen,
    setCatalogOpen,
    loading,
    remove,
    move,
    handleAddSet,
    handleRemoveSet,
    handleSetChange,
    saveName,
    saveDescription,
    handleAddExerciseSubmit,
    navigate
  };
}
