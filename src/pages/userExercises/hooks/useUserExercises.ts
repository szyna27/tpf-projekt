import { useState, useEffect, useMemo } from 'react';
import { listUserExercises, getExerciseAttributes, deleteUserExercise } from '../../../services/api';
import { UserExercise, ExerciseAttributes } from '../types';
import { useDebounce } from '../../../hooks/useDebounce';

export function useUserExercises() {
  const [items, setItems] = useState<UserExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attrs, setAttrs] = useState<ExerciseAttributes>({ equipments: [], targetMuscles: [] });
  const [query, setQuery] = useState('');
  
  const debouncedQuery = useDebounce(query, 250);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const [list, a] = await Promise.all([listUserExercises(), getExerciseAttributes()]);
        if (!cancel) { 
          setItems(list as UserExercise[]); 
          setAttrs(a as ExerciseAttributes); 
        }
      } catch (e) {
        if (!cancel) {
          const err = e as Error;
          setError(err.message || 'Loading error');
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, []);

  const filtered = useMemo(() => {
    const needle = debouncedQuery.trim().toLowerCase();
    if (!needle) return items;
    return items.filter(it => 
      it.name.toLowerCase().includes(needle) || 
      JSON.stringify(it.metadata || {}).toLowerCase().includes(needle)
    );
  }, [items, debouncedQuery]);

  function onCreated(newItem: UserExercise) {
    setItems(prev => [...prev, newItem].sort((a, b) => a.name.localeCompare(b.name)));
  }

  async function onDelete(id: number) {
    if (!window.confirm('Delete exercise?')) return;
    try {
      await deleteUserExercise(id);
      setItems(prev => prev.filter(x => x.id !== id));
    } catch (e) {
      const err = e as Error;
      alert(err.message || 'Failed to delete');
    }
  }

  const onUpdated = (upd: UserExercise) => {
    setItems(prev => prev.map(x => x.id === upd.id ? upd : x));
  };

  const onDeletedItem = (id: number) => {
    setItems(prev => prev.filter(x => x.id !== id));
  };

  return {
    items,
    loading,
    error,
    attrs,
    query,
    setQuery,
    filtered,
    onCreated,
    onDelete,
    onUpdated,
    onDeletedItem
  };
}
