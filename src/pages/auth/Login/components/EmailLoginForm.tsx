import type { FormEvent } from 'react';

interface Props {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  submitting: boolean;
  error: string | null;
  onSubmit: (e: FormEvent) => void;
}

export function EmailLoginForm({
  email,
  setEmail,
  password,
  setPassword,
  submitting,
  error,
  onSubmit
}: Props) {
  return (
    <form onSubmit={onSubmit}>
      <div className="auth-form-group">
        <label htmlFor="login-email">E‑mail</label>
        <input
          id="login-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
        />
      </div>
      <div className="auth-form-group">
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>
      {error && <div className="note auth-error">{error}</div>}
      <button className="btn teal auth-btn-full auth-mt-12" type="submit" disabled={submitting}>
        {submitting ? 'Logging in…' : 'Log in'}
      </button>
    </form>
  );
}
