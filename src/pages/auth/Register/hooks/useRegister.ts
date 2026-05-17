import { useState, FormEvent } from 'react';
import { registerAccount, resendActivation } from '../../../../services/api';

export function useRegister() {
  const [email, setEmail] = useState('');
  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMsg(null);
    try {
      const data = await registerAccount(email, pw1, pw2);
      setMsg(data.message || 'Registration successful. Check your email.');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMsg(err.message);
      } else {
        setMsg('Registration error');
      }
    }
  }

  async function onResend() {
    setMsg(null);
    try {
      const data = await resendActivation(email);
      setMsg((data as any).message || 'Activation link sent.');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMsg(err.message);
      } else {
        setMsg('Error sending activation link');
      }
    }
  }

  return { email, setEmail, pw1, setPw1, pw2, setPw2, msg, onSubmit, onResend };
}