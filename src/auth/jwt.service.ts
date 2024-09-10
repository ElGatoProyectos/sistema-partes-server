import { envConfig } from "@/config/env.config";
import express from "@/config/express.config";
import jwt from "@/config/jwt.config";
import { T_ResponseToken } from "./models/auth.type";
import { prismaUserRepository } from "@/user/prisma-user.repository";
import { Usuario } from "@prisma/client";
import { I_User } from "@/user/models/user.interface";
import { userService } from "@/user/user.service";
import { httpResponse, T_HttpResponse } from "@/common/http.response";

class JWTService {
  sign(payload: any) {
    return jwt.sign(payload, envConfig.jwt_token, { expiresIn: "30d" });
  }

  verify(token: string) {
    return jwt.verify(token, envConfig.jwt_token);
  }

  async getUserFromToken(authorizationHeader: string): Promise<T_HttpResponse> {
    const [bearer, token] = authorizationHeader.split(" ");
    const tokenDecrypted = jwtService.verify(token) as T_ResponseToken;
    const userResponse = await userService.findById(tokenDecrypted.id);
    if (!userResponse.success) return userResponse;
    return httpResponse.SuccessResponse("Usuario encontrado", userResponse);
  }
}

export const jwtService = new JWTService();
