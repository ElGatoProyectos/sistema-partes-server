import { envConfig } from "@/config/env.config";
import express from "@/config/express.config";
import jwt from "@/config/jwt.config";

class JWTService {
  sign(payload: any) {
    return jwt.sign(payload, envConfig.jwt_token, { expiresIn: "30d" });
  }

  verify(token: string) {
    return jwt.verify(token, envConfig.jwt_token);
  }
}

export const jwtService = new JWTService();
