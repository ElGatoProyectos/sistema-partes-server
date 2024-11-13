// import multer from "multer";
// import { DailyPartPhotoOneMulterFile } from "./models/photos-contant";
// import { httpResponse } from "../../common/http.response";
// import express from "../../config/express.config";
// import { authService } from "../../auth/auth.service";
// import { dailyPartReportValidation } from "../dailyPart.validation";

// const storage = multer.memoryStorage();
// const upload: any = multer({ storage: storage });

// class DailyPartPhotosController {
//   create = async (request: express.Request, response: express.Response) => {
//     upload.single(DailyPartPhotoOneMulterFile.field)(
//       request,
//       response,
//       async (error: any) => {
//         if (error) {
//           const customError = httpResponse.BadRequestException(
//             "Error al procesar la imagen 1 del Parte Diario",
//             error
//           );
//           response.status(customError.statusCode).json(customError);
//         } else {
//           const daily_part_id = request.params.id;
//           try {
//             //[message] verificar roles
//             const rolsPermitted = [
//               "ADMIN",
//               "USER",
//               "CONTROL_COSTOS",
//               "ASISTENTE_PRODUCCION",
//             ];
//             const responseValidate = authService.authorizeRolesService(
//               request.get("Authorization") as string,
//               rolsPermitted
//             );
//             if (!responseValidate?.success) {
//               return response.status(401).json(responseValidate);
//             } else {
//               const dailyPartResponse =
//                 await dailyPartReportValidation.findByIdValidation(
//                   +daily_part_id
//                 );

//               if(!dailyPartResponse.success){

//               }

//               const project = result.payload as UnidadProduccion;
//               if (request.file) {
//                 const id = project.id;
//                 const direction = path.join(
//                   appRootPath.path,
//                   "static",
//                   ProductionUnitMulterProperties.folder
//                 );
//                 const ext = ".png";
//                 const fileName = `${ProductionUnitMulterProperties.folder}_${id}${ext}`;
//                 const filePath = path.join(direction, fileName);
//                 sharp(request.file.buffer)
//                   .resize({ width: 800 })
//                   .toFormat("png")
//                   .toFile(filePath, (err) => {
//                     if (err) {
//                       const customError = httpResponse.BadRequestException(
//                         "Error al guardar la imagen de la Unidad de Producción",
//                         err
//                       );
//                       response.status(customError.statusCode).json(customError);
//                     } else {
//                       response.status(result.statusCode).json(result);
//                     }
//                   });
//               }
//             }
//           } catch (error) {
//             const customError = httpResponse.BadRequestException(
//               "Error al validar los campos de la Unidad de Producción",
//               error
//             );
//             response.status(customError.statusCode).json(customError);
//           }
//         }
//       }
//     );
//   };
// }

// export const dailyPartPhotosController = new DailyPartPhotosController();
