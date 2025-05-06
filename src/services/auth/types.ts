
// Define interfaces for login service

export interface UserGroupData {
  group_id: number;
}

export interface LoginResponse {
  data: any;
  error: any;
  customUser: any;
  userRole?: string;
}

export interface CustomUserData {
  id: string;
  email: string;
  name?: string;
  password: string;
  created_at: string;
  updated_at: string;
  role?: string;
}
