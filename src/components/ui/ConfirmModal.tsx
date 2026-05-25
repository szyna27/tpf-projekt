import React from 'react';

export interface ConfirmModalProps {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
  confirmLabel?: string;
}

export function ConfirmModal({ title, message, onCancel, onConfirm, confirmLabel = 'Confirm' }: ConfirmModalProps) {
  return (
    <div className="modal-overlay" style={{ zIndex: 1200 }}>
      <div className="card modal-content confirm-modal-content">
        <h3 className="modal-title">{title}</h3>
        <p className="note">{message}</p>
        <div className="row justify-end modal-actions">
          <button className="btn" onClick={onCancel}>No</button>
          <button className="btn primary" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
