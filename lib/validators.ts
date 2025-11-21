export const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

export function isValidCode(code: string): boolean {
  return CODE_REGEX.test(code);
}

export function isValidUrl(url: string): boolean {
  try {
    // If the user forgets scheme, you can optionally prepend "https://"
    const hasScheme = /^https?:\/\//i.test(url);
    const finalUrl = hasScheme ? url : `https://${url}`;
    // This will throw if invalid
    new URL(finalUrl);
    return true;
  } catch {
    return false;
  }
}

export function normalizeUrl(url: string): string {
  const hasScheme = /^https?:\/\//i.test(url);
  return hasScheme ? url : `https://${url}`;
}

export function generateRandomCode(length: number = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
