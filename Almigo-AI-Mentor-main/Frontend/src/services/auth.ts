import axios from "axios";
import type { AuthResponse, LoginRequest, SignupRequest, User, ApiResponse } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const authClient = axios.create({
  baseURL: `${API_BASE_URL}/api/auth`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 15000,
});

export async function signupApi(data: SignupRequest): Promise<AuthResponse> {
  const res = await authClient.post<ApiResponse<AuthResponse>>("/signup", data);
  return res.data.data;
}

export async function loginApi(data: LoginRequest): Promise<AuthResponse> {
  const res = await authClient.post<ApiResponse<AuthResponse>>("/login", data);
  return res.data.data;
}

export async function logoutApi(): Promise<void> {
  await authClient.post("/logout");
}

export async function getMeApi(token: string): Promise<User> {
  const res = await authClient.get<ApiResponse<{ user: User }>>("/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data.user;
}

export async function refreshTokenApi(): Promise<AuthResponse> {
  const res = await authClient.post<ApiResponse<AuthResponse>>("/refresh");
  return res.data.data;
}
