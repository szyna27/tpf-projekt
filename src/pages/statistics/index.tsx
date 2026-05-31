import { useStatisticsData } from './hooks/useStatisticsData';
import ExerciseSearch from './components/ExerciseSearch';
import TopExercises from './components/TopExercises';
import StatsSummary from './components/StatsSummary';
import AiRecommendations from './components/AiRecommendations';
import './Statistics.css';

export default function Statistics() {
  const {
    days,
    setDays,
    summary,
    loading,
    error,
    top5,
    top5Loading,
    exerciseImages,
    perMuscleReps,
    aiRec,
    aiLoading,
    aiError
  } = useStatisticsData();

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="two-col statistics-layout">
        <div className="left-col statistics-left-col">
          <ExerciseSearch />
          <TopExercises 
            top5={top5} 
            top5Loading={top5Loading} 
            exerciseImages={exerciseImages} 
          />
        </div>

        <div className="statistics-mid-col">
          <StatsSummary 
            days={days} 
            setDays={setDays} 
            summary={summary} 
            perMuscleReps={perMuscleReps} 
          />
        </div>

        <div className="statistics-right-col">
          <AiRecommendations 
            aiRec={aiRec} 
            aiLoading={aiLoading} 
            aiError={aiError} 
          />
        </div>
      </div>
    </div>
  );
}
