import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { useActivation } from './hooks/useActivation';
import '../Auth.css';

export function ActivationResult() {
  const { msg } = useActivation();

  return (
    <AuthLayout>
      <div className="card auth-text-center">
        <h2 className="auth-title">Account Activation</h2>
        <p className="note">{msg}</p>
        <div className="auth-mt-24">
          <Link className="auth-link" to="/login">Go to login</Link>
        </div>
      </div>
    </AuthLayout>
  );
}

export default ActivationResult;