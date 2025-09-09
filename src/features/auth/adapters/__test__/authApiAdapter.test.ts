import { describe, it, expect } from 'vitest';

// TDD: target module not implemented yet
import {
  buildLoginRequest,
  buildRegisterRequest,
  parseLoginResponse,
  parseRegisterResponse,
} from '../authApiAdapter';

describe('authApiAdapter (TDD)', () => {
  it('builds login request with email/password and correct endpoint', () => {
    const req = buildLoginRequest({
      email: 'e@example.com',
      password: 'P@ssw0rd',
    });
    expect(req.url).toBe('/api/v1/auth/login');
    expect(req.init.method).toBe('POST');
    expect(req.init.headers).toMatchObject({
      'Content-Type': 'application/json',
    });
    const body = JSON.parse(String(req.init.body));
    expect(body).toEqual({ email: 'e@example.com', password: 'P@ssw0rd' });
  });

  it('builds register request with required fields and correct endpoint', () => {
    const req = buildRegisterRequest({
      email: 'u@example.com',
      password: 'StrongPass123',
      username: 'user1',
      firstName: 'First',
      lastName: 'Last',
    });
    expect(req.url).toBe('/api/v1/user');
    expect(req.init.method).toBe('POST');
    expect(req.init.headers).toMatchObject({
      'Content-Type': 'application/json',
    });
    const body = JSON.parse(String(req.init.body));
    expect(body).toEqual({
      email: 'u@example.com',
      password: 'StrongPass123',
      username: 'user1',
      firstName: 'First',
      lastName: 'Last',
    });
  });

  it('parses login response to credentials shape', () => {
    const res = {
      message: 'Login successful',
      token: 't1',
      user: { id: '1', email: 'e@example.com' },
    };
    const creds = parseLoginResponse(
      res as unknown as { token: string; user: unknown }
    );
    expect(creds).toEqual({ token: 't1', user: res.user });
  });

  it('parses register response to credentials shape', () => {
    const res = {
      message: 'User created successfully',
      token: 't2',
      user: { id: '2', email: 'u@example.com' },
    };
    const creds = parseRegisterResponse(
      res as unknown as { token: string; user: unknown }
    );
    expect(creds).toEqual({ token: 't2', user: res.user });
  });
});
