import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';
import { useLoginMutation, useRegisterMutation } from '../store/apiSlice';
import './Auth.css';

type Mode = 'login' | 'signup';

interface AuthProps {
  mode: Mode;
}

function Auth({ mode }: AuthProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [register, { isLoading: registering }] = useRegisterMutation();
  const [login, { isLoading: loggingIn }] = useLoginMutation();

  const isSignup = mode === 'signup';

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (isSignup) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (!acceptTerms) {
        setError('You must accept the Terms to continue');
        return;
      }
    }
    const isFetchBaseQueryError = (
      error: unknown
    ): error is FetchBaseQueryError =>
      typeof error === 'object' && error !== null && 'status' in error;

    const isSerializedError = (error: unknown): error is SerializedError =>
      typeof error === 'object' && error !== null && 'message' in error;

    const extractErrorMessage = (err: unknown): string => {
      if (isFetchBaseQueryError(err)) {
        const data = (err as { data?: unknown }).data;
        if (data && typeof data === 'object' && 'message' in data) {
          const msg = (data as { message?: unknown }).message;
          if (typeof msg === 'string') return msg;
        }
      }
      if (isSerializedError(err)) {
        const msg = (err as { message?: unknown }).message;
        if (typeof msg === 'string') return msg;
      }
      return 'Something went wrong';
    };

    const action = async () => {
      try {
        if (isSignup) {
          await register({ username, password }).unwrap();
          localStorage.setItem('onemployment:username', username);
          navigate('/app');
        } else {
          await login({ username, password }).unwrap();
          localStorage.setItem('onemployment:username', username);
          navigate('/app');
        }
      } catch (err: unknown) {
        setError(extractErrorMessage(err));
      }
    };
    void action();
  };

  return (
    <div className="Auth">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="auth-title">
          <motion.span
            initial={{ scale: 0.92, opacity: 0.9 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            O
          </motion.span>
          nemployment
        </h1>

        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="johndoe"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          {isSignup && (
            <>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                aria-invalid={Boolean(error) && password !== confirmPassword}
              />

              <label className="terms">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required
                />
                <span>I agree to the Terms of Service and Privacy Policy</span>
              </label>
            </>
          )}

          {error && <div className="field-error">{error}</div>}

          <button
            className="auth-submit-btn"
            type="submit"
            disabled={registering || loggingIn}
          >
            {registering || loggingIn
              ? isSignup
                ? 'Creating…'
                : 'Signing in…'
              : isSignup
                ? 'Create Account'
                : 'Sign In'}
          </button>
        </form>

        <div className="auth-switch">
          {isSignup ? (
            <>
              Already have an account? <Link to="/login">Log in</Link>
            </>
          ) : (
            <>
              Don’t have an account? <Link to="/signup">Sign up</Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Auth;
