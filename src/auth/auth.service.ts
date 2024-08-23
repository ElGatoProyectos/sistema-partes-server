import { httpResponse, T_HttpResponse } from "@/common/http.response";

class AuthService {
  async login(body: any): Promise<T_HttpResponse> {
    try {
      // buscar usuario

      // validar password

      // retornarjwt
      return httpResponse.SuccessResponse("Login successful", null);
    } catch (error) {
      return httpResponse.InternalServerErrorException("Error", error);
    } finally {
    }
  }
}

export const authService = new AuthService();
