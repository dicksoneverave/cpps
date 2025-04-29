
import { User as SupabaseUser } from "@supabase/supabase-js";

export interface UserGroup {
  id: number;
  title: string;
  parent_id: string;
}

export interface UserData {
  id: string;
  email: string | null;
  name?: string;
  group_id?: number;
  group_title?: string;
  owc_user_id?: number;
}

export type UserMappingInsert = {
  auth_user_id: string;
  owc_user_id: number;
  name: string;
  email: string | null;
};
