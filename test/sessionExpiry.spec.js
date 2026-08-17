import { describe, it, expect } from 'vitest';
import { sessionExpiryRedirect } from '../utils/sessionExpiry.js';

describe('sessionExpiryRedirect', () => {
  it('returns login URL with encoded redirect and expired flag on 401', () => {
    const err = { response: { status: 401 } };
    expect(sessionExpiryRedirect(err, '/hcm/login', '/hcm/ma'))
      .toBe('/hcm/login?redirect=%2Fhcm%2Fma&expired=1');
  });

  it('ignores non-401 responses (permission errors must not redirect)', () => {
    expect(sessionExpiryRedirect({ response: { status: 403 } }, '/hcm/login', '/hcm/ma'))
      .toBeNull();
    expect(sessionExpiryRedirect({ response: { status: 500 } }, '/hcm/login', '/hcm/ma'))
      .toBeNull();
  });

  it('ignores network errors without a response and nullish errors', () => {
    expect(sessionExpiryRedirect(new Error('Network Error'), '/hcm/login', '/hcm/ma'))
      .toBeNull();
    expect(sessionExpiryRedirect(undefined, '/hcm/login', '/hcm/ma')).toBeNull();
  });

  it('defaults the redirect target to / when currentPath is empty', () => {
    expect(sessionExpiryRedirect({ response: { status: 401 } }, '/sgc/login', ''))
      .toBe('/sgc/login?redirect=%2F&expired=1');
  });
});
