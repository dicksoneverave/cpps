
CREATE OR REPLACE FUNCTION public.get_user_group_title(user_email TEXT)
RETURNS TABLE (group_title TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    g.title AS group_title
  FROM 
    public.users u
  JOIN 
    owc_user_usergroup_map m ON u.id = m.auth_user_id
  JOIN 
    owc_usergroups g ON m.group_id = g.id
  WHERE 
    u.email = user_email;
END;
$$ LANGUAGE plpgsql;
