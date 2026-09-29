export type UserRole = 'participant' | 'organizer' | 'judge' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
  headline?: string;
  createdAt: string;
}

export interface AuthSession {
  user: AuthUser | null;
  isAuthenticated: boolean;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password?: string;
  role?: UserRole;
}
