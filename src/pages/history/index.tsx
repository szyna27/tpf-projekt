import { useHistory } from './hooks/useHistory';
import WorkoutCard from './components/WorkoutCard';
import './History.css';

export default function History() {
  const { items, loading } = useHistory();

  return (
    <div className="grid">
      <div className="card full-width">
        <h1 className="history-title">Workouts History</h1>
        {loading && <p className="note">Loading...</p>}
        {!loading && items.length === 0 && <p className="note">No completed Workouts.</p>}
        <div className="history-list">
          {items.map((s) => (
            <WorkoutCard key={s.id} session={s} />
          ))}
        </div>
      </div>
    </div>
  );
}
