// Decide whether an axios error means the tenant session is no longer valid.
// Returns the login URL to send the user to, or null when the error is not an
// authentication failure (permission 403s and network errors stay with the caller).
export function sessionExpiryRedirect(error, loginPath, currentPath) {
  if (!error || !error.response || error.response.status !== 401) {
    return null;
  }
  const redirect = encodeURIComponent(currentPath || "/");
  return `${loginPath}?redirect=${redirect}&expired=1`;
}
