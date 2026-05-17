import { Link } from 'react-router-dom';
import AuthHeader from '../components/AuthHeader';
import { AuthLayout } from '../components/AuthLayout';
import { GoogleLoginButton } from '../components/GoogleLoginButton';
import { useLogin } from './hooks/useLogin';
import { EmailLoginForm } from './components/EmailLoginForm';
import '../Auth.css';

export function Login() {
  const { email, setEmail, password, setPassword, submitting, error, onSubmit } = useLogin();

  return (
    <div className="auth-grid">
      <AuthHeader />
      <AuthLayout>
        <div className="card">
          <h1 className="auth-title">Welcome to TrainMate</h1>
          <p className="note auth-note">Log in to manage your plans and track your progress.</p>
          <EmailLoginForm 
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            submitting={submitting}
            error={error}
            onSubmit={onSubmit}
          />
          <div className="auth-divider">or</div>
          <GoogleLoginButton />
          <div className="auth-links">
            <Link to="/register" className="auth-link">Register</Link>
            <Link to="/password-reset" className="auth-link auth-link-muted">Forgot password?</Link>
          </div>
        </div>
      </AuthLayout>
    </div>
  );
}

export default Login;