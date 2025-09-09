import { describe, it, expect } from 'vitest';

// TDD: helpers not implemented yet
import {
  checkEmailAvailability,
  checkUsernameAvailability,
} from '../availabilityController';

describe('availabilityController (TDD)', () => {
  it('email: returns availability and message from fetcher', async () => {
    const fetcher = async (email: string) => ({
      available: email !== 'taken@example.com',
      message:
        email === 'taken@example.com'
          ? 'Email already registered. Please sign in instead'
          : 'Email is available',
    });
    await expect(
      checkEmailAvailability(fetcher, 'free@example.com')
    ).resolves.toEqual({ available: true, message: 'Email is available' });
    await expect(
      checkEmailAvailability(fetcher, 'taken@example.com')
    ).resolves.toEqual({
      available: false,
      message: 'Email already registered. Please sign in instead',
    });
  });

  it('email: handles 429 by returning a friendly message with retry hint when provided', async () => {
    const fetcher: (email: string) => Promise<{
      available: boolean;
      message: string;
      retryAfter?: number;
    }> = async () => {
      throw { status: 429, data: { retryAfter: 12 } } as unknown;
    };
    await expect(
      checkEmailAvailability(fetcher, 'x@example.com')
    ).resolves.toEqual({
      available: false,
      message: 'Too many requests. Please try again in 12s',
    });
  });

  it('username: returns availability, message and suggestions from fetcher', async () => {
    const fetcher = async (username: string) =>
      username === 'taken'
        ? {
            available: false,
            message: 'Username is taken',
            suggestions: ['taken2', 'taken3'],
          }
        : { available: true, message: 'Username is available' };
    await expect(checkUsernameAvailability(fetcher, 'free')).resolves.toEqual({
      available: true,
      message: 'Username is available',
    });
    await expect(checkUsernameAvailability(fetcher, 'taken')).resolves.toEqual({
      available: false,
      message: 'Username is taken',
      suggestions: ['taken2', 'taken3'],
    });
  });

  it('username: handles 429 by returning a friendly message with retry hint when provided', async () => {
    const fetcher: (username: string) => Promise<{
      available: boolean;
      message: string;
      suggestions?: string[];
      retryAfter?: number;
    }> = async () => {
      throw { status: 429, data: { retryAfter: 7 } } as unknown;
    };
    await expect(checkUsernameAvailability(fetcher, 'any')).resolves.toEqual({
      available: false,
      message: 'Too many requests. Please try again in 7s',
    });
  });
});
