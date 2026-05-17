import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { usePasswordResetConfirm } from './hooks/usePasswordResetConfirm';
import '../Auth.css';

export function PasswordResetConfirm() {
  const { p1, setP1, p2, setP2, msg, ok, onSubmit } = usePasswordResetConfirm();

  return (
    <AuthLayout width="narrow">
      <div className="card">
        <h1 className="auth-title">Set New Password</h1>
        <p className="note auth-note">Please enter and repeat your new password.</p>
        <form onSubmit={onSubmit}>
          <div className="auth-form-group">
            <label htmlFor="reset-p1">New Password</label>
            <input 
              id="reset-p1"
              type="password" 
              value={p1} 
              onChange={(e) => setP1(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="reset-p2">Repeat Password</label>
            <input 
              id="reset-p2"
              type="password" 
              value={p2} 
              onChange={(e) => setP2(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>
          {msg && <p className={ok ? 'text-green' : 'text-crimson'}>{msg}</p>}
          <button type="submit" className="btn primary auth-btn-full auth-mt-12">Save</button>
        </form>
        <div className="auth-text-center auth-mt-24">
          <Link to="/login" className="auth-link">Back to login</Link>
        </div>
      </div>
    </AuthLayout>
  );
}

export default PasswordResetConfirm;