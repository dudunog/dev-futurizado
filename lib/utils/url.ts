/**
 * Normalizes a URL by removing query params and hash
 * Example: https://example.com/page?foo=bar#section -> https://example.com/page
 */
export function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}
