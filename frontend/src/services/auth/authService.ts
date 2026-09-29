import { AuthUser, LoginCredentials, RegisterCredentials, UserRole } from '../../types/auth';
import { api, setToken } from '../api';

const STORAGE_KEY = 'consensus_auth_user';

class AuthService {
  private currentUser: AuthUser | null = null;
  private listeners: ((user: AuthUser | null) => void)[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.currentUser = JSON.parse(stored);
      } else {
        this.currentUser = null;
      }
    } catch {
      this.currentUser = null;
    }
  }

  private saveToStorage(user: AuthUser | null) {
    this.currentUser = user;
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
        setToken(null);
      }
    } catch (e) {
      console.error('Storage error', e);
    }
    this.notify();
  }

  public subscribe(listener: (user: AuthUser | null) => void): () => void {
    this.listeners.push(listener);
    listener(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.currentUser));
  }

  public async login(credentials: LoginCredentials): Promise<AuthUser> {
    const normalizedEmail = credentials.email.trim().toLowerCase();

    const res = await api.post<{ user: AuthUser; token: string }>('/api/auth/login', {
      email: normalizedEmail,
      password: credentials.password || 'password123',
    });

    if (res && res.user && res.token) {
      setToken(res.token);
      this.saveToStorage(res.user);
      return res.user;
    }

    throw new Error('Authentication failed. Invalid response from server.');
  }

  public async register(credentials: RegisterCredentials): Promise<AuthUser> {
    const normalizedEmail = credentials.email.trim().toLowerCase();
    const requestedRole: UserRole = credentials.role && credentials.role !== 'admin'
      ? credentials.role
      : 'participant';

    const res = await api.post<{ user: AuthUser; token: string }>('/api/auth/register', {
      name: credentials.name.trim() || 'New Builder',
      email: normalizedEmail,
      password: credentials.password || 'password123',
      role: requestedRole,
    });

    if (res && res.user && res.token) {
      setToken(res.token);
      this.saveToStorage(res.user);
      return res.user;
    }

    throw new Error('Registration failed. Invalid response from server.');
  }

  public logout(): void {
    this.saveToStorage(null);
  }

  public getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  public getUserRole(): UserRole | null {
    return this.currentUser ? this.currentUser.role : null;
  }
}

export const authService = new AuthService();
