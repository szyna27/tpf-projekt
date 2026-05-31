import { useState, useEffect } from 'react';
import { getHistory } from '../../../services/api';
import type { Session } from '../../../types/fitness';

export function useHistory() {
  const [items, setItems] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const data = await getHistory();
        if (!cancel) setItems(data || []);
      } catch {
        if (!cancel) setItems([]);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, []);

  return { items, loading };
}
