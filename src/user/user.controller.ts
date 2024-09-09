import { T_FindAll } from "../common/models/pagination.types";
import express from "@/config/express.config";
import {
  I_CreateUserAndCompany,
  I_CreateUserAndCompanyBody,
  I_CreateUserBody,
  I_UpdateUserBody,
} from "./models/user.interface";
import { userService } from "./user.service";
import { httpResponse } from "@/common/http.response";
import { CompanyMulterProperties } from "@/company/models/company.constant";
import multer from "multer";
import { authService } from "@/auth/auth.service";
import path from "path";
import appRootPath from "app-root-path";
import sharp from "sharp";

//los archivos subidos serán almacenados directamente en la memoria (RAM) en lugar de ser guardados en el disco duro.
// esto es útil por si lo querés analizar o guardar en algun lugar
const storage = multer.memoryStorage();
const upload: any = multer({ storage: storage });

class UserController {
  async createUser(request: express.Request, response: express.Response) {
    const data = request.body as I_CreateUserBody;
    const result = await userService.createUser(data);
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  createUserandCompany = async (
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction
  ) => {
    upload.single(CompanyMulterProperties.field)(
      request,
      response,
      async (error: any) => {
        if (error) {
          const customError = httpResponse.BadRequestException(
            "Error al procesar la imagen ",
            error
          );
          response.status(customError.statusCode).json(customError);
        } else {
          try {
            const responseValidate = authService.verifyRolProject(
              request.get("Authorization") as string
            );
            if (!responseValidate?.success) {
              return response.status(401).json(responseValidate);
            } else {
              // userAndCompanyDto.parse(request.body);
              const data = request.body as I_CreateUserAndCompany;
              const result = await userService.createUserAndCompany(data);
              if (!result.success) {
                response.status(result.statusCode).json(result);
              } else {
                const responseUserAndCompany =
                  result.payload as I_CreateUserAndCompanyBody;
                if (request.file) {
                  const id = responseUserAndCompany.empresa.id;
                  const direction = path.join(
                    appRootPath.path,
                    "static",
                    CompanyMulterProperties.folder
                  );
                  const ext = ".png";
                  const fileName = `${CompanyMulterProperties.folder}_${id}${ext}`;
                  const filePath = path.join(direction, fileName);
                  sharp(request.file.buffer)
                    .resize({ width: 800 })
                    .toFormat("png")
                    .toFile(filePath, (err) => {
                      if (err) {
                        const customError = httpResponse.BadRequestException(
                          "Error al guardar la imagen de la empresa",
                          err
                        );
                        response
                          .status(customError.statusCode)
                          .json(customError);
                      } else {
                        response.status(result.statusCode).json(result);
                      }
                    });
                } else {
                  response.status(result.statusCode).json(result);
                }
              }
            }
          } catch (error) {
            console.log(error);
            const customError = httpResponse.BadRequestException(
              " Error al validar los campos al crear el usuario y la empresa",
              error
            );
            response.status(customError.statusCode).json(customError);
          }
        }
      }
    );
  };

  async createUserAndSearchToken(
    request: express.Request,
    response: express.Response
  ) {
    const data = request.body as I_UpdateUserBody;
    const tokenWithBearer = request.headers.authorization;
    if (tokenWithBearer) {
      const result = await userService.usersToCompany(data, tokenWithBearer);
      if (!result.success) {
        response.status(result.statusCode).json(result);
      } else {
        response.status(result.statusCode).json(result);
      }
    } else {
      const result = httpResponse.UnauthorizedException(
        "Error en la autenticacion al crear el usuario"
      );
      response.status(result.statusCode).json(result);
    }
  }

  async update(request: express.Request, response: express.Response) {
    const data = request.body as I_UpdateUserBody;
    const idUser = Number(request.params.id);
    const result = await userService.updateUser(data, idUser);
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async updateStatus(request: express.Request, response: express.Response) {
    const idUser = Number(request.params.id);
    const result = await userService.updateStatusUser(idUser);
    response.status(result.statusCode).json(result);
  }

  async findByIdUser(request: express.Request, response: express.Response) {
    const idUser = Number(request.params.id);
    const result = await userService.findById(idUser);
    response.status(result.statusCode).json(result);
  }

  async findByName(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    let paginationOptions: T_FindAll = {
      queryParams: {
        page: page,
        limit: limit,
      },
    };
    //si buscaba como request.body no me llegaba bien para luego buscar
    const name = request.query.name as string;
    const result = await userService.findByName(name, paginationOptions);
    response.status(result.statusCode).json(result);
  }

  async allUsers(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    let paginationOptions: T_FindAll = {
      queryParams: {
        page: page,
        limit: limit,
      },
    };
    const result = await userService.findAll(paginationOptions);
    response.status(result.statusCode).json(result);
  }
}

export const userController = new UserController();
