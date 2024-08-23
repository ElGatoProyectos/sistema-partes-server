import "dotenv/config";

export const envConfig = {
  port: process.env.PORT || 4000,
  jwt_token: process.env.JWT_TOKEN || "secret",
};
