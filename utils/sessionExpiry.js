// Build the tenant login URL for a redirect. hadToken distinguishes an
// expired/invalid session (show the "session expired" notice) from a user
// who was never logged in (plain login page).
export function loginRedirectPath(loginPath, targetPath, hadToken) {
  const redirect = encodeURIComponent(targetPath || "/");
  return `${loginPath}?redirect=${redirect}${hadToken ? "&expired=1" : ""}`;
}

// Decide whether an axios error means the tenant session is no longer valid.
// Returns the login URL to send the user to, or null when the error is not an
// authentication failure (permission 403s and network errors stay with the caller).
export function sessionExpiryRedirect(error, loginPath, currentPath) {
  if (!error || !error.response || error.response.status !== 401) {
    return null;
  }
  return loginRedirectPath(loginPath, currentPath, true);
}
