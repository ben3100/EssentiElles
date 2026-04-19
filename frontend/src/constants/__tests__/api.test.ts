import { FALLBACK_API_BASE_URL, resolveApiBaseUrl } from '../api';

describe('resolveApiBaseUrl', () => {
  it('falls back to localhost api when no URL is provided', () => {
    expect(resolveApiBaseUrl(undefined)).toBe(FALLBACK_API_BASE_URL);
  });

  it('appends /api when given a bare backend host', () => {
    expect(resolveApiBaseUrl('http://localhost:8000')).toBe('http://localhost:8000/api');
  });

  it('keeps a configured /api suffix without duplicating it', () => {
    expect(resolveApiBaseUrl('http://localhost:8000/api')).toBe('http://localhost:8000/api');
  });

  it('ignores trailing slashes before normalizing', () => {
    expect(resolveApiBaseUrl('http://localhost:8000/api/')).toBe('http://localhost:8000/api');
  });

  it('falls back when the environment value is a placeholder string', () => {
    expect(resolveApiBaseUrl('   ')).toBe(FALLBACK_API_BASE_URL);
  });
});
