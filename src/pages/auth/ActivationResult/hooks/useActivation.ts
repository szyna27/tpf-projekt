import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { activateAccount } from '../../../../services/api';

function getStatusMessage(status: string | null) {
  if (status === 'ok') return 'Account has been activated. You can log in now.';
  if (status === 'already') return 'This account is already active. You can log in.';
  if (status) return 'The activation link is invalid or has expired.';
  return 'Processing...';
}

export function useActivation() {
  const { search } = useLocation();
  const { uid, token } = useParams<{ uid?: string; token?: string }>();
  const navigate = useNavigate();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const status = params.get('status'); 
  const oobCode = params.get('oobCode');
  const [msg, setMsg] = useState(() => getStatusMessage(status));

  useEffect(() => {
    if (status) {
      return;
    }

    (async () => {
      const activationToken = oobCode || token;
      if (!activationToken) return;
      try {
        await activateAccount(activationToken);
        setMsg('Account has been activated. You can log in now.');
      } catch (err) {
        setMsg(err instanceof Error ? err.message : 'An error occurred during activation.');
      }
    })();
  }, [status, uid, token, oobCode]);

  useEffect(() => {
    const t = setTimeout(() => navigate('/login', { replace: true }), 2500);
    return () => clearTimeout(t);
  }, [navigate]);

  return { msg };
}
