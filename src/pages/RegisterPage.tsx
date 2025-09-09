import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  useRegisterMutation,
  useLazyValidateEmailQuery,
  useLazyValidateUsernameQuery,
  useLazySuggestUsernamesQuery,
} from '../store/apiSlice';
import { createRegisterSubmit } from '../features/auth/controllers/registerController';
import { getFirstFieldError } from '../features/auth/utils/validationMapping';
import { debounce } from '../features/auth/utils/debounce';
import './Auth.css';

function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [formError, setFormError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [register, { isLoading }] = useRegisterMutation();
  const [triggerEmail] = useLazyValidateEmailQuery();
  const [triggerUsername] = useLazyValidateUsernameQuery();
  const [triggerSuggest] = useLazySuggestUsernamesQuery();

  const [emailHint, setEmailHint] = useState<string>('');
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [usernameHint, setUsernameHint] = useState<string>('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);

  const debouncedCheckEmail = useMemo(
    () =>
      debounce(async (value: string) => {
        if (!value) {
          setEmailHint('');
          setEmailAvailable(null);
          return;
        }
        try {
          const res = await triggerEmail({ email: value }).unwrap();
          setEmailHint(res.message);
          setEmailAvailable(res.available);
        } catch (e: unknown) {
          const err = e as {
            status?: number;
            data?: { retryAfter?: number; message?: string };
          };
          if (err?.status === 429) {
            setEmailHint(
              `Too many requests. Please try again in ${err?.data?.retryAfter ?? 0}s`
            );
            setEmailAvailable(false);
          } else {
            setEmailHint(err?.data?.message || 'Validation failed');
            setEmailAvailable(false);
          }
        }
      }, 400),
    [triggerEmail]
  );

  const debouncedCheckUsername = useMemo(
    () =>
      debounce(async (value: string) => {
        if (!value) {
          setUsernameHint('');
          setUsernameAvailable(null);
          setUsernameSuggestions([]);
          return;
        }
        try {
          const res = await triggerUsername({ username: value }).unwrap();
          setUsernameHint(res.message);
          setUsernameAvailable(res.available);
          if (!res.available) {
            try {
              const s = await triggerSuggest({ username: value }).unwrap();
              setUsernameSuggestions(s.suggestions);
            } catch {
              setUsernameSuggestions([]);
            }
          } else {
            setUsernameSuggestions([]);
          }
        } catch (e: unknown) {
          const err = e as {
            status?: number;
            data?: { retryAfter?: number; message?: string };
          };
          if (err?.status === 429) {
            setUsernameHint(
              `Too many requests. Please try again in ${err?.data?.retryAfter ?? 0}s`
            );
            setUsernameAvailable(false);
          } else {
            setUsernameHint(err?.data?.message || 'Validation failed');
          }
          setUsernameAvailable(false);
          setUsernameSuggestions([]);
        }
      }, 400),
    [triggerUsername, triggerSuggest]
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submit = createRegisterSubmit({
      register: (body) => register(body).unwrap(),
      navigate,
      setFieldErrors,
      setFormError,
    });
    await submit({ email, password, username, firstName, lastName });
  };

  return (
    <div className="Auth">
      <div className="auth-card">
        <h1 className="auth-title">onemployment</h1>
        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <label htmlFor="email">Email</label>
          <div className="field">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                debouncedCheckEmail(e.target.value.trim().toLowerCase());
              }}
              aria-invalid={Boolean(getFirstFieldError('email', fieldErrors))}
            />
            <div className="field-messages">
              {getFirstFieldError('email', fieldErrors) && (
                <div className="field-error">
                  {getFirstFieldError('email', fieldErrors)}
                </div>
              )}
              {emailHint && !getFirstFieldError('email', fieldErrors) && (
                <div
                  className={`field-hint ${emailAvailable ? 'success' : emailAvailable === false ? 'error' : ''}`}
                >
                  {emailHint}
                </div>
              )}
            </div>
          </div>

          <label htmlFor="password">Password</label>
          <div className="field">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(
                getFirstFieldError('password', fieldErrors)
              )}
            />
            <div className="field-messages">
              {getFirstFieldError('password', fieldErrors) && (
                <div className="field-error">
                  {getFirstFieldError('password', fieldErrors)}
                </div>
              )}
            </div>
          </div>

          <label htmlFor="username">Username</label>
          <div className="field">
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => {
                const v = e.target.value;
                setUsername(v);
                debouncedCheckUsername(v.trim());
              }}
              aria-invalid={Boolean(
                getFirstFieldError('username', fieldErrors)
              )}
            />
            <div className="field-messages">
              {getFirstFieldError('username', fieldErrors) && (
                <div className="field-error">
                  {getFirstFieldError('username', fieldErrors)}
                </div>
              )}
              {!getFirstFieldError('username', fieldErrors) && usernameHint && (
                <div
                  className={`field-hint ${usernameAvailable ? 'success' : usernameAvailable === false ? 'error' : ''}`}
                >
                  {usernameHint}
                </div>
              )}
              {usernameSuggestions.length > 0 && (
                <div className="field-hint suggestions">
                  Suggestions:
                  {usernameSuggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setUsername(s)}
                      className="suggestion-btn"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <label htmlFor="firstName">First name</label>
          <div className="field">
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              aria-invalid={Boolean(
                getFirstFieldError('firstName', fieldErrors)
              )}
            />
            <div className="field-messages">
              {getFirstFieldError('firstName', fieldErrors) && (
                <div className="field-error">
                  {getFirstFieldError('firstName', fieldErrors)}
                </div>
              )}
            </div>
          </div>

          <label htmlFor="lastName">Last name</label>
          <div className="field">
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              aria-invalid={Boolean(
                getFirstFieldError('lastName', fieldErrors)
              )}
            />
            <div className="field-messages">
              {getFirstFieldError('lastName', fieldErrors) && (
                <div className="field-error">
                  {getFirstFieldError('lastName', fieldErrors)}
                </div>
              )}
            </div>
          </div>

          {formError && <div className="field-error">{formError}</div>}

          <button
            className="auth-submit-btn"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Creating…' : 'Create Account'}
          </button>
        </form>
        <div className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
