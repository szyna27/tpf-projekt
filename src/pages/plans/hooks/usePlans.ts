import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  getTrainingPlans, deleteTrainingPlan, startSession, 
  getExerciseCatalog, getActiveSessions 
} from '../../../services/api';
import { emitActiveSessionChanged } from '../../../services/events';
import type { Plan } from '../../../types/fitness';

export function usePlans() {
  const navigate = useNavigate();
  const location = useLocation();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any | null>(null);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [catalog, setCatalog] = useState<any[]>([]);
  const [catalogModal, setCatalogModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const data = await getTrainingPlans();
        if (!cancel) setPlans(data || []);
      } catch {
        if (!cancel) setPlans([]);
      }
    })();
    return () => { cancel = true; };
  }, []);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const items = await getExerciseCatalog();
        if (!cancel) setCatalog(items || []);
      } catch {
        if (!cancel) setCatalog([]);
      }
    })();
    return () => { cancel = true; };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const active = await getActiveSessions();
        if (Array.isArray(active)) setActiveSessions(active);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('continue') === '1') {
      (async () => {
        try {
          const active = await getActiveSessions();
          if (Array.isArray(active) && active.length > 0) {
            setSession(active[0]);
            setModalOpen(true);
            // Optionally clear the query parameter so reloading doesn't keep triggering it
            navigate('/plans', { replace: true });
          }
        } catch {}
      })();
    }
  }, [location.search, navigate]);

  function onPlanCreated(plan: Plan) {
    setPlans(p => [plan, ...p]);
  }

  function delPlan(id: number) {
    if (!window.confirm('Delete the entire plan?')) return;
    setLoading(true);
    deleteTrainingPlan(id)
      .then(() => setPlans(p => p.filter(x => x.id !== id)))
      .finally(() => setLoading(false));
  }

  async function onStart(planId: number) {
    try {
      const s = await startSession(planId);
      setSession(s);
      setModalOpen(true);
      setErrorMsg(null);
      setActiveSessions(list => [...list.filter(x => x.id !== s.id), s]);
      emitActiveSessionChanged();
    } catch (err: any) {
      setErrorMsg('You already have an active training session. Finish it or continue to start a new one.');
    }
  }

  return {
    plans,
    loading,
    session,
    activeSessions,
    modalOpen,
    catalog,
    catalogModal,
    errorMsg,
    onPlanCreated,
    delPlan,
    onStart,
    setSession,
    setActiveSessions,
    setModalOpen,
    setCatalogModal,
    setErrorMsg,
    setCatalog,
    navigate
  };
}
