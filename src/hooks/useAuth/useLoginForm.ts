
import { useState } from "react";

/**
 * Hook to manage login form state
 */
export const useLoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    setLoading,
    error,
    setError
  };
};
