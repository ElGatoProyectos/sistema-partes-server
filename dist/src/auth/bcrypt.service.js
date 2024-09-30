"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bcryptService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class BcryptService {
    comparePassword(passwordBody, passwordUser) {
        return bcrypt_1.default.compareSync(passwordBody, passwordUser);
    }
    hashPassword(password) {
        const roundSalt = 10;
        return bcrypt_1.default.hashSync(password, roundSalt);
    }
}
exports.bcryptService = new BcryptService();
