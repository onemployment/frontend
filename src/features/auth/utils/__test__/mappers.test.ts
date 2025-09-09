import { describe, it, expect } from 'vitest';

import {
  mapLoginResponseToCredentials,
  mapRegisterResponseToCredentials,
} from '../mappers';

const user = {
  id: 'u1',
  email: 'user@example.com',
  username: 'user',
  firstName: 'F',
  lastName: 'L',
  displayName: null,
  emailVerified: false,
  accountCreationMethod: 'local',
  createdAt: new Date().toISOString(),
  lastLoginAt: null,
};

describe('mappers (TDD)', () => {
  it('maps login response to credentials', () => {
    const res = { message: 'Login successful', token: 't1', user };
    const creds = mapLoginResponseToCredentials(
      res as unknown as { token: string; user: unknown }
    );
    expect(creds).toEqual({ token: 't1', user });
  });

  it('maps register response to credentials', () => {
    const res = { message: 'User created successfully', token: 't2', user };
    const creds = mapRegisterResponseToCredentials(
      res as unknown as { token: string; user: unknown }
    );
    expect(creds).toEqual({ token: 't2', user });
  });
});
