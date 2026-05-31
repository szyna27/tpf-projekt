import { useParams, Link } from 'react-router-dom';
import { useExerciseStats } from './hooks/useExerciseStats';
import ExerciseInfoCard from './components/ExerciseInfoCard';
import ExerciseCharts from './components/ExerciseCharts';
import './ExerciseDetail.css';

export default function ExerciseDetail() {
  const params = useParams();
  const exerciseName = decodeURIComponent(params.name || '');
  const { data, loading, error, imageUrl, muscleLabels } = useExerciseStats(exerciseName);

  return (
    <div>
      <div className="ed-back-link">
        <Link to="/stats" className="btn ed-back-btn">← Back to stats</Link>
      </div>
      
      {loading && <p>Loading...</p>}
      {error && <p className="ed-error">{error}</p>}
      
      {data && (
        <div className="two-col ed-container">
          <div className="left-col">
            <ExerciseInfoCard 
              exerciseName={exerciseName} 
              data={data} 
              imageUrl={imageUrl} 
              muscleLabels={muscleLabels} 
            />
          </div>
          <div className="right-col">
            <ExerciseCharts data={data} />
          </div>
        </div>
      )}
    </div>
  );
}
