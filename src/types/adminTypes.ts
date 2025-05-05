
import { User as SupabaseUser } from "@supabase/supabase-js";

export interface UserGroup {
  id: number;
  title: string;
}

export interface UserGroupAssignment {
  id?: number;
  auth_user_id: string;
  group_id: number;
}

export interface UserData {
  id: string;
  email: string | null;
  name?: string;
  password?: string;
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

// Define the expected types for Database tables
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          password: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          password: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          password?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_mapping: {
        Row: {
          auth_user_id: string;
          owc_user_id: number;
          name: string;
          email: string | null;
        };
        Insert: {
          auth_user_id: string;
          owc_user_id: number;
          name: string;
          email: string | null;
        };
        Update: {
          auth_user_id?: string;
          owc_user_id?: number;
          name?: string;
          email?: string | null;
        };
      };
      owc_users: {
        Row: {
          id: number;
          name: string;
          username: string;
          email: string;
          password: string;
          block: string;
          sendEmail: string;
          registerDate: string;
          requireReset: string;
          authProvider: string;
          [key: string]: any;
        };
        Insert: {
          name: string;
          username: string;
          email: string;
          password: string;
          block: string;
          sendEmail: string;
          registerDate: string;
          requireReset: string;
          authProvider: string;
        };
        Update: {
          name?: string;
          username?: string;
          email?: string;
          password?: string;
          block?: string;
          sendEmail?: string;
          registerDate?: string;
          requireReset?: string;
          authProvider?: string;
        };
      };
      owc_usergroups: {
        Row: {
          id: number;
          title: string;
          parent_id: string;
          [key: string]: any;
        };
      };
      owc_user_usergroup_map: {
        Row: {
          user_id: number;
          group_id: number;
        };
        Insert: {
          user_id: number;
          group_id: number;
        };
        Update: {
          user_id?: number;
          group_id?: number;
        };
      };
    };
  };
}
