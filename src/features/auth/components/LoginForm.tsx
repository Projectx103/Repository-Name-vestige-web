import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { ROUTES } from '@/constants/routes';
import { getAuthErrorMessage } from '../lib/authErrors';
import { getPostAuthRedirect } from '../lib/getPostAuthRedirect';
import type { UserRole } from '@vestige/shared-schemas';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * 07 - User Flows.md §5. Post-login redirect target is resolved from the
 * freshly-signed-in user's ID token claims directly (not AuthContext's
 * state, which may not have re-rendered yet in the same tick) — see the
 * getIdTokenResult() call below.
 */
export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const fromPath = (location.state as { from?: Location })?.from?.pathname as string | undefined;

  async function redirectAfterAuth() {
    const result = await auth.currentUser?.getIdTokenResult();
    const roles = (result?.claims.roles as UserRole[] | undefined) ?? ['buyer'];
    navigate(getPostAuthRedirect(roles, fromPath), { replace: true });
  }

  async function onSubmit(values: LoginFormValues) {
    setFormError(null);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      await redirectAfterAuth();
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    }
  }

  async function handleGoogleSignIn() {
    setFormError(null);
    setIsGoogleLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      await redirectAfterAuth();
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="space-y-md">
      <h1 className="font-display text-heading text-ink dark:text-paper-dark">Log In</h1>

      {formError && <ErrorState variant="section" message={formError} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-sm" noValidate>
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
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full">
          Log In
        </Button>
      </form>

      <Button
        variant="secondary"
        isLoading={isGoogleLoading}
        onClick={handleGoogleSignIn}
        className="w-full"
      >
        Continue with Google
      </Button>

      <div className="flex items-center justify-between text-body-sm">
        <Link
          to={ROUTES.forgotPassword}
          className="text-ink-muted hover:text-ink dark:text-paper-dark-muted dark:hover:text-paper-dark"
        >
          Forgot password?
        </Link>
        <Link
          to={ROUTES.register}
          className="text-ink-muted hover:text-ink dark:text-paper-dark-muted dark:hover:text-paper-dark"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}
