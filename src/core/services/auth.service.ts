import apiClient from "@/core/api/client";

export interface IAuthService {
  getCurrentUser(): Promise<unknown>; // Replace 'unknown' with your actual user type/interface
}

export class AuthServiceImpl implements IAuthService {
  async getCurrentUser() {
    // Assuming your Go backend has a /auth/me or similar endpoint
    // to return the profile of the currently authenticated user based on the HttpOnly cookie.
    const response = await apiClient.get("/auth/me");
    return response.data;
  }
}

export const authService = new AuthServiceImpl();