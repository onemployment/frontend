import { isValidEmail } from '../utils/validators';
import type { FieldErrorMap } from '../utils/validationMapping';

export interface LoginInput {
  email: string;
  password: string;
}

export function sanitizeLoginInput(input: LoginInput): LoginInput {
  return {
    email: input.email.trim().toLowerCase(),
    password: input.password,
  };
}

export function validateLoginInput(input: LoginInput): FieldErrorMap {
  const errors: FieldErrorMap = {};
  const email = input.email?.trim() ?? '';
  const password = input.password ?? '';

  if (!email) {
    errors.email = ['Email is required'];
  } else if (!isValidEmail(email)) {
    errors.email = ['Email is invalid'];
  }

  if (!password) {
    errors.password = ['Password is required'];
  } else if (password.length < 1) {
    errors.password = ['Password is required'];
  }

  return errors;
}
