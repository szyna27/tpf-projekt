import './exerciseModal.css';
import { useCustomExerciseForm } from './hooks/useCustomExerciseForm';
import type { CreatedExercise } from './types';

export interface CustomExerciseModalProps {
  onClose: () => void;
  onCreated: (item: CreatedExercise) => void;
}

export default function CustomExerciseModal({ onClose, onCreated }: CustomExerciseModalProps) {
  const {
    loading,
    attrs,
    name,
    setName,
    equipment,
    setEquipment,
    primary,
    setPrimary,
    saving,
    error,
    imageFile,
    imageUploading,
    imageUrl,
    fileInputRef,
    handleImageSelect,
    save,
    clearImage
  } = useCustomExerciseForm({ onClose, onCreated });

  return (
    <div className="exercise-modal-overlay">
      <div className="card exercise-modal-panel">
        <div className="exercise-modal-header">
          <h3 className="exercise-modal-title">Create Own Exercise</h3>
          <button className="exercise-modal-close-ghost" onClick={onClose}>✕</button>
        </div>
        {loading && <p className="note exercise-modal-status">Loading attributes…</p>}
        {error && <p className="exercise-modal-error">{error}</p>}
        {!loading && !error && (
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
                      {attrs.equipments.map(eq => <option key={eq} value={eq}>{eq}</option>)}
                    </select>
                  </div>
                  <div className="exercise-modal-field">
                    <label>Primary Muscle</label>
                    <select className="exercise-modal-input-full" value={primary} onChange={e => setPrimary(e.target.value)}>
                      <option value="">—</option>
                      {attrs.target_muscles.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="exercise-modal-footer">
          <div className="exercise-modal-footer-left">
            {/* Destructive actions like Delete would go here */}
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
