
import { Session, User } from "@supabase/supabase-js";

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  userRole: string | null;
  loading: boolean;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

export interface UserRoleFetchOptions {
  userId?: string;
  email?: string;
}

export interface UserRoleState {
  userRole: string | null;
  isAdmin: boolean;
}
