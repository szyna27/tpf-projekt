import { UserExercise } from '../types';

interface ExerciseCardProps {
  item: UserExercise;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ExerciseCard({ item, onEdit, onDelete }: ExerciseCardProps) {
  const equipments: string[] = Array.isArray(item.metadata?.equipments) 
    ? item.metadata.equipments 
    : (item.equipment ? [item.equipment] : []);
    
  const muscles: string[] = Array.isArray(item.metadata?.target_muscles) 
    ? item.metadata.target_muscles 
    : (item.target_muscles || (item.body_part ? [item.body_part] : []));
    
  const imageUrl: string | undefined = item.image_url || item.metadata?.image_url;

  return (
    <div className="card plan-card">
      <div className="plan-card-header-wrapper">
        <div className="plan-card-header-left" style={{ gap: '16px' }}>
          {imageUrl ? (
            <div className="ue-image-container" style={{ width: '64px', height: '64px' }}>
              <img src={imageUrl} alt={item.name} className="ue-image" />
            </div>
          ) : (
            <div className="ue-image-placeholder" style={{ width: '64px', height: '64px' }}>Brak</div>
          )}
          <div>
            <h3 className="plan-card-title">{item.name}</h3>
          </div>
        </div>
        <div className="plan-card-header-right">
          <button className="btn outline" onClick={onEdit}>Edit</button>
          <button className="btn delete" onClick={onDelete}>Delete</button>
        </div>
      </div>
      
      <div className="plan-badges-row" style={{ marginTop: '16px' }}>
        <span className="plan-badge">
          Equipment: <strong>{equipments.length > 0 ? equipments.join(', ') : 'None'}</strong>
        </span>
        <span className="plan-badge">
          Muscle: <strong className="ue-tag-muscle">{muscles.length > 0 ? muscles.join(', ') : 'None'}</strong>
        </span>
      </div>
    </div>
  );
}