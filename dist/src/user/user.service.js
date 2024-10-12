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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const section_validation_1 = require("./../section/section.validation");
const prisma_user_repository_1 = require("./prisma-user.repository");
const prisma_config_1 = __importDefault(require("../config/prisma.config"));
const http_response_1 = require("../common/http.response");
const bcrypt_service_1 = require("../auth/bcrypt.service");
const user_mapper_1 = require("./mappers/user.mapper");
const validator_1 = __importDefault(require("validator"));
const number_1 = require("../common/utils/number");
const prisma_company_repository_1 = require("../company/prisma-company.repository");
const jwt_service_1 = require("../auth/jwt.service");
const detailuserservice_service_1 = require("../detailsUserCompany/detailuserservice.service");
const largeMinEleven_1 = require("../common/utils/largeMinEleven");
const user_validation_1 = require("./user.validation");
const rol_validation_1 = require("../rol/rol.validation");
const company_validation_1 = require("../company/company.validation");
const email_1 = require("../common/utils/email");
const prisma_rol_repository_1 = require("../rol/prisma-rol.repository");
const action_validation_1 = require("@/action/action.validation");
const detail_user_company_validation_1 = require("@/detailsUserCompany/detail-user-company.validation");
const project_validation_1 = require("@/project/project.validation");
const detailUserProject_validation_1 = require("./detailUserProject/detailUserProject.validation");
class UserService {
    findAll(data, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (data.queryParams.page - 1) * data.queryParams.limit;
                const userTokenResponse = yield jwt_service_1.jwtService.getUserFromToken(token);
                if (!userTokenResponse)
                    return userTokenResponse;
                const userResponse = userTokenResponse.payload;
                const result = yield prisma_user_repository_1.prismaUserRepository.findAll(skip, data.queryParams.limit, data.queryParams.name, userResponse);
                const { userAll, total } = result;
                // const usersMapped = users.map(
                //   (user: Usuario) => new UserResponseMapper(user)
                // );
                //numero de pagina donde estas
                const pageCount = Math.ceil(total / data.queryParams.limit);
                const formData = {
                    total,
                    page: data.queryParams.page,
                    // x ejemplo 20
                    limit: data.queryParams.limit,
                    //cantidad de paginas que hay
                    pageCount,
                    data: userAll,
                };
                return http_response_1.httpResponse.SuccessResponse("Éxito al traer todos los usuarios", formData);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al traer los usuarios", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    findAllUserCompany(data, company_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (data.queryParams.page - 1) * data.queryParams.limit;
                let rol = null;
                const companyResponse = yield company_validation_1.companyValidation.findById(company_id);
                if (!companyResponse.success) {
                    return companyResponse;
                }
                const company = companyResponse.payload;
                const detailResponse = yield detail_user_company_validation_1.detailUserCompanyValidation.findByIdCompany(company.id);
                if (!detailResponse.success) {
                    const formData = {
                        total: 0,
                        page: 1,
                        limit: data.queryParams.limit,
                        pageCount: 0,
                        data: [],
                    };
                    return http_response_1.httpResponse.SuccessResponse("No se encontraron resultados", formData);
                }
                if (data.queryParams.rol) {
                    const rolResponse = yield rol_validation_1.rolValidation.findByName(data.queryParams.rol);
                    if (!rolResponse.success)
                        return rolResponse;
                    rol = rolResponse.payload;
                }
                const result = yield prisma_user_repository_1.prismaUserRepository.getUsersForCompany(skip, data, rol, company.id);
                const { userAll, total } = result;
                const pageCount = Math.ceil(total / data.queryParams.limit);
                const formData = {
                    total,
                    page: data.queryParams.page,
                    limit: data.queryParams.limit,
                    pageCount,
                    data: userAll,
                };
                return http_response_1.httpResponse.SuccessResponse("Éxito al traer todos los Usuarios de la empresa", formData);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al traer los Usuarios de la empresa", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    verifyLargeDni(dni) {
        if (dni.length < 8) {
            return true;
        }
        else {
            return false;
        }
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseEmail = yield user_validation_1.userValidation.findByEmail(data.email);
                if (!responseEmail.success)
                    return http_response_1.httpResponse.BadRequestException(`El email ingresado ya existe`);
                const responseByDni = yield user_validation_1.userValidation.findByDni(data.dni);
                if (responseByDni.success)
                    return http_response_1.httpResponse.BadRequestException(`El usuario con el dni ${data.dni} ya existe`);
                const resultDni = (0, number_1.lettersInNumbers)(data.dni);
                if (resultDni) {
                    return http_response_1.httpResponse.BadRequestException("El campo dni debe contener solo números");
                }
                const resultPhone = (0, number_1.lettersInNumbers)(data.telefono);
                if (resultPhone) {
                    return http_response_1.httpResponse.BadRequestException("El campo telefono debe contener solo números");
                }
                const hashContrasena = bcrypt_service_1.bcryptService.hashPassword(data.contrasena);
                const role = yield prisma_rol_repository_1.prismaRolRepository.existsName("USER");
                if (!role) {
                    return http_response_1.httpResponse.BadRequestException("El Rol que deseas buscar no existe");
                }
                const userFormat = Object.assign(Object.assign({}, data), { contrasena: hashContrasena, limite_proyecto: Number(data.limite_proyecto), limite_usuarios: Number(data.limite_usuarios), rol_id: role.id });
                const resultUser = yield prisma_user_repository_1.prismaUserRepository.createUser(userFormat);
                return http_response_1.httpResponse.CreatedResponse("Usuario creado correctamente", resultUser);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear usuario", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    createUserAndCompany(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseEmailUser = yield user_validation_1.userValidation.findByEmail(data.email);
                if (!responseEmailUser.success)
                    return http_response_1.httpResponse.BadRequestException(`El email ingresado ya existe`);
                const responseByDni = yield user_validation_1.userValidation.findByDni(data.dni);
                if (responseByDni.success)
                    return http_response_1.httpResponse.BadRequestException(`El usuario con el dni ${data.dni} ya existe`);
                if (!validator_1.default.isEmail(data.email)) {
                    return http_response_1.httpResponse.BadRequestException("El formato del email ingresado no es válido");
                }
                const resultDni = (0, number_1.lettersInNumbers)(data.dni);
                if (resultDni) {
                    return http_response_1.httpResponse.BadRequestException("El campo dni debe contener solo números");
                }
                const resultPhone = (0, number_1.lettersInNumbers)(data.telefono);
                if (resultPhone) {
                    return http_response_1.httpResponse.BadRequestException("El campo telefono debe contener solo números");
                }
                const resultLimitProject = (0, number_1.lettersInNumbers)(data.limite_proyecto);
                if (resultLimitProject) {
                    return http_response_1.httpResponse.BadRequestException("El campo limite proyecto debe contener solo números");
                }
                const resultLimitUsers = (0, number_1.lettersInNumbers)(data.limite_usuarios);
                if (resultLimitUsers) {
                    return http_response_1.httpResponse.BadRequestException("El campo limite usuarios debe contener solo números");
                }
                const resultRuc = (0, number_1.lettersInNumbers)(data.ruc);
                if (resultRuc) {
                    return http_response_1.httpResponse.BadRequestException("El campo Ruc debe contener solo números");
                }
                const resultRucLength = (0, largeMinEleven_1.largeMinEleven)(data.ruc);
                if (resultRucLength) {
                    return http_response_1.httpResponse.BadRequestException("El campo Ruc debe contener por lo menos 11 caracteres");
                }
                const resultPhoneCompany = (0, number_1.lettersInNumbers)(data.telefono_empresa);
                if (resultPhoneCompany) {
                    return http_response_1.httpResponse.BadRequestException("El campo telefono de la empresa debe contener solo números");
                }
                const existNameCompany = yield company_validation_1.companyValidation.findByName(data.nombre_empresa);
                if (!existNameCompany.success)
                    return existNameCompany;
                const resultEmail = (0, email_1.emailValid)(data.email_empresa);
                if (!resultEmail) {
                    return http_response_1.httpResponse.BadRequestException("El Correo de la empresa ingresado no es válido");
                }
                const responseEmailCompany = yield company_validation_1.companyValidation.findByEmail(data.email_empresa);
                if (!responseEmailCompany.success)
                    return responseEmailCompany;
                const hashContrasena = bcrypt_service_1.bcryptService.hashPassword(data.contrasena);
                const role = yield prisma_rol_repository_1.prismaRolRepository.existsName("USER");
                if (!role) {
                    return http_response_1.httpResponse.BadRequestException("El Rol que deseas buscar no existe");
                }
                let userFormat;
                userFormat = {
                    email: data.email,
                    dni: data.dni,
                    nombre_completo: data.nombre_completo,
                    telefono: data.telefono_empresa,
                    contrasena: hashContrasena,
                    limite_proyecto: Number(data.limite_proyecto),
                    limite_usuarios: Number(data.limite_usuarios),
                    rol_id: role.id,
                };
                const resultUser = yield prisma_user_repository_1.prismaUserRepository.createUser(userFormat);
                const companyFormat = {
                    nombre_empresa: data.nombre_empresa,
                    descripcion_empresa: data.descripcion_empresa,
                    ruc: data.ruc,
                    direccion_fiscal: data.direccion_empresa_fiscal,
                    direccion_oficina: data.direccion_empresa_oficina,
                    nombre_corto: data.nombre_corto_empresa,
                    telefono: data.telefono_empresa,
                    correo: data.email_empresa,
                    contacto_responsable: data.contacto_responsable,
                    usuario_id: resultUser.id,
                };
                const resultCompany = yield prisma_company_repository_1.prismaCompanyRepository.createCompany(companyFormat);
                const resultUserAndCompany = {
                    usuario: resultUser,
                    empresa: resultCompany,
                };
                return http_response_1.httpResponse.CreatedResponse("Usuario y empresa creadas correctamente", resultUserAndCompany);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear usuario y la empresa ", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    updateUserAndCompany(data, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseUser = yield user_validation_1.userValidation.findById(user_id);
                if (!responseUser.success) {
                    return responseUser;
                }
                const user = responseUser.payload;
                const responseCompany = yield company_validation_1.companyValidation.findByIdUser(user.id);
                if (!responseCompany.success) {
                    return responseCompany;
                }
                const company = responseCompany.payload;
                if (user.email != data.email) {
                    const responseEmailUser = yield user_validation_1.userValidation.findByEmail(data.email);
                    if (!responseEmailUser.success)
                        return responseEmailUser;
                }
                if (user.dni != data.dni) {
                    const responseByDni = yield user_validation_1.userValidation.findByDni(data.dni);
                    if (responseByDni.success)
                        return responseByDni;
                }
                if (!validator_1.default.isEmail(data.email)) {
                    return http_response_1.httpResponse.BadRequestException("El formato del email ingresado no es válido");
                }
                const resultDni = (0, number_1.lettersInNumbers)(data.dni);
                if (resultDni) {
                    return http_response_1.httpResponse.BadRequestException("El campo dni debe contener solo números");
                }
                const resultPhone = (0, number_1.lettersInNumbers)(data.telefono);
                if (resultPhone) {
                    return http_response_1.httpResponse.BadRequestException("El campo telefono debe contener solo números");
                }
                const resultLimitProject = (0, number_1.lettersInNumbers)(data.limite_proyecto);
                if (resultLimitProject) {
                    return http_response_1.httpResponse.BadRequestException("El campo limite proyecto debe contener solo números");
                }
                const resultLimitUsers = (0, number_1.lettersInNumbers)(data.limite_usuarios);
                if (resultLimitUsers) {
                    return http_response_1.httpResponse.BadRequestException("El campo limite usuarios debe contener solo números");
                }
                const resultRuc = (0, number_1.lettersInNumbers)(data.ruc);
                if (resultRuc) {
                    return http_response_1.httpResponse.BadRequestException("El campo Ruc debe contener solo números");
                }
                const resultRucLength = (0, largeMinEleven_1.largeMinEleven)(data.ruc);
                if (resultRucLength) {
                    return http_response_1.httpResponse.BadRequestException("El campo Ruc debe contener por lo menos 11 caracteres");
                }
                const resultPhoneCompany = (0, number_1.lettersInNumbers)(data.telefono_empresa);
                if (resultPhoneCompany) {
                    return http_response_1.httpResponse.BadRequestException("El campo telefono de la empresa debe contener solo números");
                }
                if (company.nombre_empresa != data.nombre_empresa) {
                    const existNameCompany = yield company_validation_1.companyValidation.findByName(data.nombre_empresa);
                    if (!existNameCompany.success)
                        return existNameCompany;
                }
                if (company.nombre_corto != data.nombre_corto_empresa) {
                    const responseNameShort = yield company_validation_1.companyValidation.findByNameShort(data.nombre_corto_empresa);
                    if (!responseNameShort.success)
                        return responseNameShort;
                }
                const resultEmail = (0, email_1.emailValid)(data.email_empresa);
                if (!resultEmail) {
                    return http_response_1.httpResponse.BadRequestException("El Correo de la empresa ingresado no es válido");
                }
                if (company.correo != data.email_empresa) {
                    const responseEmailCompany = yield company_validation_1.companyValidation.findByEmail(data.email_empresa);
                    if (!responseEmailCompany.success)
                        return responseEmailCompany;
                }
                let hashContrasena;
                let userFormat = {};
                const role = yield prisma_rol_repository_1.prismaRolRepository.existsName("USER");
                if (!role) {
                    return http_response_1.httpResponse.BadRequestException("El Rol que deseas buscar no existe");
                }
                userFormat = {
                    email: data.email,
                    dni: data.dni,
                    nombre_completo: data.nombre_completo,
                    telefono: data.telefono_empresa,
                    eliminado: data.eliminado,
                    limite_proyecto: Number(data.limite_proyecto),
                    limite_usuarios: Number(data.limite_usuarios),
                    rol_id: role.id,
                };
                if (data.contrasena !== "") {
                    hashContrasena = bcrypt_service_1.bcryptService.hashPassword(data.contrasena);
                    userFormat.contrasena = hashContrasena;
                }
                const resultUser = yield prisma_user_repository_1.prismaUserRepository.updateUser(userFormat, user.id);
                const companyFormat = {
                    nombre_empresa: data.nombre_empresa,
                    descripcion_empresa: data.descripcion_empresa,
                    ruc: data.ruc,
                    direccion_fiscal: data.direccion_empresa_fiscal,
                    direccion_oficina: data.direccion_empresa_oficina,
                    nombre_corto: data.nombre_corto_empresa,
                    telefono: data.telefono_empresa,
                    correo: data.email_empresa,
                    contacto_responsable: data.contacto_responsable,
                    usuario_id: resultUser.id,
                };
                const resultCompany = yield prisma_company_repository_1.prismaCompanyRepository.updateCompany(companyFormat, company.id);
                const resultUserAndCompany = {
                    usuario: resultUser,
                    empresa: resultCompany,
                };
                return http_response_1.httpResponse.CreatedResponse("Usuario y empresa modificados correctamente", resultUserAndCompany);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al modificar usuario y la empresa ", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    usersToCompany(data, tokenWithBearer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userTokenResponse = yield jwt_service_1.jwtService.getUserFromToken(tokenWithBearer);
                if (!userTokenResponse)
                    return userTokenResponse;
                const userResponse = userTokenResponse.payload;
                const resultCompanyFindByUser = yield company_validation_1.companyValidation.findByUserForCompany(userResponse.id);
                if (!resultCompanyFindByUser.success) {
                    return http_response_1.httpResponse.UnauthorizedException("No tiene acceso para crear usuarios");
                }
                const company = resultCompanyFindByUser.payload;
                const usersToCompany = yield detail_user_company_validation_1.detailUserCompanyValidation.totalUserByCompany(company.id);
                //[NOTE] COMENTE ESTO XQ SI NO TENES EMPRESA EN DETALLE TE LARGA ERROR X EJEMPLO SI LO CREABA EL ADMIN TE LARGARIA ERROR
                // if (!usersToCompany.success) {
                //   return usersToCompany;
                // }
                const totalUsersCompany = usersToCompany.payload;
                if (totalUsersCompany === userResponse.limite_usuarios) {
                    return http_response_1.httpResponse.BadRequestException("Haz alcanzado el limite usuarios que puedes ingresar");
                }
                const responseEmail = yield user_validation_1.userValidation.findByEmail(data.email);
                if (!responseEmail.success)
                    return http_response_1.httpResponse.BadRequestException(`El email ingresado ya existe`);
                const responseByDni = yield user_validation_1.userValidation.findByDni(data.dni);
                if (responseByDni.success)
                    return http_response_1.httpResponse.BadRequestException(`El usuario con el dni ${data.dni} ya existe`);
                const rolResponse = yield rol_validation_1.rolValidation.findByName("NO_ASIGNADO");
                if (!rolResponse.success) {
                    return rolResponse;
                }
                const rol = rolResponse.payload;
                const resultDni = (0, number_1.lettersInNumbers)(data.dni);
                if (resultDni) {
                    return http_response_1.httpResponse.BadRequestException("El campo dni debe contener solo números");
                }
                const resultPhone = (0, number_1.lettersInNumbers)(data.telefono);
                if (resultPhone) {
                    return http_response_1.httpResponse.BadRequestException("El campo telefono debe contener solo números");
                }
                const hashContrasena = bcrypt_service_1.bcryptService.hashPassword(data.contrasena);
                const userFormat = Object.assign(Object.assign({}, data), { contrasena: hashContrasena, limite_proyecto: Number(0), limite_usuarios: Number(0), rol_id: rol.id });
                const resultUser = yield prisma_user_repository_1.prismaUserRepository.createUser(userFormat);
                const detailUserCompany = yield detailuserservice_service_1.detailUserCompanyService.createDetail(resultUser.id, company === null || company === void 0 ? void 0 : company.id);
                return http_response_1.httpResponse.CreatedResponse("El detalle usuario-empresa fue creado correctamente", detailUserCompany.payload);
                // const resultCompanyFindByUser =
                //   await prismaCompanyRepository.findCompanyByUser(userResponse.id);
                // if (resultCompanyFindByUser) {
                //   const detailUserCompany = await detailUserCompanyService.createDetail(
                //     resultUser.id,
                //     resultCompanyFindByUser?.id
                //   );
                //   return httpResponse.CreatedResponse(
                //     "El detalle usuario-empresa fue creado correctamente",
                //     detailUserCompany.payload
                //   );
                // } else {
                //   return httpResponse.BadRequestException(
                //     "No se encontró el id de la empresa del usuario logueado",
                //     null
                //   );
                // }
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear el usuario", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    createPermissions(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseUser = yield user_validation_1.userValidation.findById(+data.user_id);
                if (!responseUser) {
                    return responseUser;
                }
                const responseRol = yield rol_validation_1.rolValidation.findById(+data.rol_id);
                if (!responseRol) {
                    return responseUser;
                }
                const responseProject = yield project_validation_1.projectValidation.findById(data.project_id);
                if (!responseProject.success)
                    return responseProject;
                // const action = await actionValidation.findByName("LECTURA");
                const responseSection = yield section_validation_1.sectionValidation.findById(+data.section.id);
                if (!responseSection) {
                    return responseSection;
                }
                for (let i = 0; i < data.actions.length; i++) {
                    const responseAction = yield action_validation_1.actionValidation.findById(+data.actions[i].id);
                    if (!responseAction) {
                        return responseAction;
                    }
                }
                const responsePermissions = yield prisma_user_repository_1.prismaUserRepository.assignUserPermissions(data);
                // const { detalleUsuarioProyecto, permisos } = responsePermissions;
                return http_response_1.httpResponse.CreatedResponse("El detalle usuario-empresa fue creado correctamente", responsePermissions);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear los permisos del Usuarios", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma_user_repository_1.prismaUserRepository.existsEmail(email);
                // este error me valida que no esta el usuario
                if (!user) {
                    return http_response_1.httpResponse.NotFoundException("Usuario no encontrado");
                }
                return http_response_1.httpResponse.SuccessResponse("Usuario encontrado", user);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar usuario", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    findByDni(dni) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma_user_repository_1.prismaUserRepository.findByDni(dni);
                // este error me valida que no esta el usuario
                if (!user) {
                    return http_response_1.httpResponse.NotFoundException("Usuario no encontrado");
                }
                return http_response_1.httpResponse.SuccessResponse("Usuario encontrado", user);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar usuario", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
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
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    updateUser(data, idUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userResponse = yield user_validation_1.userValidation.findById(idUser);
                if (!userResponse.success) {
                    return userResponse;
                }
                const userFind = userResponse.payload;
                if (userFind.email != data.email) {
                    const responseEmail = yield user_validation_1.userValidation.findByEmail(data.email);
                    if (!responseEmail.success) {
                        return http_response_1.httpResponse.BadRequestException(`El email ingresado ya existe`);
                    }
                }
                if (userFind.dni != data.dni) {
                    const responseByDni = yield user_validation_1.userValidation.findByDni(data.dni);
                    if (responseByDni.success) {
                        return http_response_1.httpResponse.BadRequestException(`El usuario con el dni ${data.dni} ya existe`);
                    }
                }
                const resultDni = (0, number_1.lettersInNumbers)(data.dni);
                if (resultDni) {
                    return http_response_1.httpResponse.BadRequestException("El dni ingresado solo debe contener números");
                }
                const resultPhone = (0, number_1.lettersInNumbers)(data.telefono);
                if (resultPhone) {
                    return http_response_1.httpResponse.BadRequestException("El teléfono ingresado solo debe contener números");
                }
                const roleResponse = yield rol_validation_1.rolValidation.findById(data.rol_id);
                if (!roleResponse.success)
                    return roleResponse;
                const resultRole = roleResponse.payload;
                let hashContrasena;
                let userFormat = Object.assign({}, data);
                if (data.contrasena && data.contrasena !== "") {
                    hashContrasena = bcrypt_service_1.bcryptService.hashPassword(data.contrasena);
                    userFormat.contrasena = hashContrasena;
                }
                else {
                    userFormat.contrasena = userFind.contrasena;
                }
                const result = yield prisma_user_repository_1.prismaUserRepository.updateUser(userFormat, idUser);
                const resultMapper = new user_mapper_1.UserResponseMapper(result);
                return http_response_1.httpResponse.CreatedResponse("Usuario modificado correctamente", resultMapper);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al actualizar el usuario", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    updateStatusUser(idUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userResponse = yield user_validation_1.userValidation.findById(idUser);
                if (!userResponse.success)
                    return userResponse;
                const result = yield prisma_user_repository_1.prismaUserRepository.updateStatusUser(idUser);
                const resultMapper = new user_mapper_1.UserResponseMapper(result);
                return http_response_1.httpResponse.SuccessResponse("Usuario eliminado correctamente", resultMapper);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al eliminar el usuario", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    updateRolUserAndCreateProyect(usuario_id, rol_id, projecto_id, action) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userResponse = yield user_validation_1.userValidation.findById(usuario_id);
                if (!userResponse.success)
                    return userResponse;
                const user = userResponse.payload;
                const projectResponse = yield project_validation_1.projectValidation.findById(projecto_id);
                if (!projectResponse.success)
                    return projectResponse;
                const project = projectResponse.payload;
                const rolResponse = yield rol_validation_1.rolValidation.findById(rol_id);
                if (!rolResponse.success)
                    return rolResponse;
                const result = yield prisma_user_repository_1.prismaUserRepository.updateRolUser(usuario_id, rol_id);
                if (action === "CREACION") {
                    const userExistInDetailProject = yield detailUserProject_validation_1.detailProjectValidation.findByIdUser(user.id, project.id);
                    if (userExistInDetailProject.success) {
                        return http_response_1.httpResponse.BadRequestException("El usuario ya tiene asignado un proyecto");
                    }
                    const detailFormat = {
                        usuario_id: usuario_id,
                        projecto_id: projecto_id,
                    };
                    const detailUserProject = yield detailUserProject_validation_1.detailProjectValidation.createDetailUserProject(detailFormat);
                    if (!detailUserProject.success)
                        return detailUserProject;
                    const resultMapper = new user_mapper_1.UserResponseMapper(result);
                    return http_response_1.httpResponse.SuccessResponse("Se ha cambiado de rol y se le ha asignado un Proyecto correctamente", resultMapper);
                }
                // const detailFormat = {
                //   usuario_id: usuario_id,
                //   projecto_id: projecto_id,
                // };
                // const detailUserProject =
                //   await detailProjectValidation.createDetailUserProject(detailFormat);
                // if (!detailUserProject.success) return detailUserProject;
                const resultMapper = new user_mapper_1.UserResponseMapper(result);
                return http_response_1.httpResponse.SuccessResponse("Se ha cambiado de rol correctamente", resultMapper);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al cambiar de rol", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    findByName(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (data.queryParams.page - 1) * data.queryParams.limit;
                const result = yield prisma_user_repository_1.prismaUserRepository.searchNameUser(name, skip, data.queryParams.limit);
                const { users, total } = result;
                const usersMapped = users.map((user) => new user_mapper_1.UserResponseMapper(user));
                const pageCount = Math.ceil(total / data.queryParams.limit);
                const formData = {
                    total,
                    page: data.queryParams.page,
                    // x ejemplo 20
                    limit: data.queryParams.limit,
                    //cantidad de paginas que hay
                    pageCount,
                    data: usersMapped,
                };
                return http_response_1.httpResponse.SuccessResponse("Éxito al buscar usuarios", formData);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException(" Error al buscar proyecto", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
}
exports.userService = new UserService();
