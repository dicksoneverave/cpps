
/**
 * Check if a role string matches any admin role variant
 */
export const isAdminRole = (role: string | null): boolean => {
  if (!role) return false;
  const adminRoles = ["OWC Admin", "owcadmin", "OWCAdminMenu", "admin"];
  return adminRoles.some(adminRole => 
    role.toLowerCase().includes(adminRole.toLowerCase())
  );
};
