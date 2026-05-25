import { createTrainingPlan, addSessionExercise, titleCaseName } from '../../services/api';
import { emitActiveSessionChanged } from '../../services/events';
import ExerciseCatalogModal from '../../components/exercises/ExerciseCatalogModal';
import type { CatalogItem } from '../../components/exercises/ExerciseCatalogModal';
import PlanCard from './components/PlanCard';
import SessionModal from './ActiveSession';
import { usePlans } from './hooks/usePlans';
import { ActiveSessionAlert } from './components/ActiveSessionAlert';
import './Plans.css';

export default function Plans() {
  const {
    plans,
    session,
    activeSessions,
    modalOpen,
    catalog,
    catalogModal,
    errorMsg,
    delPlan,
    onStart,
    setSession,
    setActiveSessions,
    setModalOpen,
    setCatalogModal,
    setErrorMsg,
    setCatalog,
    navigate
  } = usePlans();

  return (
    <div className="grid plans-grid">
      <div className="card plans-card">
        <div className="plans-header-row">
          <h1 className="plans-header">My Workouts</h1>
          <button className="btn btn-add-plan" onClick={async () => {
            try {
              const p = await createTrainingPlan("New Plan");
              navigate(`/plans/${p.id}/edit`);
            } catch (e) {
              alert('Failed to create plan');
            }
          }}>+ New Plan</button>
        </div>
        {errorMsg && (
          <ActiveSessionAlert
            errorMsg={errorMsg}
            setSession={setSession}
            setModalOpen={setModalOpen}
            setErrorMsg={setErrorMsg}
          />
        )}
        {plans.length === 0 && <p className="note">No plans. Add your first one above.</p>}
        <div className="plans-list">
          {plans.map(p => {
            const act = activeSessions.find(s => s.plan === p.id);
            return (
              <PlanCard
                key={p.id}
                plan={p}
                activeSession={act}
                titleCaseName={titleCaseName}
                onStart={() => onStart(p.id)}
                onContinue={(s) => { setSession(s); setModalOpen(true); setErrorMsg(null); }}
                onDelete={() => delPlan(p.id)}
                onEditTemplate={() => navigate(`/plans/${p.id}/edit`)}
              />
            );
          })}
        </div>
      </div>

      {modalOpen && session && (
        <SessionModal
          session={session}
          onOpenCatalog={() => setCatalogModal(true)}
          catalog={catalog}
          onClose={() => {
            setModalOpen(false);
            if (session) {
              setActiveSessions(list => {
                const exists = list.find(s => s.id === session.id);
                return exists ? list : [...list, session];
              });
            }
            setSession(null);
          }}
          onUpdate={(s) => {
            setSession(s);
            setActiveSessions(list => list.map(x => x.id === s.id ? s : x));
          }}
          onFinished={(s) => {
            setActiveSessions(list => list.filter(x => x.id !== s.id));
            setSession(null);
            setModalOpen(false);
            emitActiveSessionChanged();
            navigate(`/history/${s.id}`);
          }}
          onDiscarded={(id) => {
            setActiveSessions(list => list.filter(x => x.id !== id));
            setSession(null);
            setModalOpen(false);
            emitActiveSessionChanged();
          }}
        />
      )}
      {catalogModal && session && (
        <ExerciseCatalogModal
          catalog={catalog}
          onClose={() => setCatalogModal(false)}
          onAddCustom={(item: { id: number; name: string }) => {
            setCatalog(c => [...c, { id: item.id, name: item.name, kind: 'custom' }]);
            if (session) {
              (async () => {
                try {
                  const created = await addSessionExercise(session.id, { name: item.name });
                  const upd = { ...session, exercises: [...(session.exercises || []), created] };
                  setSession(upd);
                } catch (e: any) {
                  alert(e?.message || 'Cannot add this exercise to the session (it may already exist).');
                }
              })();
            }
          }}
          onSelect={async (item: CatalogItem) => {
            try {
              const payload: any = item.kind === 'base' ? { base_exercise_id: item.id } : { name: item.name };
              const created = await addSessionExercise(session.id, payload);
              const upd = { ...session, exercises: [...(session.exercises || []), created] };
              setSession(upd);
              setCatalogModal(false);
            } catch (e: any) {
              alert(e?.message || 'Cannot add this exercise to the session (it may already exist).');
            }
          }}
        />
      )}
    </div>
  );
}
