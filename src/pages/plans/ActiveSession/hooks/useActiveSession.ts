import { useEffect, useState, useMemo } from 'react';
import {
  deleteSessionExercise,
  addSet,
  deleteSet,
  finishSession,
  discardSession,
  updateSessionExercise
} from '../../../../services/api';
import { Session, SessionExercise, ExerciseSet } from '../../../../types/fitness';

export function useActiveSession(session: Session, onUpdate: (s: Session) => void, onFinished: (s: Session) => void, onDiscarded: (id: number) => void) {
  const [local, setLocal] = useState<Session>(session);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [finishMinutes, setFinishMinutes] = useState<string>('');
  const [finishSeconds, setFinishSeconds] = useState<string>('');
  const [testDate, setTestDate] = useState<string>('');

  const started = useMemo(() => new Date(local.started_at).getTime(), [local.started_at]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const elapsed = Math.max(0, Math.floor((now - started) / 1000));
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  useEffect(() => setLocal(session), [session]);

  const removeSessExercise = async (exId: number) => {
    await deleteSessionExercise(local.id, exId);
    const upd = {
      ...local,
      exercises: (local.exercises || []).filter(x => x.id !== exId)
    };
    setLocal(upd);
    onUpdate(upd);
  };

  const move = async (exId: number, dir: -1 | 1) => {
    const list = [...(local.exercises || [])];
    const idx = list.findIndex(x => x.id === exId);
    if (idx === -1) return;
    const j = idx + dir;
    if (j < 0 || j >= list.length) return;
    const [a, b] = [list[idx], list[j]];
    list[idx] = b;
    list[j] = a;
    
    await updateSessionExercise(local.id, a.id, { order: j });
    await updateSessionExercise(local.id, b.id, { order: idx });
    
    const upd = { ...local, exercises: list };
    setLocal(upd);
    onUpdate(upd);
  };

  const addNewSet = async (exId: number) => {
    const created = await addSet(local.id, exId, {} as any);
    const upd = {
      ...local,
      exercises: (local.exercises || []).map((e: SessionExercise) => {
        if (e.id !== exId) return e;
        const next = [...(e.sets || []), created]
          .sort((a, b) => (a as any).set_index - (b as any).set_index)
          .map((s, idx) => ({ ...s, set_index: idx + 1 })) as ExerciseSet[];
        return { ...e, sets: next };
      })
    };
    setLocal(upd);
    onUpdate(upd);
  };

  const removeSet = async (exId: number, setId: number) => {
    await deleteSet(local.id, exId, setId);
    const upd = {
      ...local,
      exercises: (local.exercises || []).map((e: SessionExercise) => {
        if (e.id !== exId) return e;
        const remaining = (e.sets || [])
          .filter(s => s.id !== setId)
          .sort((a, b) => (a as any).set_index - (b as any).set_index);
        const reindexed = remaining.map((s, idx) => ({ ...s, set_index: idx + 1 })) as ExerciseSet[];
        return { ...e, sets: reindexed };
      })
    };
    setLocal(upd);
    onUpdate(upd);
  };

  const handleUpdateExerciseSet = (exId: number, currentSetId: number, updatdSet: any) => {
    const updLocal = {
      ...local,
      exercises: (local.exercises || []).map((e: SessionExercise) =>
        e.id === exId
          ? { ...e, sets: (e.sets || []).map(x => (x.id === currentSetId ? updatdSet : x)) }
          : e
      )
    };
    setLocal(updLocal);
    onUpdate(updLocal);
  };

  const finishWithOptionalDuration = async () => {
    const m = parseInt(finishMinutes || '');
    const s = parseInt(finishSeconds || '');
    let payload: any = {};
    if (!isNaN(m) || !isNaN(s)) {
      const total = (isNaN(m) ? 0 : Math.max(0, m)) * 60 + (isNaN(s) ? 0 : Math.max(0, s));
      if (total > 0) payload.duration_seconds = total;
    }
    if (import.meta.env.DEV && testDate) {
      payload.override_date = testDate; // YYYY-MM-DD
    }
    const done = await finishSession(local.id, payload);
    onFinished(done);
  };

  const discardConfirmed = async () => {
    try {
      await discardSession(local.id);
    } catch {}
    onDiscarded(local.id);
  };

  const showConfirmFinish = () => {
    setFinishMinutes(String(Math.floor(elapsed / 60)));
    setFinishSeconds(String(elapsed % 60));
    setConfirmFinish(true);
  };

  return {
    local,
    elapsed,
    mm,
    ss,
    confirmDiscard,
    setConfirmDiscard,
    confirmFinish,
    setConfirmFinish,
    finishMinutes,
    setFinishMinutes,
    finishSeconds,
    setFinishSeconds,
    testDate,
    setTestDate,
    removeSessExercise,
    move,
    addNewSet,
    removeSet,
    handleUpdateExerciseSet,
    finishWithOptionalDuration,
    discardConfirmed,
    showConfirmFinish
  };
}