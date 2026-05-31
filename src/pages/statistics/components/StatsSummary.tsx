import EnhancedLineChart from '../../../components/charts/EnhancedLineChart';
import PerMuscleBars from '../../../components/charts/PerMuscleBars';
import { StatsSummaryResponse, PerMuscleRep } from '../types';

interface StatsSummaryProps {
  days: number | 'all';
  setDays: (days: number | 'all') => void;
  summary: StatsSummaryResponse | null;
  perMuscleReps: PerMuscleRep[];
}

export default function StatsSummary({ days, setDays, summary, perMuscleReps }: StatsSummaryProps) {
  if (!summary) return null;

  return (
    <div className="card stats-summary-card">
      <div className="charts-grid">
        <div className="stats-summary-full-width">
          <div className="stats-summary-header">
            <h3 className="stats-summary-title">Summary ({summary.all_time ? 'All time' : `${summary.period_days} days`})</h3>
            <label className="stats-period-label">
              <span className="stats-period-text">Period:</span>
              <select
                value={String(days)}
                onChange={e => setDays(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="stats-period-select"
              >
                <option value="7">7 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="all">All time</option>
              </select>
            </label>
          </div>
          
          <div className="stat-cards">
            <div className="stat-card"><h4>Workouts</h4><div className="value">{summary.sessions_count}</div></div>
            <div className="stat-card"><h4>Sets</h4><div className="value">{summary.sets_count}</div></div>
            <div className="stat-card"><h4>Repetitions</h4><div className="value">{summary.repetitions_count}</div></div>
            <div className="stat-card"><h4>Exercises</h4><div className="value">{summary.exercises_count}</div></div>
            <div className="stat-card">
              <h4>Total volume</h4>
              <div className="value">{Math.round(summary.total_volume)}<small> kg·reps</small></div>
            </div>
            <div className="stat-card">
              <h4>Avg. volume/day</h4>
              <div className="value">
                {Math.round(summary.daily_volume?.length 
                  ? (summary.total_volume / Math.max(summary.daily_volume.length, 1)) 
                  : 0)}
                <small> kg·reps</small>
              </div>
            </div>
          </div>
          
          <div>
            <strong>Daily volume</strong>
            <EnhancedLineChart 
              height={432} 
              data={(summary.daily_volume || []).map(d => ({ date: d.date, volume: d.volume }))} 
              xKey="date" 
              yKey="volume" 
              yUnit="kg·reps" 
              area 
            />
          </div>
        </div>

        <PerMuscleBars data={(summary.per_muscle as any[]) || []} repsData={perMuscleReps} />
      </div>
    </div>
  );
}
