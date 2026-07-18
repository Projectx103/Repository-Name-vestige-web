import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { ROUTES } from '@/constants/routes';
import { getAuthErrorMessage } from '../lib/authErrors';

const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email address'),
});
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

/**
 * 17 - Screen Inventory.md §2.3 — success confirmation is shown INLINE, not
 * as a Toast, "since the person may be navigating away" (e.g. to check
 * their email in another tab) and could miss a transient Toast entirely.
 */
export function ForgotPasswordForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setFormError(null);
    try {
      await sendPasswordResetEmail(auth, values.email);
      setIsSuccess(true);
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-sm">
        <h1 className="font-display text-heading text-ink dark:text-paper-dark">
          Check your email
        </h1>
        <p className="text-body-md text-ink-muted dark:text-paper-dark-muted">
          If an account exists for that email, a password reset link is on its way.
        </p>
        <Link
          to={ROUTES.login}
          className="text-body-sm text-ink hover:opacity-hover dark:text-paper-dark"
        >
          Back to Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-md">
      <h1 className="font-display text-heading text-ink dark:text-paper-dark">Forgot Password</h1>
      <p className="text-body-md text-ink-muted dark:text-paper-dark-muted">
        Enter your email and we'll send you a link to reset your password.
      </p>

      {formError && <ErrorState variant="section" message={formError} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-sm" noValidate>
        <Input
          variant="text"
          label="Email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full">
          Send Reset Link
        </Button>
      </form>

      <Link
        to={ROUTES.login}
        className="block text-center text-body-sm text-ink-muted hover:text-ink dark:text-paper-dark-muted dark:hover:text-paper-dark"
      >
        Back to Log In
      </Link>
    </div>
  );
}
