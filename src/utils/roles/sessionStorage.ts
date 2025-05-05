
/**
 * Fetch role from session storage
 */
export const getRoleFromSessionStorage = (): string | null => {
  const storedRole = sessionStorage.getItem('userRole');
  if (storedRole) {
    console.log("Found role in session storage:", storedRole);
  }
  return storedRole;
};

/**
 * Save role to session storage
 */
export const saveRoleToSessionStorage = (role: string): void => {
  if (role) {
    console.log("Saving role to session storage:", role);
    sessionStorage.removeItem('userRole');
    sessionStorage.setItem('userRole', role);
  }
};
