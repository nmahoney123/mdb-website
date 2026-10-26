const SLASH = 47; // "/"
const BACKSLASH = 92; // "\" — browsers treat it as "/" in URLs

/**
 * "/" + `p` without its leading slashes/backslashes or trailing slashes, so the
 * result is always a same-site path ("//evil.com/" → "/evil.com").
 *
 * Loop-based on purpose: a regex like /\/+$/ backtracks quadratically on a long
 * run of slashes, which an attacker can send in a single request.
 */
export function trimSlashes(p: string): string {
  let start = 0;
  let end = p.length;
  while (start < end && (p.charCodeAt(start) === SLASH || p.charCodeAt(start) === BACKSLASH)) start++;
  while (end > start && p.charCodeAt(end - 1) === SLASH) end--;
  return "/" + p.slice(start, end);
}
