import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getActiveSessions } from '../../../services/api';
import { onActiveSessionChanged } from '../../../services/events';
import { Session } from '../../../types/fitness';
import { useAuth } from '../../../context/AuthContext';

export function useActiveSessionMonitor() {
  const { user } = useAuth();
  const location = useLocation();
  const [activeSession, setActiveSession] = useState<Session | null>(null);

  useEffect(() => {
    if (!user) {
      setActiveSession(null);
      return;
    }
    let cancel = false;
    (async () => {
      try {
        const data = await getActiveSessions();
        if (!cancel && Array.isArray(data) && data.length > 0) {
          setActiveSession(data[0]);
        } else if (!cancel) {
          setActiveSession(null);
        }
      } catch {
        if (!cancel) setActiveSession(null);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [user, location.pathname]);

  // Listen for global active-session change events
  useEffect(() => {
    const unsub = onActiveSessionChanged(async () => {
      if (!user) {
        setActiveSession(null);
        return;
      }
      try {
        const data = await getActiveSessions();
        setActiveSession(Array.isArray(data) && data.length > 0 ? data[0] : null);
      } catch {
        setActiveSession(null);
      }
    });
    return unsub;
  }, [user]);

  return { activeSession };
}