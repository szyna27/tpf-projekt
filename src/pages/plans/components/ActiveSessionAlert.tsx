import React from 'react';
import { getActiveSessions } from '../../../services/api';
import '../Plans.css';

interface ActiveSessionAlertProps {
  errorMsg: string;
  setSession: (session: any) => void;
  setModalOpen: (open: boolean) => void;
  setErrorMsg: (msg: string | null) => void;
}

export const ActiveSessionAlert: React.FC<ActiveSessionAlertProps> = ({
  errorMsg,
  setSession,
  setModalOpen,
  setErrorMsg,
}) => {
  const handleContinue = async () => {
    try {
      const active = await getActiveSessions();
      if (Array.isArray(active) && active.length > 0) {
        setSession(active[0]);
        setModalOpen(true);
        setErrorMsg(null);
      }
    } catch {}
  };

  return (
    <div role="alert" className="active-session-alert">
      <span className="alert-icon">⚠️</span>
      <span className="alert-message">{errorMsg}</span>
      <button className="btn" onClick={handleContinue}>
        Continue now
      </button>
      <button className="btn close-btn" onClick={() => setErrorMsg(null)}>
        ✕
      </button>
    </div>
  );
};
