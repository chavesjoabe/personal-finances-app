import httpClient, { isMockEnabled } from "./httpClient";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserResponse,
} from "../types";

const TOKEN_KEY = "pf_app_jwt_token";
const USER_KEY = "pf_app_user";

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredUser = (): UserResponse | null => {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const setStoredUser = (user: UserResponse): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

async function login(credentials: LoginRequest): Promise<AuthResponse> {
  if (isMockEnabled()) {
    const mockUser: UserResponse = {
      _id: "user-1",
      name: "Usuário Demonstrativo",
      email: credentials.email,
    };
    const mockToken = "mock-jwt-token-123456";
    setToken(mockToken);
    setStoredUser(mockUser);
    return { token: mockToken, user: mockUser };
  }

  const response = await httpClient.post<AuthResponse>("/auth/login", credentials);
  setToken(response.data.token);
  setStoredUser(response.data.user);
  return response.data;
}

async function register(userData: RegisterRequest): Promise<AuthResponse> {
  if (isMockEnabled()) {
    const mockUser: UserResponse = {
      _id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
    };
    const mockToken = `mock-jwt-token-${Date.now()}`;
    setToken(mockToken);
    setStoredUser(mockUser);
    return { token: mockToken, user: mockUser };
  }

  const response = await httpClient.post<AuthResponse>("/auth/register", userData);
  setToken(response.data.token);
  setStoredUser(response.data.user);
  return response.data;
}

async function getCurrentUser(): Promise<UserResponse> {
  if (isMockEnabled()) {
    const stored = getStoredUser();
    if (stored) return stored;
    throw new Error("Unauthenticated");
  }

  const response = await httpClient.get<UserResponse>("/auth/me");
  setStoredUser(response.data);
  return response.data;
}

function logout(): void {
  removeToken();
}

const authService = {
  getToken,
  setToken,
  removeToken,
  getStoredUser,
  setStoredUser,
  login,
  register,
  getCurrentUser,
  logout,
};

export default authService;
