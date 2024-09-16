import prisma from "../src/config/prisma.config";
import { I_CreateRolBody, I_Rol } from "../src/rol/models/rol.interfaces";
import { rolValidation } from "../src/rol/rol.validation";
import { I_CreateUserBD } from "../src/user/models/user.interface";
import { userValidation } from "../src/user/user.validation";

async function main() {
  const rol = {
    nombre_secundario: "SUPER ADMIN2",
    descripcion: "TIENE EL PODER DE TODO2",
    rol: "ADMIN",
  };
  const user = {
    email: "ale@gmail.com",
    dni: "12345678",
    nombre_completo: "Don Alejandro",
    telefono: "26112345677",
    contrasena: "123456",
    limite_proyecto: 0,
    limite_usuarios: 0,
    rol_id: 1,
  };

  await rolValidation.createRol(rol as I_CreateRolBody);
  await userValidation.createUser(user as I_CreateUserBD);
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
