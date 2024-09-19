import { rolService } from "../src/rol/rol.service";
import { bcryptService } from "../src/auth/bcrypt.service";
import prisma from "../src/config/prisma.config";
import { I_CreateRolBody, I_Rol } from "../src/rol/models/rol.interfaces";
import { I_CreateUserBD } from "../src/user/models/user.interface";
import { userService } from "../src/user/user.service";
import { companyService } from "../src/company/company.service";
import { I_CreateCompanyAdminBody } from "../src/company/models/company.interface";

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

  await rolService.createRol(rolAdmin as I_CreateRolBody);
  await rolService.createRol(rolUser as I_CreateRolBody);
  await userService.createUserAsAdmin(user as I_CreateUserBD);
  await companyService.createCompanyOfTheAdmin(
    company as I_CreateCompanyAdminBody
  );
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
