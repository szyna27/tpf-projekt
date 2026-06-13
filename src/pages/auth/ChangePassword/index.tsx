import { useAuth } from '../../../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { useChangePassword } from './hooks/useChangePassword';
import '../Auth.css';

export function ChangePassword() {
  const { user } = useAuth();
  const { cp, setCp, np1, setNp1, np2, setNp2, msg, loading, onSave, sendSetupLink } = useChangePassword();

  if (user && !user.has_password) {
    return (
      <div className="auth-grid">
        <AuthLayout width="wide">
          <div className="card">
            <h2 className="auth-title">Set Password</h2>
            <p>You currently log in via Google and do not have a password set.</p>
            <p>To set a password for traditional login, we need to verify your email address.</p>
            
            <button className="btn primary" onClick={sendSetupLink} disabled={loading}>
              {loading ? 'Sending...' : 'Send Setup Link to Email'}
            </button>
            
            {msg && <p className="note auth-success">{msg}</p>}
          </div>
        </AuthLayout>
      </div>
    );
  }

  return (
    <div className="auth-grid">
      <AuthLayout width="wide">
        <form className="card" onSubmit={onSave}>
          <h2 className="auth-title">Change Password</h2>
          <div className="auth-form-group">
            <label htmlFor="current-pw">Current Password</label>
            <input 
              id="current-pw"
              type="password" 
              value={cp} 
              onChange={e => setCp(e.target.value)} 
              placeholder="••••••••"
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="new-pw1">New Password</label>
            <input 
              id="new-pw1"
              type="password" 
              value={np1} 
              onChange={e => setNp1(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="new-pw2">Repeat New Password</label>
            <input 
              id="new-pw2"
              type="password" 
              value={np2} 
              onChange={e => setNp2(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>
          <button className="btn primary auth-btn-full auth-mt-12" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          {msg && <p className="note auth-success">{msg}</p>}
        </form>
      </AuthLayout>
    </div>
  );
}

export default ChangePassword;
