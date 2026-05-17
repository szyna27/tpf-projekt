import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export function useActivation() {
  const { search } = useLocation();
  const { uid, token } = useParams<{ uid?: string; token?: string }>();
  const navigate = useNavigate();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const status = params.get('status'); 
  const [msg, setMsg] = useState('Processing...');

  useEffect(() => {
    if (status) {
      if (status === 'ok') setMsg('Account has been activated. You can log in now.');
      else if (status === 'already') setMsg('This account is already active. You can log in.');
      else setMsg('The activation link is invalid or has expired.');
      return;
    }

    (async () => {
      if (!uid || !token) return;
      try {
        setMsg('Account has been activated. You can log in now.');
      } catch {
        setMsg('An error occurred during activation.');
      }
    })();
  }, [status, uid, token]);

  useEffect(() => {
    const t = setTimeout(() => navigate('/login', { replace: true }), 2500);
    return () => clearTimeout(t);
  }, [navigate]);

  return { msg };
}