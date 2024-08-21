import { httpResponse, T_HttpResponse } from "@/common/http.response";

class AuthService {
  async login(body: any): Promise<T_HttpResponse> {
    try {
      return httpResponse.http200("Login successful", null);
    } catch (error) {
      return httpResponse.http500("Error", error);
    } finally {
    }
  }
}

export const authService = new AuthService();
