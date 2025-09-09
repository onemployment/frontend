export interface LoginResponseLike {
  token: string;
  user: unknown;
}

export interface RegisterResponseLike {
  token: string;
  user: unknown;
}

export function mapLoginResponseToCredentials(res: LoginResponseLike): {
  token: string;
  user: unknown;
} {
  return { token: res.token, user: res.user };
}

export function mapRegisterResponseToCredentials(res: RegisterResponseLike): {
  token: string;
  user: unknown;
} {
  return { token: res.token, user: res.user };
}
