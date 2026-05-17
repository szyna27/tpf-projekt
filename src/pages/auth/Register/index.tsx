import { Link } from 'react-router-dom';
import AuthHeader from '../components/AuthHeader';
import { AuthLayout } from '../components/AuthLayout';
import { useRegister } from './hooks/useRegister';
import '../Auth.css';

export function Register() {
  const { email, setEmail, pw1, setPw1, pw2, setPw2, msg, onSubmit, onResend } = useRegister();

  return (
    <div className="auth-grid">
      <AuthHeader />
      <AuthLayout>
        <form className="card" onSubmit={onSubmit}>
          <h2 className="auth-title">Create Account</h2>
          <p className="note auth-note">Access training plans and progress history.</p>
          
          <div className="auth-form-group">
            <label htmlFor="reg-email">Email</label>
            <input 
              id="reg-email"
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              placeholder="email@example.com"
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="reg-pw1">Password</label>
            <input 
              id="reg-pw1"
              type="password" 
              value={pw1} 
              onChange={e => setPw1(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="reg-pw2">Repeat Password</label>
            <input 
              id="reg-pw2"
              type="password" 
              value={pw2} 
              onChange={e => setPw2(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>

          <div className="auth-actions">
            <button className="btn purple auth-btn-full" type="submit">Register</button>
          </div>
          
          {msg && <p className="note auth-success">{msg}</p>}

          <div className="auth-footer">
            <p>
              Already have an account? <Link className="auth-link" to="/login">Log in</Link>
            </p>
            <button 
              type="button" 
              className="auth-link auth-link-muted auth-mt-12" 
              onClick={onResend} 
              disabled={!email}
            >
              Didn't get the email? Resend link
            </button>
          </div>
        </form>
      </AuthLayout>
    </div>
  );
}

export default Register;