import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginMutation } from '../store/apiSlice';
import { createLoginSubmit } from '../features/auth/controllers/loginController';
import { getFirstFieldError } from '../features/auth/utils/validationMapping';
import './Auth.css';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submit = createLoginSubmit({
      login: (body) => login(body).unwrap(),
      navigate,
      setFieldErrors,
      setFormError,
    });
    await submit({ email, password });
  };

  return (
    <div className="Auth">
      <div className="auth-card">
        <h1 className="auth-title">onemployment</h1>
        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(getFirstFieldError('email', fieldErrors))}
          />
          {getFirstFieldError('email', fieldErrors) && (
            <div className="field-error">
              {getFirstFieldError('email', fieldErrors)}
            </div>
          )}

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={Boolean(getFirstFieldError('password', fieldErrors))}
          />
          {getFirstFieldError('password', fieldErrors) && (
            <div className="field-error">
              {getFirstFieldError('password', fieldErrors)}
            </div>
          )}

          {formError && <div className="field-error">{formError}</div>}

          <button
            className="auth-submit-btn"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <div className="auth-switch">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
