import { ReactNode } from 'react';
import '../Auth.css';

interface AuthLayoutProps {
  children: ReactNode;
  width?: 'narrow' | 'default' | 'wide';
}

export function AuthLayout({ children, width = 'default' }: AuthLayoutProps) {
  let containerClass = 'auth-container';
  if (width === 'narrow') containerClass = 'auth-container-narrow';
  else if (width === 'wide') containerClass = 'auth-container-wide';

  return (
    <div className={containerClass}>
      {children}
    </div>
  );
}