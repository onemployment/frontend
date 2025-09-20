import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Typography, Button, Box, Link as MuiLink } from '@mui/material';
import { useLoginMutation } from '../store/apiSlice';
import { createLoginSubmit } from '../features/auth/controllers/loginController';
import { getFirstFieldError } from '../features/auth/utils/validationMapping';
import { AuthLayout } from '../components/layout/AuthLayout';
import { FormField } from '../components/forms/FormField';

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
          onChange={(e) => setEmail(e.target.value)}
          fieldErrors={
            getFirstFieldError('email', fieldErrors)
              ? [getFirstFieldError('email', fieldErrors) as string]
              : undefined
          }
          autoComplete="email"
          required
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
          autoComplete="current-password"
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
          {isLoading ? 'Signing in…' : 'Sign In'}
        </Button>

        <Typography align="center">
          Don't have an account?{' '}
          <MuiLink component={Link} to="/signup">
            Sign up
          </MuiLink>
        </Typography>
      </Box>
    </AuthLayout>
  );
}

export default LoginPage;
