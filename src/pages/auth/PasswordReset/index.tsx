import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { usePasswordReset } from './hooks/usePasswordReset';
import '../Auth.css';

export function PasswordReset() {
  const { email, setEmail, message, error, handleSubmit } = usePasswordReset();

  return (
    <div className="auth-grid">
      <AuthLayout>
        <div className="card">
          <h2 className="auth-title">Password Reset</h2>
          <p className="note auth-note">Enter your email address. If it is in our database, we will send a link to set a new password.</p>
          <form onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@example.com"
              />
            </div>
            <button className="btn primary auth-btn-full auth-mt-12" type="submit">Send Link</button>
          </form>
          {message && <p className="note auth-success">{message}</p>}
          {error && <p className="note auth-error">{error}</p>}
          <div className="auth-text-center auth-mt-24">
            <Link to="/login" className="auth-link">Back to login</Link>
          </div>
        </div>
      </AuthLayout>
    </div>
  );
}

export default PasswordReset;