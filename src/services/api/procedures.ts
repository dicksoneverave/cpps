
import { supabase } from "@/integrations/supabase/client";

// Define a stored procedure in Supabase to handle user creation
export const createStoredProcedure = `
CREATE OR REPLACE FUNCTION create_owc_user(
  p_name TEXT,
  p_username TEXT,
  p_email TEXT,
  p_password TEXT,
  p_block TEXT,
  p_send_email TEXT,
  p_register_date TEXT,
  p_require_reset TEXT,
  p_auth_provider TEXT
) RETURNS BIGINT AS $$
DECLARE
  new_id BIGINT;
BEGIN
  INSERT INTO owc_users (
    name,
    username,
    email,
    password,
    block,
    sendEmail,
    registerDate,
    requireReset,
    authProvider
  ) VALUES (
    p_name,
    p_username,
    p_email,
    p_password,
    p_block,
    p_send_email,
    p_register_date,
    p_require_reset,
    p_auth_provider
  ) RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;
`;
