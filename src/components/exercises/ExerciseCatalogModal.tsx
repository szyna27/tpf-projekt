import './exerciseModal.css';
import CustomExerciseModal from './CustomExerciseModal';
import { useExerciseCatalog } from './hooks/useExerciseCatalog';
import type { CatalogItem, ExerciseConfig } from './types';

export interface ExerciseCatalogModalProps {
  catalog: CatalogItem[];
  onClose: () => void;
  onAddCustom: (item: { id: number; name: string }) => void;
  onSelect: (item: CatalogItem, config?: ExerciseConfig) => void;
}

export { type CatalogItem, type ExerciseConfig } from './types';

export default function ExerciseCatalogModal({ catalog, onClose, onAddCustom, onSelect }: ExerciseCatalogModalProps) {
  const {
    query,
    setQuery,
    filtered,
    loading,
    error,
    customModal,
    setCustomModal
  } = useExerciseCatalog({ catalog });

  return (
    <>
      <div className="exercise-modal-overlay">
        <div className="card exercise-modal-panel exercise-modal-panel--catalog">
          <div className="exercise-modal-header">
            <h3 className="exercise-modal-title">Exercise Catalog</h3>
            <button className="btn cancel exercise-modal-close" onClick={onClose}>✕</button>
          </div>
          <div className="exercise-catalog-search-row">
            <input
              className="exercise-catalog-search-input"
              placeholder="Search..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button className="btn" onClick={() => setCustomModal(true)}>+ Create Exercise</button>
          </div>
          <div className="exercise-catalog-list">
            {loading && <p className="note exercise-modal-status">Searching...</p>}
            {error && <p className="exercise-modal-error">{error}</p>}
            {filtered.map(item => (
              <button
                key={`${item.kind}-${item.id}`}
                className="btn cancel exercise-catalog-item"
                onClick={() => onSelect(item)}
              >
                <span className="exercise-catalog-thumb">
                  {item.image_url ? (
                    <img src={item.image_url} alt="" className="exercise-catalog-thumb-image" />
                  ) : (
                    <span className="exercise-catalog-thumb-empty">none</span>
                  )}
                </span>
                <div className="exercise-catalog-details">
                  <div className="exercise-catalog-name">
                    {item.name}
                    {item.kind === 'custom' && <span className="exercise-catalog-name--custom"> (yours)</span>}
                  </div>
                  {item.target_muscles && item.target_muscles.length > 0 && (
                    <div className="exercise-catalog-muscles">{item.target_muscles.join(', ')}</div>
                  )}
                </div>
                <span className="exercise-catalog-kind">{item.kind === 'base' ? 'catalog' : 'custom'}</span>
              </button>
            ))}
            {!loading && filtered.length === 0 && <p className="note exercise-modal-status">No results</p>}
          </div>
        </div>
      </div>
      {customModal && (
        <CustomExerciseModal
          onClose={() => setCustomModal(false)}
          onCreated={item => {
            onAddCustom({ id: item.id, name: item.name });
            setCustomModal(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
