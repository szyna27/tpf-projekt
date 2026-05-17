import { useState, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { confirmPasswordReset } from '../../../../services/api';

export function usePasswordResetConfirm() {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (p1.length < 8) {
      setMsg('Password must be at least 8 characters.');
      return;
    }
    if (p1 !== p2) {
      setMsg('Passwords do not match.');
      return;
    }
    try {
      await confirmPasswordReset(uid || '', token || '', p1, p2);
      setOk(true);
      setMsg('Password has been changed. You can now log in.');
      setTimeout(() => navigate('/login', { replace: true }), 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMsg(err.message);
      } else {
        setMsg('Error changing password.');
      }
    }
  }

  return { p1, setP1, p2, setP2, msg, ok, onSubmit };
}