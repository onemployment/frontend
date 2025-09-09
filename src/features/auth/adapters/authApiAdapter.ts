import {
  mapLoginResponseToCredentials,
  mapRegisterResponseToCredentials,
} from '../utils/mappers';

type LoginInput = { email: string; password: string };
type RegisterInput = {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
};

export function buildLoginRequest(input: LoginInput): {
  url: string;
  init: RequestInit;
} {
  return {
    url: '/api/v1/auth/login',
    init: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: input.email, password: input.password }),
    },
  };
}

export function buildRegisterRequest(input: RegisterInput): {
  url: string;
  init: RequestInit;
} {
  return {
    url: '/api/v1/user',
    init: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: input.email,
        password: input.password,
        username: input.username,
        firstName: input.firstName,
        lastName: input.lastName,
      }),
    },
  };
}

export const parseLoginResponse = mapLoginResponseToCredentials;
export const parseRegisterResponse = mapRegisterResponseToCredentials;
