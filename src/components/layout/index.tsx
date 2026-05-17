import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoSrc from '../../assets/logo.png';
import '../../App.css';
import './Layout.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          {!loading && user && (
            <div className="header-top-row">
              <div className="header-top-left">
                <span className="wave" aria-hidden="true">👋</span>
                <div className="header-top-text">
                  <div className="header-user-info">
                    <span className="header-top-greeting">Hello, </span>
                    <span className="header-top-email">{user.email}</span>
                  </div>
                  <div className="header-buttons-row">
                    <button 
                      className="btn outline header-action-btn" 
                      onClick={() => navigate('/password')}
                    >
                      Profile
                    </button>
                    <button 
                      className="btn delete header-action-btn" 
                      onClick={() => logout('/')}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
              <div className="header-logo">
                <div className="header-logo-inner">
                  <img src={logoSrc} alt="TrainMate" />
                </div>
              </div>
              <div className="header-top-right">
                  <span className="note">No active Workout</span>
              </div>
            </div>
          )}
          <nav className="nav nav-main">
            {!loading && user && (
              <>
                <NavLink to="/stats" className={({ isActive }) => (isActive ? 'active' : undefined)}>Stats</NavLink>
                <NavLink to="/plans" className={({ isActive }) => (isActive ? 'active' : undefined)}>Plans</NavLink>
                <NavLink to="/history" className={({ isActive }) => (isActive ? 'active' : undefined)}>History</NavLink>
                <NavLink to="/exercises" className={({ isActive }) => (isActive ? 'active' : undefined)}>Exercises</NavLink>
              </>
            )}
            {!loading && !user && (
              <>
                <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : undefined)}>Login</NavLink>
                <NavLink to="/register" className={({ isActive }) => (isActive ? 'active' : undefined)}>Register</NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="container">{children}</main>
      <footer className="footer">© {new Date().getFullYear()} TrainMate</footer>
    </div>
  );
}