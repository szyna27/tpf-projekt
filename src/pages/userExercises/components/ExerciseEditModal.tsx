import '../../../components/exercises/exerciseModal.css';
import type { ExerciseAttributes, UserExercise } from '../types';
import { useExerciseEdit } from '../hooks/useExerciseEdit';

export interface ExerciseEditModalProps {
  exercise: UserExercise;
  attributes: ExerciseAttributes;
  onClose: () => void;
  onUpdated: (item: UserExercise) => void;
  onDeleted: () => void;
}

export default function ExerciseEditModal({ exercise, attributes, onClose, onUpdated, onDeleted }: ExerciseEditModalProps) {
  const {
    name,
    setName,
    equipment,
    setEquipment,
    primary,
    setPrimary,
    saving,
    error,
    imageUploading,
    imageUrl,
    imageFile,
    fileInputRef,
    handleImageSelect,
    save,
    remove,
    clearImage
  } = useExerciseEdit({ exercise, onUpdated, onDeleted });

  return (
    <div className="exercise-modal-overlay">
      <div className="card exercise-modal-panel">
        <div className="exercise-modal-header">
          <h3 className="exercise-modal-title">Edit Exercise</h3>
          <button className="exercise-modal-close-ghost" onClick={onClose}>✕</button>
        </div>
        {error && <p className="exercise-modal-error">{error}</p>}
        <div className="exercise-modal-content-area">
          <div className="exercise-modal-grid">
            <div className="exercise-modal-preview-column">
              <div className="exercise-modal-preview-frame">
                {imageUrl ? (
                  <img src={imageUrl} alt="Preview" className="exercise-modal-preview-image" />
                ) : (
                  <span className="exercise-modal-preview-placeholder">No image</span>
                )}
              </div>
              <div className="exercise-modal-upload">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="exercise-modal-file-input"
                  disabled={imageUploading}
                  onChange={e => handleImageSelect(e.target.files?.[0] || null)}
                />
                <div className="exercise-modal-upload-actions">
                  <div className="exercise-modal-upload-buttons">
                    <button type="button" className="btn outline btn-sm" onClick={() => fileInputRef.current?.click()} disabled={imageUploading}>
                      {imageFile ? 'Change image' : 'Choose image'}
                    </button>
                    {(imageFile || imageUrl) && (
                      <button type="button" className="btn cancel btn-sm exercise-modal-remove" onClick={clearImage} disabled={imageUploading}>
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="exercise-modal-file-name">{imageFile ? imageFile.name : (imageUrl ? 'Image selected' : 'No file selected')}</div>
                </div>
                {imageUploading && <p className="note exercise-modal-inline-note">Uploading image…</p>}
              </div>
            </div>
            <div className="exercise-modal-form">
              <div className="exercise-modal-field">
                <label>Name *</label>
                <input className="exercise-modal-input-full" value={name} onChange={e => setName(e.target.value)} placeholder="E.g. Bulgarian Split Squat" />
              </div>
              <div className="exercise-modal-field-row">
                <div className="exercise-modal-field">
                  <label>Equipment</label>
                  <select className="exercise-modal-input-full" value={equipment} onChange={e => setEquipment(e.target.value)}>
                    <option value="">—</option>
                    {attributes.equipments.map(eq => <option key={eq} value={eq}>{eq}</option>)}
                  </select>
                </div>
                <div className="exercise-modal-field">
                  <label>Primary Muscle</label>
                  <select className="exercise-modal-input-full" value={primary} onChange={e => setPrimary(e.target.value)}>
                    <option value="">—</option>
                    {attributes.target_muscles.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="exercise-modal-footer">
          <div className="exercise-modal-footer-left">
            <button className="btn delete" onClick={remove} disabled={saving}>Delete Exercise</button>
          </div>
          <div className="exercise-modal-footer-right">
            <button className="btn cancel" onClick={onClose}>Cancel</button>
            <button className="btn primary" disabled={!name.trim() || saving || imageUploading} onClick={save}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
