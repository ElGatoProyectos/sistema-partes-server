"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const prisma_rol_repository_1 = require("../rol/prisma-rol.repository");
const http_response_1 = require("../common/http.response");
const prisma_user_repository_1 = require("./prisma-user.repository");
class UserValidation {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const emailExists = yield prisma_user_repository_1.prismaUserRepository.existsEmail(email);
                if (emailExists) {
                    return http_response_1.httpResponse.NotFoundException("El email ingresado ya existe en la base de datos");
                }
                return http_response_1.httpResponse.SuccessResponse("El email no existe, puede proceguir", emailExists);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar email", error);
            }
        });
    }
    findByEmailAdmin(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const emailExists = yield prisma_user_repository_1.prismaUserRepository.existsEmail(email);
                if (!emailExists) {
                    return http_response_1.httpResponse.NotFoundException("El email ingresado no se encontró en la base de datos");
                }
                return http_response_1.httpResponse.SuccessResponse("El email existe, puede proceguir", emailExists);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar email", error);
            }
        });
    }
    findByDni(dni) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma_user_repository_1.prismaUserRepository.findByDni(dni);
                if (!user) {
                    return http_response_1.httpResponse.NotFoundException("Usuario no encontrado");
                }
                return http_response_1.httpResponse.SuccessResponse("Usuario encontrado", user);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar usuario", error);
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma_user_repository_1.prismaUserRepository.findById(id);
                if (!user)
                    return http_response_1.httpResponse.NotFoundException("No se encontró el usuario solicitado");
                // const userMapper = new UserResponseMapper(user);
                return http_response_1.httpResponse.SuccessResponse("Usuario encontrado con éxito", user);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar usuario", error);
            }
        });
    }
    createUserAsAdmin(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const role = yield prisma_rol_repository_1.prismaRolRepository.existsName("ADMIN");
                if (!role) {
                    return http_response_1.httpResponse.BadRequestException("El Rol que deseas buscar no existe");
                }
                const userFormat = Object.assign(Object.assign({}, data), { rol_id: role === null || role === void 0 ? void 0 : role.id });
                const user = yield prisma_user_repository_1.prismaUserRepository.createUser(userFormat);
                if (!user)
                    return http_response_1.httpResponse.NotFoundException("No se pudo crear el usuario");
                // const userMapper = new UserResponseMapper(user);
                return http_response_1.httpResponse.SuccessResponse("Usuario creado con éxito", user);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar usuario", error);
            }
        });
    }
}
exports.userValidation = new UserValidation();
