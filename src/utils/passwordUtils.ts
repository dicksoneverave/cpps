
import MD5 from 'crypto-js/md5';

// Function to verify password with MD5 hash
export const verifyJoomlaPassword = (plainPassword: string, hashedPassword: string): boolean => {
  try {
    // Create MD5 hash of the plain password
    const md5Hash = MD5(plainPassword).toString();
    console.log("Plain password:", plainPassword);
    console.log("Generated MD5:", md5Hash);
    console.log("Stored hash:", hashedPassword);
    
    // Direct comparison for plain MD5 hash
    return md5Hash === hashedPassword;
  } catch (err) {
    console.error("Password verification error:", err);
    return false;
  }
};
