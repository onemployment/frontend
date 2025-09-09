import {
  isValidEmail,
  isValidName,
  isValidPassword,
  isValidUsername,
} from '../utils/validators';
import type { FieldErrorMap } from '../utils/validationMapping';

export interface RegisterInput {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
}

export function sanitizeRegisterInput(input: RegisterInput): RegisterInput {
  return {
    email: input.email.trim().toLowerCase(),
    password: input.password,
    username: input.username.trim(),
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
  };
}

export function validateRegisterInput(input: RegisterInput): FieldErrorMap {
  const errors: FieldErrorMap = {};
  const email = input.email?.trim() ?? '';
  const password = input.password ?? '';
  const username = input.username?.trim() ?? '';
  const firstName = input.firstName?.trim() ?? '';
  const lastName = input.lastName?.trim() ?? '';

  if (!email) {
    errors.email = ['Email is required'];
  } else if (!isValidEmail(email)) {
    errors.email = ['Email is invalid'];
  }

  if (!password) {
    errors.password = ['Password is required'];
  } else if (!isValidPassword(password)) {
    errors.password = ['Password does not meet complexity requirements'];
  }

  if (!username) {
    errors.username = ['Username is required'];
  } else if (!isValidUsername(username)) {
    errors.username = ['Username is invalid'];
  }

  if (!firstName) {
    errors.firstName = ['First name is required'];
  } else if (!isValidName(firstName)) {
    errors.firstName = ['First name is invalid'];
  }

  if (!lastName) {
    errors.lastName = ['Last name is required'];
  } else if (!isValidName(lastName)) {
    errors.lastName = ['Last name is invalid'];
  }

  return errors;
}
