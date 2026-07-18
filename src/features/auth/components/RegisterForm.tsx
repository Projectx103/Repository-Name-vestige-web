import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { ROUTES } from '@/constants/routes';
import { getAuthErrorMessage } from '../lib/authErrors';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type RegisterFormValues = z.infer<typeof registerSchema>;

/**
 * 07 - User Flows.md §6. No registration path ever results in anything
 * other than the buyer role — this form never touches roles/claims at all;
 * that's entirely the onUserCreate Cloud Function's job (Sprint 12), which
 * fires automatically on account creation, independent of anything here.
 *
 * Email/password accounts get a verification email; Google accounts are
 * pre-verified and skip that step (§6's diagram).
 */
export function RegisterForm() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterFormValues) {
    setFormError(null);
    try {
      const credential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      await updateProfile(credential.user, { displayName: values.name });
      await sendEmailVerification(credential.user);
      // Buyer can browse immediately — verification gates first purchase only (§6), not registration itself.
      navigate(ROUTES.home, { replace: true });
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    }
  }

  async function handleGoogleSignUp() {
    setFormError(null);
    setIsGoogleLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate(ROUTES.home, { replace: true });
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="space-y-md">
      <h1 className="font-display text-heading text-ink dark:text-paper-dark">Create an Account</h1>

      {formError && <ErrorState variant="section" message={formError} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-sm" noValidate>
        <Input
          variant="text"
          label="Full name"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          variant="text"
          label="Email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          variant="text"
          type="password"
          label="Password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full">
          Create Account
        </Button>
      </form>

      <Button
        variant="secondary"
        isLoading={isGoogleLoading}
        onClick={handleGoogleSignUp}
        className="w-full"
      >
        Continue with Google
      </Button>

      <p className="text-center text-body-sm text-ink-muted dark:text-paper-dark-muted">
        Already have an account?{' '}
        <Link to={ROUTES.login} className="text-ink hover:opacity-hover dark:text-paper-dark">
          Log in
        </Link>
      </p>
    </div>
  );
}
