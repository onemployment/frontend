import { describe, it, expect, vi } from 'vitest';

// TDD: controller not implemented yet
import { createLogoutHandler } from '../logoutController';

describe('logoutController (TDD)', () => {
  it('calls logout and navigates to /login; ignores errors', async () => {
    const logout = vi.fn().mockResolvedValue({ message: 'Logout successful' });
    const navigate = vi.fn();
    const handler = createLogoutHandler({ logout, navigate });
    await handler();
    expect(logout).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith('/login');
  });

  it('still navigates to /login if logout rejects', async () => {
    const logout = vi.fn().mockRejectedValue(new Error('network'));
    const navigate = vi.fn();
    const handler = createLogoutHandler({ logout, navigate });
    await handler();
    expect(navigate).toHaveBeenCalledWith('/login');
  });
});
