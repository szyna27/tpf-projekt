import {
  EmailAuthProvider,
  applyActionCode,
  confirmPasswordReset as firebaseConfirmPasswordReset,
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
  type User,
} from 'firebase/auth';
import { firebaseAuth, googleProvider } from '../firebase';

export type AppUser = {
  id: string;
  email: string;
  name?: string;
  has_password: boolean;
};

function mapFirebaseUser(user: User | null): AppUser | null {
  if (!user || !user.email) return null;

  return {
    id: user.uid,
    email: user.email,
    name: user.displayName ?? undefined,
    has_password: user.providerData.some((provider) => provider.providerId === 'password'),
  };
}

function getFirebaseMessage(error: unknown, fallback: string) {
  if (!(error instanceof Error)) return fallback;

  const code = 'code' in error ? String((error as { code?: unknown }).code) : '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password.';
    case 'auth/popup-closed-by-user':
      return 'Google login was cancelled.';
    case 'auth/requires-recent-login':
      return 'Please log in again before changing your password.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    default:
      return error.message || fallback;
  }
}

function createFirebaseError(error: unknown, fallback: string) {
  const wrappedError = new Error(getFirebaseMessage(error, fallback)) as Error & { cause?: unknown };
  wrappedError.cause = error;
  return wrappedError;
}

export async function whoami() {
  return mapFirebaseUser(firebaseAuth.currentUser);
}

export async function emailLogin(email: string, password: string) {
  try {
    const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    return mapFirebaseUser(credential.user);
  } catch (error) {
    throw createFirebaseError(error, 'Login failed.');
  }
}

export async function googleLogin() {
  try {
    const credential = await signInWithPopup(firebaseAuth, googleProvider);
    return mapFirebaseUser(credential.user);
  } catch (error) {
    throw createFirebaseError(error, 'Google login failed.');
  }
}

export async function emailLogout() {
  await signOut(firebaseAuth);
  return {};
}

export async function registerAccount(email: string, password: string, password2: string) {
  if (password !== password2) {
    throw new Error('Passwords do not match.');
  }

  try {
    const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    await sendEmailVerification(credential.user);

    return {
      success: true,
      message: 'Registration successful. Check your email.',
      user: mapFirebaseUser(credential.user),
    };
  } catch (error) {
    throw createFirebaseError(error, 'Registration error.');
  }
}

export async function resendActivation(email?: string) {
  void email;

  const user = firebaseAuth.currentUser;
  if (!user) {
    throw new Error('Log in first to resend the verification email.');
  }

  await sendEmailVerification(user);
  return { success: true, message: 'Activation link sent.' };
}

export async function setPassword(payload: {
  current_password?: string;
  new_password?: string;
  new_password2?: string;
}) {
  const user = firebaseAuth.currentUser;
  if (!user?.email) {
    throw new Error('You must be logged in.');
  }

  const newPassword = payload.new_password ?? '';
  if (newPassword !== payload.new_password2) {
    throw new Error('Passwords do not match.');
  }

  const hasPassword = user.providerData.some((provider) => provider.providerId === 'password');

  if (!hasPassword) {
    await sendPasswordResetEmail(firebaseAuth, user.email);
    return {
      action_required: 'email_sent',
      message: 'Password setup link sent to your email.',
    };
  }

  if (!payload.current_password) {
    throw new Error('Current password is required.');
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, payload.current_password);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    return { success: true };
  } catch (error) {
    throw createFirebaseError(error, 'Error setting password.');
  }
}

export async function verifyPasswordReset(_uid: string, token: string) {
  return Boolean(token);
}

export async function confirmPasswordReset(_uid: string, token: string, new1: string, new2: string) {
  if (new1 !== new2) {
    throw new Error('Passwords do not match.');
  }

  try {
    await firebaseConfirmPasswordReset(firebaseAuth, token, new1);
    return true;
  } catch (error) {
    throw createFirebaseError(error, 'Cannot reset password.');
  }
}

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(firebaseAuth, email);
    return true;
  } catch (error) {
    throw createFirebaseError(error, 'Cannot send password reset email.');
  }
}

export async function activateAccount(token: string) {
  try {
    await applyActionCode(firebaseAuth, token);
    return { success: true, message: 'Account activated.' };
  } catch (error) {
    throw createFirebaseError(error, 'Cannot activate account.');
  }
}

export async function googleLoginUrl() {
  return '/login';
}
