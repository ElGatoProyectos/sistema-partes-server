import { actionService } from "@/action/actionservice.service";
import { bcryptService } from "@/auth/bcrypt.service";
import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { companyValidation } from "@/company/company.validation";
import { I_CreateCompanyAdminBody } from "@/company/models/company.interface";
import prisma from "@/config/prisma.config";
import { I_CreateRolBody } from "@/rol/models/rol.interfaces";
import { rolValidation } from "@/rol/rol.validation";
import { sectionService } from "@/section/section.service";
import { I_CreateUserBD } from "@/user/models/user.interface";
import { userValidation } from "@/user/user.validation";

class SeedService {
  async create(): Promise<T_HttpResponse> {
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
        contrasena: bcryptService.hashPassword("1234567"),
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
      await rolValidation.createRol(rol_admin as I_CreateRolBody);
      await rolValidation.createRol(rol_user as I_CreateRolBody);
      await rolValidation.createRol(rol_gerente_proyecto as I_CreateRolBody);
      await rolValidation.createRol(rol_residencia as I_CreateRolBody);
      await rolValidation.createRol(rol_control_costos as I_CreateRolBody);
      await rolValidation.createRol(
        rol_asistente_control_costos as I_CreateRolBody
      );
      await rolValidation.createRol(
        rol_ingeniero_produccion as I_CreateRolBody
      );
      await rolValidation.createRol(
        rol_asistente_produccion as I_CreateRolBody
      );
      await rolValidation.createRol(rol_maestro_obra as I_CreateRolBody);
      await rolValidation.createRol(rol_capataz as I_CreateRolBody);
      await rolValidation.createRol(rol_administracion_obra as I_CreateRolBody);
      await rolValidation.createRol(rol_ingeniero_ssomma as I_CreateRolBody);
      await rolValidation.createRol(rol_asistente_ssomma as I_CreateRolBody);
      await rolValidation.createRol(rol_logistica as I_CreateRolBody);
      await rolValidation.createRol(rol_asistente_almacen as I_CreateRolBody);

      await userValidation.createUserAsAdmin(user as I_CreateUserBD);

      await companyValidation.createCompanyOfTheAdmin(
        company as I_CreateCompanyAdminBody
      );
      await sectionService.createSection(seccion1);
      await sectionService.createSection(seccion2);
      await sectionService.createSection(seccion3);
      await sectionService.createSection(seccion4);
      await sectionService.createSection(seccion5);
      await sectionService.createSection(seccion6);
      await sectionService.createSection(seccion7);
      await sectionService.createSection(seccion8);
      await sectionService.createSection(seccion9);
      await sectionService.createSection(seccion10);
      await sectionService.createSection(seccion11);
      await sectionService.createSection(seccion12);
      await sectionService.createSection(seccion13);
      await sectionService.createSection(seccion14);
      await sectionService.createSection(seccion15);
      await sectionService.createSection(seccion16);
      await sectionService.createSection(seccion17);
      await sectionService.createSection(seccion18);
      await sectionService.createSection(seccion19);
      await sectionService.createSection(seccion20);
      await sectionService.createSection(seccion21);
      await sectionService.createSection(seccion22);
      await sectionService.createSection(seccion23);
      await sectionService.createSection(seccion24);
      await actionService.createAction(accion1);
      await actionService.createAction(accion2);
      await actionService.createAction(accion3);
      await actionService.createAction(accion4);
      await actionService.createAction(accion5);
      await actionService.createAction(accion6);
      return httpResponse.SuccessResponse(
        "Éxito al crear roles,secciones, acciones, usuario y empresa"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear roles,secciones, acciones, usuario y empresa",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const seedService = new SeedService();
