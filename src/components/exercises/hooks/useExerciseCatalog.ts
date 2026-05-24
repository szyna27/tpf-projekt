import { useEffect, useMemo, useState } from 'react';
import { searchExerciseCatalog, titleCaseName } from '../../../services/api';
import type { CatalogItem } from '../types';

export interface UseExerciseCatalogOptions {
  catalog: CatalogItem[];
}

export function useExerciseCatalog({ catalog }: UseExerciseCatalogOptions) {
  const [query, setQuery] = useState('');
  const [remoteResults, setRemoteResults] = useState<CatalogItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customModal, setCustomModal] = useState(false);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setRemoteResults(null);
      setLoading(false);
      setError(null);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    const timeoutId = window.setTimeout(() => {
      void searchExerciseCatalog(trimmedQuery)
        .then(results => {
          if (active) {
            setRemoteResults(results as CatalogItem[]);
          }
        })
        .catch(error => {
          if (active) {
            setError(error instanceof Error ? error.message : 'Search error');
            setRemoteResults(null);
          }
        })
        .finally(() => {
          if (active) {
            setLoading(false);
          }
        });
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  const filtered = useMemo(() => {
    const baseList = remoteResults ?? catalog;
    return baseList.map(item => ({
      ...item,
      name: titleCaseName(item.name)
    }));
  }, [catalog, remoteResults]);

  return {
    query,
    setQuery,
    filtered,
    loading,
    error,
    customModal,
    setCustomModal
  };
}
