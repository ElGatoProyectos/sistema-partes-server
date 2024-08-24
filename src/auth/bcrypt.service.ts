import bcrypt from "bcrypt";
import { httpResponse, T_HttpResponse } from "@/common/http.response";

class BcryptService {
  comparePassword(passwordBody: string, passwordUser: string): Boolean {
    return bcrypt.compareSync(passwordBody, passwordUser);
  }
  hashPassword(password: string) {
    const roundSalt = 10;
    return bcrypt.hashSync(password, roundSalt);
  }
}

export const bcryptService = new BcryptService();
