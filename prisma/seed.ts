import { bcryptService } from "../src/auth/bcrypt.service";
import prisma from "../src/config/prisma.config";
import { I_CreateRolBody, I_Rol } from "../src/rol/models/rol.interfaces";
import { I_CreateUserBD } from "../src/user/models/user.interface";
import { I_CreateCompanyAdminBody } from "../src/company/models/company.interface";
import { userValidation } from "../src/user/user.validation";
import { companyValidation } from "../src/company/company.validation";
import { rolValidation } from "../src/rol/rol.validation";
import { actionService } from "@/action/actionservice.service";
import { sectionService } from "@/section/section.service";

async function main() {
  const rolAdmin = {
    nombre_secundario: "SUPER ADMIN2",
    descripcion: "TIENE EL PODER DE TODO2",
    rol: "ADMIN",
  };
  const rolUser = {
    nombre_secundario: "USUARIO",
    descripcion: "TIENE EL PODER DE USUARIO",
    rol: "USER",
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
  await rolValidation.createRol(rolAdmin as I_CreateRolBody);
  await rolValidation.createRol(rolUser as I_CreateRolBody);
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
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
