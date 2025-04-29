
import MD5 from 'crypto-js/md5';

/**
 * Verify password against stored MD5 hash
 */
export const verifyPassword = (plainPassword: string, hashedPassword: string): boolean => {
  try {
    // Create MD5 hash of the plain password
    const md5Hash = MD5(plainPassword).toString();
    
    // Direct comparison with stored hash
    return md5Hash === hashedPassword;
  } catch (err) {
    console.error("Password verification error:", err);
    return false;
  }
};

/**
 * Generate MD5 hash for a password
 */
export const hashPassword = (plainPassword: string): string => {
  return MD5(plainPassword).toString();
};
