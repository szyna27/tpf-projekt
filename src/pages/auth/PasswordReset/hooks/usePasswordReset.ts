import { useState, FormEvent } from 'react';
import { resetPassword } from '../../../../services/api';

export function usePasswordReset() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await resetPassword(email);
      setMessage('If an account with this email exists, we have sent instructions to reset the password.');
    } catch (err: unknown) {
      if (err instanceof Error) {
         setError(err.message || 'Cannot connect to the server.');
      } else {
         setError('Cannot connect to the server.');
      }
    }
  };

  return { email, setEmail, message, error, handleSubmit };
}