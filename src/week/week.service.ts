// import prisma from "@/config/prisma.config";
// import { httpResponse, T_HttpResponse } from "./../common/http.response";
// import { WeekRepository } from "./week.repository";

// class PrismaWeekRepository implements WeekRepository {
//   async createUnit(year: number): Promise<T_HttpResponse> {
//     try {
//       let currentStartDate = new Date(year, 0, 1); // Año, mes (0 es enero), día (1)
//       let weekNumber = 1;

//       for (let i = 0; i < 52; i++) {
//         // Calcula el fin de la semana (6 días después del inicio)
//         const currentEndDate = this.addDays(currentStartDate, 6);

//         await prisma.semana.create({
//           data: {
//             codigo: String(weekNumber),
//             fecha_inicio: currentStartDate,
//             fecha_fin: currentEndDate,
//           },
//         });
//         currentStartDate = this.addDays(currentStartDate, 7);
//         weekNumber++;

//         // Mueve la fecha de inicio a la siguiente semana (7 días después del inicio actual)
//         currentStartDate = this.addDays(currentStartDate, 7);
//         weekNumber++;
//       }
//     } catch (error) {
//       return httpResponse.InternalServerErrorException(
//         "Error al crear las semanas",
//         error
//       );
//     }
//   }
//   addDays(date: Date, days: number): Date {
//     const newDate = new Date(date);
//     newDate.setDate(newDate.getDate() + days);
//     return newDate;
//   }
// }

// export const prismaWeekRepository = new PrismaWeekRepository();
