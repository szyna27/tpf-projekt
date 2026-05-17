import GoogleLogo from '../../../assets/google.png';
import { useAuth } from '../../../context/AuthContext';
import '../Auth.css';

interface Props {
  redirect?: string;
}

export function GoogleLoginButton({ redirect = '/stats' }: Props) {
  const { loginWithGoogle } = useAuth();
  
  return (
    <button className="btn google" onClick={() => loginWithGoogle(redirect)}>
      <img src={GoogleLogo} alt="Google" className="auth-google-logo" />
      Log in with Google
    </button>
  );
}