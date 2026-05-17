import { useState, FormEvent } from 'react';
import { setPassword } from '../../../../services/api';

export function useChangePassword() {
  const [cp, setCp] = useState('');
  const [np1, setNp1] = useState('');
  const [np2, setNp2] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const res = await setPassword({ current_password: cp || undefined, new_password: np1, new_password2: np2 });
      if (res.action_required === 'email_sent') {
        setMsg(res.message);
      } else {
        setMsg('Password changed successfully.');
      }
      setCp(''); setNp1(''); setNp2('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMsg(err.message);
      } else {
        setMsg('Error setting password');
      }
    } finally {
      setLoading(false);
    }
  }

  async function sendSetupLink() {
    setMsg(null);
    setLoading(true);
    try {
      const res = await setPassword({ new_password: 'dummy', new_password2: 'dummy' }); 
      if (res.action_required === 'email_sent') {
        setMsg(res.message);
      } else {
        setMsg('Unexpected response. Please try again.');
      }
    } catch (err: unknown) {
       if (err instanceof Error) {
        setMsg(err.message);
      } else {
        setMsg('Error sending link');
      }
    } finally {
      setLoading(false);
    }
  }

  return { cp, setCp, np1, setNp1, np2, setNp2, msg, loading, onSave, sendSetupLink };
}