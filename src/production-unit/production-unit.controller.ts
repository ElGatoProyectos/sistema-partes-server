// import { T_FindAll } from "../common/models/pagination.types";
// import express from "@/config/express.config";

// class UserController {
//   async create(request: express.Request, response: express.Response) {
//     const data = request.body as I_CreateProductionBody;
//     const result = await userService.createUser(data);
//     if (!result.success) {
//       response.status(result.statusCode).json(result);
//     } else {
//       response.status(result.statusCode).json(result);
//     }
//   }

//   async update(request: express.Request, response: express.Response) {
//     const data = request.body as I_UpdateUserBody;
//     const idUser = Number(request.params.id);
//     const result = await userService.updateUser(data, idUser);
//     if (!result.success) {
//       response.status(result.statusCode).json(result);
//     } else {
//       response.status(result.statusCode).json(result);
//     }
//   }

//   async updateStatus(request: express.Request, response: express.Response) {
//     const idUser = Number(request.params.id);
//     const result = await userService.updateStatusUser(idUser);
//     response.status(result.statusCode).json(result);
//   }

//   async findByIdUser(request: express.Request, response: express.Response) {
//     const idUser = Number(request.params.id);
//     const result = await userService.findById(idUser);
//     response.status(result.statusCode).json(result);
//   }

//   async findByName(request: express.Request, response: express.Response) {
//     const page = parseInt(request.query.page as string) || 1;
//     const limit = parseInt(request.query.limit as string) || 20;
//     let paginationOptions: T_FindAll = {
//       queryParams: {
//         page: page,
//         limit: limit,
//       },
//     };
//     //si buscaba como request.body no me llegaba bien para luego buscar
//     const name = request.query.name as string;
//     const result = await userService.findByName(name, paginationOptions);
//     response.status(result.statusCode).json(result);
//   }

//   async allUsers(request: express.Request, response: express.Response) {
//     const page = parseInt(request.query.page as string) || 1;
//     const limit = parseInt(request.query.limit as string) || 20;
//     let paginationOptions: T_FindAll = {
//       queryParams: {
//         page: page,
//         limit: limit,
//       },
//     };
//     const result = await userService.findAll(paginationOptions);
//     response.status(result.statusCode).json(result);
//   }
// }

// export const userController = new UserController();
