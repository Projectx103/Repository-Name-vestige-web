import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageLoader } from '@/components/ui/PageLoader';
import { ROUTES } from '@/constants/routes';
import { getAuthErrorMessage } from '../lib/authErrors';

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

type CodeStatus = 'checking' | 'valid' | 'invalid' | 'success';

/**
 * 17 - Screen Inventory.md §2.4. `oobCode` is Firebase's standard query
 * param name for every action-link type (password reset, email
 * verification, etc.) — the link in the reset email points here with that
 * code attached. Verified once on mount via verifyPasswordResetCode before
 * showing the form at all, since a code can be invalid/expired before the
 * person ever gets to type a new password (§2.4's documented Error state).
 */
export function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const oobCode = searchParams.get('oobCode');

  const [status, setStatus] = useState<CodeStatus>('checking');
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) });

  useEffect(() => {
    if (!oobCode) {
      setStatus('invalid');
      return;
    }
    verifyPasswordResetCode(auth, oobCode)
      .then(() => setStatus('valid'))
      .catch(() => setStatus('invalid'));
  }, [oobCode]);

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!oobCode) return;
    setFormError(null);
    try {
      await confirmPasswordReset(auth, oobCode, values.password);
      setStatus('success');
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    }
  }

  if (status === 'checking') {
    return <PageLoader />;
  }

  if (status === 'invalid') {
    return (
      <div className="space-y-sm">
        <ErrorState
          variant="page"
          message="This password reset link is invalid or has expired."
          primaryActionLabel="Request a new link"
          onPrimaryAction={() => navigate(ROUTES.forgotPassword)}
        />
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="space-y-sm">
        <h1 className="font-display text-heading text-ink dark:text-paper-dark">
          Password updated
        </h1>
        <p className="text-body-md text-ink-muted dark:text-paper-dark-muted">
          Your password has been changed. You can now log in.
        </p>
        <Link
          to={ROUTES.login}
          className="text-body-sm text-ink hover:opacity-hover dark:text-paper-dark"
        >
          Go to Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-md">
      <h1 className="font-display text-heading text-ink dark:text-paper-dark">
        Set a New Password
      </h1>

      {formError && <ErrorState variant="section" message={formError} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-sm" noValidate>
        <Input
          variant="text"
          type="password"
          label="New password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          variant="text"
          type="password"
          label="Confirm new password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full">
          Update Password
        </Button>
      </form>
    </div>
  );
}
