import React from 'react';
import '../ActiveSession.css';

export interface FinishConfirmModalProps {
  defaultMinutes: number;
  defaultSeconds: number;
  minutes: string;
  seconds: string;
  testDate?: string;
  onTestDateChange?: (v: string) => void;
  onMinutesChange: (v: string) => void;
  onSecondsChange: (v: string) => void;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
}

export function FinishConfirmModal({
  defaultMinutes,
  defaultSeconds,
  minutes,
  seconds,
  testDate,
  onTestDateChange,
  onMinutesChange,
  onSecondsChange,
  onCancel,
  onConfirm
}: FinishConfirmModalProps) {
  return (
    <div className="modal-overlay session-modal-overlay">
      <div className="card modal-content finish-confirm-modal">
        <h3 className="modal-title">Finish session?</h3>
        <p className="note">You can adjust the duration before saving to history.</p>
        
        <div className="row items-center time-input-row">
          <label className="time-label">Time [mm:ss]</label>
          <input 
            className="time-input" 
            type="number" 
            min={0} 
            value={minutes} 
            onChange={(e) => onMinutesChange(e.target.value)} 
            placeholder={String(defaultMinutes)} 
          />
          <span>:</span>
          <input 
            className="time-input" 
            type="number" 
            min={0} 
            max={59} 
            value={seconds} 
            onChange={(e) => onSecondsChange(e.target.value)} 
            placeholder={String(defaultSeconds).padStart(2, '0')} 
          />
        </div>
        
        {import.meta.env.DEV && (
          <div className="row items-center dev-date-row">
            <label className="dev-date-label">Session date (DEV)</label>
            <input
              type="date"
              value={testDate || ''}
              onChange={(e) => onTestDateChange && onTestDateChange(e.target.value)}
            />
            <span className="note dev-date-note">
              DEV only - allows quickly setting the session to a specific day (affects charts).
            </span>
          </div>
        )}
        
        <div className="row justify-end modal-actions mt-3">
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button className="btn primary" onClick={onConfirm}>Save and finish</button>
        </div>
      </div>
    </div>
  );
}