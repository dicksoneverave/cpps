import MD5 from 'crypto-js/md5';

// Function to verify password with MD5 hash (Joomla format)
export const verifyJoomlaPassword = (plainPassword: string, hashedPassword: string): boolean => {
  try {
    // Create MD5 hash of the plain password
    const md5Hash = MD5(plainPassword).toString();
    
    // Compare the hashes - Joomla sometimes prefixes the hash
    // If the hash contains a colon, it's using a format like "md5:hash"
    if (hashedPassword.includes(':')) {
      const [, storedHash] = hashedPassword.split(':');
      return md5Hash === storedHash;
    }
    
    // Otherwise, compare directly
    return md5Hash === hashedPassword;
  } catch (err) {
    console.error("Password verification error:", err);
    return false;
  }
};
