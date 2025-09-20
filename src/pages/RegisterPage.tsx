import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Typography, Button, Box, Link as MuiLink, Chip } from '@mui/material';
import {
  useRegisterMutation,
  useLazyValidateEmailQuery,
  useLazyValidateUsernameQuery,
  useLazySuggestUsernamesQuery,
} from '../store/apiSlice';
import { createRegisterSubmit } from '../features/auth/controllers/registerController';
import { getFirstFieldError } from '../features/auth/utils/validationMapping';
import { debounce } from '../features/auth/utils/debounce';
import { AuthLayout } from '../components/layout/AuthLayout';
import { FormField } from '../components/forms/FormField';

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
    <AuthLayout>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{ fontWeight: 'bold' }}
      >
        onemployment
      </Typography>

      <Box component="form" onSubmit={onSubmit} noValidate>
        <FormField
          name="email"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            debouncedCheckEmail(e.target.value.trim().toLowerCase());
          }}
          fieldErrors={
            getFirstFieldError('email', fieldErrors)
              ? [getFirstFieldError('email', fieldErrors) as string]
              : undefined
          }
          autoComplete="email"
          required
          helperText={
            emailHint && !getFirstFieldError('email', fieldErrors)
              ? emailHint
              : undefined
          }
          color={
            emailAvailable === true
              ? 'success'
              : emailAvailable === false
                ? 'error'
                : 'primary'
          }
        />

        <FormField
          name="password"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fieldErrors={
            getFirstFieldError('password', fieldErrors)
              ? [getFirstFieldError('password', fieldErrors) as string]
              : undefined
          }
          autoComplete="new-password"
          required
        />

        <FormField
          name="username"
          type="text"
          label="Username"
          value={username}
          onChange={(e) => {
            const v = e.target.value;
            setUsername(v);
            debouncedCheckUsername(v.trim());
          }}
          fieldErrors={
            getFirstFieldError('username', fieldErrors)
              ? [getFirstFieldError('username', fieldErrors) as string]
              : undefined
          }
          autoComplete="username"
          required
          helperText={
            !getFirstFieldError('username', fieldErrors) && usernameHint
              ? usernameHint
              : undefined
          }
          color={
            usernameAvailable === true
              ? 'success'
              : usernameAvailable === false
                ? 'error'
                : 'primary'
          }
        />

        {usernameSuggestions.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Suggestions:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {usernameSuggestions.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  onClick={() => setUsername(s)}
                  sx={{
                    backgroundColor: '#f3f4f6',
                    color: '#111827',
                    border: '1px solid #e5e7eb',
                    '&:hover': {
                      backgroundColor: '#e5e7eb',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        <FormField
          name="firstName"
          type="text"
          label="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          fieldErrors={
            getFirstFieldError('firstName', fieldErrors)
              ? [getFirstFieldError('firstName', fieldErrors) as string]
              : undefined
          }
          required
        />

        <FormField
          name="lastName"
          type="text"
          label="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          fieldErrors={
            getFirstFieldError('lastName', fieldErrors)
              ? [getFirstFieldError('lastName', fieldErrors) as string]
              : undefined
          }
          required
        />

        {formError && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {formError}
          </Typography>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading}
          sx={{ mt: 3, mb: 2 }}
        >
          {isLoading ? 'Creating…' : 'Create Account'}
        </Button>

        <Typography align="center">
          Already have an account?{' '}
          <MuiLink component={Link} to="/login">
            Log in
          </MuiLink>
        </Typography>
      </Box>
    </AuthLayout>
  );
}

export default RegisterPage;
