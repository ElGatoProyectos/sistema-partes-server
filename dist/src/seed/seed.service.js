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
exports.seedService = void 0;
const actionservice_service_1 = require("@/action/actionservice.service");
const bcrypt_service_1 = require("@/auth/bcrypt.service");
const http_response_1 = require("@/common/http.response");
const company_validation_1 = require("@/company/company.validation");
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
const rol_validation_1 = require("@/rol/rol.validation");
const section_service_1 = require("@/section/section.service");
const user_validation_1 = require("@/user/user.validation");
class SeedService {
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rol_admin = {
                    nombre_secundario: "SUPER ADMIN2",
                    descripcion: "TIENE EL PODER DE TODO2",
                    rol: "ADMIN",
                };
                const rol_user = {
                    nombre_secundario: "USUARIO",
                    descripcion: "TIENE EL PODER DE USUARIO",
                    rol: "USER",
                };
                const rol_gerente_proyecto = {
                    nombre_secundario: "GERENTE_PROYECTO",
                    descripcion: "Es el gerente del proyecto",
                    rol: "GERENTE_PROYECTO",
                };
                const rol_residencia = {
                    nombre_secundario: "RESIDENCIA",
                    descripcion: "RESIDENCIA",
                    rol: "RESIDENCIA",
                };
                const rol_control_costos = {
                    nombre_secundario: "CONTROL_COSTOS",
                    descripcion: "Es el que hace control de costos",
                    rol: "CONTROL_COSTOS",
                };
                const rol_asistente_control_costos = {
                    nombre_secundario: "ASISTENTE_CONTROL_COSTOS",
                    descripcion: "Es el asistente del control de costos",
                    rol: "ASISTENTE_CONTROL_COSTOS",
                };
                const rol_ingeniero_produccion = {
                    nombre_secundario: "INGENIERO_PRODUCCION",
                    descripcion: "Es el ingeniero de producción",
                    rol: "INGENIERO_PRODUCCION",
                };
                const rol_asistente_produccion = {
                    nombre_secundario: "ASISTENTE_PRODUCCION",
                    descripcion: "Es el asistente de producción",
                    rol: "ASISTENTE_PRODUCCION",
                };
                const rol_maestro_obra = {
                    nombre_secundario: "MAESTRO_OBRA",
                    descripcion: "Es el maestro de obra",
                    rol: "MAESTRO_OBRA",
                };
                const rol_capataz = {
                    nombre_secundario: "CAPATAZ",
                    descripcion: "Es el capataz",
                    rol: "CAPATAZ",
                };
                const rol_administracion_obra = {
                    nombre_secundario: "ADMINISTRACION_OBRA",
                    descripcion: "Es el que administra la obra",
                    rol: "ADMINISTRACION_OBRA",
                };
                const rol_ingeniero_ssomma = {
                    nombre_secundario: "INGENIERO_SSOMMA",
                    descripcion: "Es el ingeniero ssomma",
                    rol: "INGENIERO_SSOMMA",
                };
                const rol_asistente_ssomma = {
                    nombre_secundario: "ASISTENTE_SSOMMA",
                    descripcion: "Es el asistente ssomma",
                    rol: "ASISTENTE_SSOMMA",
                };
                const rol_logistica = {
                    nombre_secundario: "LOGISTICA",
                    descripcion: "Es el de logistica",
                    rol: "LOGISTICA",
                };
                const rol_asistente_almacen = {
                    nombre_secundario: "ASISTENTE_ALMACEN",
                    descripcion: "Es el asistente de almacen",
                    rol: "ASISTENTE_ALMACEN",
                };
                const user = {
                    email: "ale@gmail.com",
                    dni: "12345678",
                    nombre_completo: "Don Alejandro",
                    telefono: "26112345677",
                    contrasena: bcrypt_service_1.bcryptService.hashPassword("1234567"),
                    limite_proyecto: 0,
                    limite_usuarios: 0,
                };
                const company = {
                    nombre_empresa: "Gestión de Partes",
                    descripcion_empresa: "Construcciones",
                    ruc: "12345678",
                    direccion_fiscal: "Perú",
                    direccion_oficina: "Lima",
                    nombre_corto: "GP",
                    telefono: "12345678",
                    correo: "gestionpartes@gmail.com",
                    contacto_responsable: "Armando",
                };
                //SECCIONES
                const seccion1 = {
                    nombre: "TREN",
                };
                const seccion2 = {
                    nombre: "REPORTE_TREN",
                };
                const seccion3 = {
                    nombre: "UNIDAD_DE_PRODUCCION",
                };
                const seccion4 = {
                    nombre: "USUARIO",
                };
                const seccion5 = {
                    nombre: "UNIDAD",
                };
                const seccion6 = {
                    nombre: "PARTIDA",
                };
                const seccion7 = {
                    nombre: "REPORTE_PARTIDA",
                };
                const seccion8 = {
                    nombre: "TRABAJOS",
                };
                const seccion9 = {
                    nombre: "MANO_DE_OBRA",
                };
                const seccion10 = {
                    nombre: "RECURSOS",
                };
                const seccion11 = {
                    nombre: "ASISTENCIA",
                };
                const seccion12 = {
                    nombre: "TRABAJOS_DEL_PROYECTO",
                };
                const seccion13 = {
                    nombre: "PARTE_DIARIO",
                };
                const seccion14 = {
                    nombre: "PARTE_DIARIO_PARTIDA",
                };
                const seccion15 = {
                    nombre: "PARTE_DIARIO_MANO_DE_OBRA",
                };
                const seccion16 = {
                    nombre: "PARTE_DIARIO_MATERIALES",
                };
                const seccion17 = {
                    nombre: "PARTE_DIARIO_EQUIPOS",
                };
                const seccion18 = {
                    nombre: "PARTE_DIARIO_SUBCONTRATAS",
                };
                const seccion19 = {
                    nombre: "PARTE_DIARIO_FOTOS",
                };
                const seccion20 = {
                    nombre: "PARTE_DIARIO_SEGUN_TRABAJO",
                };
                const seccion21 = {
                    nombre: "TABLA_PRECIOS",
                };
                const seccion22 = {
                    nombre: "TAREO_SEMANAL",
                };
                const seccion23 = {
                    nombre: "CONTROL_PRODUCCION",
                };
                const seccion24 = {
                    nombre: "RESTRICCION_DEL_TRABAJO",
                };
                //ACCIONES
                const accion1 = {
                    nombre: "LECTURA",
                };
                const accion2 = {
                    nombre: "BUSCAR",
                };
                const accion3 = {
                    nombre: "CREACION",
                };
                const accion4 = {
                    nombre: "EDICION",
                };
                const accion5 = {
                    nombre: "ELIMINACION",
                };
                const accion6 = {
                    nombre: "CARGAR_EXCEL",
                };
                yield rol_validation_1.rolValidation.createRol(rol_admin);
                yield rol_validation_1.rolValidation.createRol(rol_user);
                yield rol_validation_1.rolValidation.createRol(rol_gerente_proyecto);
                yield rol_validation_1.rolValidation.createRol(rol_residencia);
                yield rol_validation_1.rolValidation.createRol(rol_control_costos);
                yield rol_validation_1.rolValidation.createRol(rol_asistente_control_costos);
                yield rol_validation_1.rolValidation.createRol(rol_ingeniero_produccion);
                yield rol_validation_1.rolValidation.createRol(rol_asistente_produccion);
                yield rol_validation_1.rolValidation.createRol(rol_maestro_obra);
                yield rol_validation_1.rolValidation.createRol(rol_capataz);
                yield rol_validation_1.rolValidation.createRol(rol_administracion_obra);
                yield rol_validation_1.rolValidation.createRol(rol_ingeniero_ssomma);
                yield rol_validation_1.rolValidation.createRol(rol_asistente_ssomma);
                yield rol_validation_1.rolValidation.createRol(rol_logistica);
                yield rol_validation_1.rolValidation.createRol(rol_asistente_almacen);
                yield user_validation_1.userValidation.createUserAsAdmin(user);
                yield company_validation_1.companyValidation.createCompanyOfTheAdmin(company);
                yield section_service_1.sectionService.createSection(seccion1);
                yield section_service_1.sectionService.createSection(seccion2);
                yield section_service_1.sectionService.createSection(seccion3);
                yield section_service_1.sectionService.createSection(seccion4);
                yield section_service_1.sectionService.createSection(seccion5);
                yield section_service_1.sectionService.createSection(seccion6);
                yield section_service_1.sectionService.createSection(seccion7);
                yield section_service_1.sectionService.createSection(seccion8);
                yield section_service_1.sectionService.createSection(seccion9);
                yield section_service_1.sectionService.createSection(seccion10);
                yield section_service_1.sectionService.createSection(seccion11);
                yield section_service_1.sectionService.createSection(seccion12);
                yield section_service_1.sectionService.createSection(seccion13);
                yield section_service_1.sectionService.createSection(seccion14);
                yield section_service_1.sectionService.createSection(seccion15);
                yield section_service_1.sectionService.createSection(seccion16);
                yield section_service_1.sectionService.createSection(seccion17);
                yield section_service_1.sectionService.createSection(seccion18);
                yield section_service_1.sectionService.createSection(seccion19);
                yield section_service_1.sectionService.createSection(seccion20);
                yield section_service_1.sectionService.createSection(seccion21);
                yield section_service_1.sectionService.createSection(seccion22);
                yield section_service_1.sectionService.createSection(seccion23);
                yield section_service_1.sectionService.createSection(seccion24);
                yield actionservice_service_1.actionService.createAction(accion1);
                yield actionservice_service_1.actionService.createAction(accion2);
                yield actionservice_service_1.actionService.createAction(accion3);
                yield actionservice_service_1.actionService.createAction(accion4);
                yield actionservice_service_1.actionService.createAction(accion5);
                yield actionservice_service_1.actionService.createAction(accion6);
                return http_response_1.httpResponse.SuccessResponse("Éxito al crear roles,secciones, acciones, usuario y empresa");
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear roles,secciones, acciones, usuario y empresa", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
}
exports.seedService = new SeedService();
