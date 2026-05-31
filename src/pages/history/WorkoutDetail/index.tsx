import { useParams, Link } from 'react-router-dom';
import { useHistoryDetail } from './hooks/useHistoryDetail';
import WorkoutSummary from './components/WorkoutSummary';
import RepsBreakdownChart from './components/RepsBreakdownChart';
import ExerciseList from './components/ExerciseList';
import './WorkoutDetail.css';

export default function HistoryDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, error, loading, totalVolume, muscles, repsBreakdown } = useHistoryDetail(id);

  if (loading) {
    return <div className="card"><p className="note">Loading…</p></div>;
  }

  if (error || !data) {
    return <div className="card"><p className="note">{error || 'Workout not found.'}</p></div>;
  }

  return (
    <div className="grid">
      <div className="card wd-full-width">
        <div className="wd-header">
          <h2 className="wd-title">{data.plan_name}</h2>
          <Link className="btn outline" style={{ textDecoration: 'none', border: 'none' }} to="/history">← Back</Link>
        </div>

        <WorkoutSummary data={data} totalVolume={totalVolume} muscles={muscles} />

        <RepsBreakdownChart repsBreakdown={repsBreakdown} />

        <ExerciseList exercises={data.exercises || []} />
      </div>
    </div>
  );
}
