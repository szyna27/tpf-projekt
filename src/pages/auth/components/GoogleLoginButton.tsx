import { useState } from 'react';
import GoogleLogo from '../../../assets/google.png';
import { useAuth } from '../../../context/AuthContext';
import '../Auth.css';

interface Props {
  redirect?: string;
}

export function GoogleLoginButton({ redirect = '/plans' }: Props) {
  const { loginWithGoogle } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setSubmitting(true);
    setError(null);

    try {
      await loginWithGoogle(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google login failed.');
    } finally {
      setSubmitting(false);
    }
  }
  
  return (
    <>
      <button className="btn google" onClick={handleLogin} disabled={submitting}>
        <img src={GoogleLogo} alt="Google" className="auth-google-logo" />
        {submitting ? 'Logging in...' : 'Log in with Google'}
      </button>
      {error && <div className="note auth-error auth-mt-12">{error}</div>}
    </>
  );
}
