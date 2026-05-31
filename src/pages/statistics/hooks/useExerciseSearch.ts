import { useState, useEffect } from 'react';
import { searchExerciseCatalog } from '../../../services/api';
import { useDebounce } from '../../../hooks/useDebounce';
import { CatalogItem } from '../types';

export function useExerciseSearch(debounceDelay: number = 300) {
  const [exerciseQuery, setExerciseQuery] = useState('');
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  
  const debouncedQuery = useDebounce(exerciseQuery, debounceDelay);

  useEffect(() => {
    if (!debouncedQuery) { 
      setCatalog([]); 
      return; 
    }
    setCatalogLoading(true);
    searchExerciseCatalog(debouncedQuery)
      .then(list => setCatalog(list as CatalogItem[]))
      .catch(() => setCatalog([]))
      .finally(() => setCatalogLoading(false));
  }, [debouncedQuery]);

  return {
    exerciseQuery,
    setExerciseQuery,
    catalog,
    catalogLoading
  };
}
