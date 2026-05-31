import EnhancedLineChart from '../../../../components/charts/EnhancedLineChart';
import { ExerciseStatsData } from '../types';

interface ExerciseChartsProps {
  data: ExerciseStatsData;
}

export default function ExerciseCharts({ data }: ExerciseChartsProps) {
  return (
    <div className="card ed-charts-card">
      <div className="ed-charts-grid">
        <div>
          <strong>1RM Trend</strong>
          <EnhancedLineChart 
            data={[...(data.one_rm_history || [])].reverse() as any[]} 
            xKey="date" 
            yKey="one_rm" 
            color="#5b2aa6" 
            yUnit="kg" 
            area 
          />
        </div>
        <div>
          <strong>Intensity</strong>
          <EnhancedLineChart 
            data={[...(data.weight_trend || [])].reverse() as any[]} 
            xKey="date" 
            yKey="max_weight" 
            color="#138f86" 
            yUnit="kg" 
            area 
          />
        </div>
        <div>
          <strong>Volume</strong>
          <EnhancedLineChart 
            data={[...(data.volume_trend || [])].reverse() as any[]} 
            xKey="date" 
            yKey="volume" 
            color="#1976d2" 
            yUnit="kg·reps" 
            area 
          />
        </div>
      </div>
    </div>
  );
}
