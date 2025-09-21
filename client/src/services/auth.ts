import { LoginData, type User } from "@shared/schema";
import { authApi } from "./api";

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
  cpf: string;
}

class AuthService {
  private currentUser: AuthUser | null = null;

  async login(data: LoginData): Promise<AuthUser> {
    const response = await authApi.login(data);
    
    localStorage.setItem("auth_token", response.token);
    localStorage.setItem("user_data", JSON.stringify(response.user));
    
    this.currentUser = response.user;
    return response.user;
  }

  logout(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    this.currentUser = null;
  }

  getCurrentUser(): AuthUser | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    const userData = localStorage.getItem("user_data");
    if (userData) {
      this.currentUser = JSON.parse(userData);
      return this.currentUser;
    }

    return null;
  }

  getToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null && this.getCurrentUser() !== null;
  }
}

export const authService = new AuthService();
