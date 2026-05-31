import { useNavigate } from 'react-router-dom';
import { useExerciseSearch } from '../hooks/useExerciseSearch';

export default function ExerciseSearch() {
  const navigate = useNavigate();
  const { exerciseQuery, setExerciseQuery, catalog, catalogLoading } = useExerciseSearch();

  return (
    <div className="card exercise-search-card">
      <h3>Search exercise</h3>
      <input
        type="text"
        placeholder="Search exercise..."
        value={exerciseQuery}
        onChange={e => setExerciseQuery(e.target.value)}
        className="search-input"
      />
      {catalogLoading && <p>Loading catalog...</p>}
      {catalog && catalog.length > 0 && (
        <ul className="catalog-dropdown">
          {catalog.slice(0, 50).map(item => (
            <li 
              key={`${item.kind}-${item.id}`} 
              className="catalog-item" 
              onClick={() => navigate(`/stats/${encodeURIComponent(item.name)}`)}
            >
              {item.name} <small className="catalog-item-kind">({item.kind})</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
