import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { jobValidation } from "@/job/job.validation";
import { I_DepartureJobExcel } from "./models/departureJob.interface";
import { Partida, Trabajo } from "@prisma/client";
import { departureValidation } from "../departure.validation";
import { prismaJobRepository } from "@/job/prisma-job.repository";

class DepartureJobValidation {
  async updateDepartureJob(
    data: I_DepartureJobExcel,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const jobResponse = await jobValidation.findByCodeValidation(
        data["ID-TRABAJO"],
        project_id
      );
      const job = jobResponse.payload as Trabajo;
      const departureWithComa = data.PARTIDA.split(" "); // Divide por espacios

      const codeDeparture = departureWithComa[0];
      const departureResponse = await departureValidation.findByCodeValidation(
        String(codeDeparture),
        project_id
      );
      const departure = departureResponse.payload as Partida;

      if (departure.precio) {
        console.log("----entro a precio--");
        let suma = 0;
        const resultado = data.METRADO * departure.precio;
        // console.log(
        //   "la partida " +
        //     data.PARTIDA +
        //     " viene con valor de la base de datos el trabajo " +
        //     job.costo_partida +
        //     " esto da del codigo de la partida " +
        //     departure.id +
        //     " de multiplicar el metrado " +
        //     data.METRADO +
        //     " por el precio de la partida " +
        //     departure.precio +
        //     " el siguiente resultado " +
        //     resultado +
        //     " para el id del trabajo " +
        //     job.id
        // );
        suma = resultado + job.costo_partida;
        // console.log("el resultado de la suma da  " + suma);
        await prismaJobRepository.updateJobCost(suma, job.id);
      }
      if (departure.mano_de_obra_unitaria) {
        let suma = 0;
        const resultado = data.METRADO * departure.mano_de_obra_unitaria;
        // console.log(
        //   "la partida " +
        //     data.PARTIDA +
        //     " viene con valor de la base de datos el trabajo " +
        //     job.costo_mano_obra +
        //     " esto da del codigo de la partida " +
        //     departure.id +
        //     " de multiplicar el metrado " +
        //     data.METRADO +
        //     " por la mano de obra de bbdd " +
        //     departure.mano_de_obra_unitaria +
        //     " el siguiente resultado " +
        //     resultado +
        //     " para el id del trabajo " +
        //     job.id
        // );
        suma = resultado + job.costo_partida;
        await prismaJobRepository.updateJobCostOfLabor(suma, job.id);
      }
      if (departure.material_unitario) {
        let suma = 0;
        const resultado = data.METRADO * departure.material_unitario;
        // console.log(
        //   "la partida " +
        //     data.PARTIDA +
        //     " viene con valor de la base de datos el trabajo " +
        //     job.costo_material +
        //     " esto da del codigo de la partida " +
        //     departure.id +
        //     " de multiplicar el metrado " +
        //     data.METRADO +
        //     " por la material de bbdd " +
        //     departure.material_unitario +
        //     " el siguiente resultado " +
        //     resultado +
        //     " para el id del trabajo " +
        //     job.id
        // );
        suma = resultado + job.costo_partida;
        await prismaJobRepository.updateJobMaterialCost(suma, job.id);
      }
      if (departure.equipo_unitario) {
        let suma = 0;
        const resultado = data.METRADO * departure.equipo_unitario;
        // console.log(
        //   "la partida " +
        //     data.PARTIDA +
        //     " viene con valor de la base de datos el trabajo " +
        //     job.costo_equipo +
        //     " esto da del codigo de la partida " +
        //     departure.id +
        //     " de multiplicar el metrado " +
        //     data.METRADO +
        //     " por la costo equipo de bbdd " +
        //     departure.equipo_unitario +
        //     " el siguiente resultado " +
        //     resultado +
        //     " para el id del trabajo " +
        //     job.id
        // );
        suma = resultado + job.costo_partida;
        await prismaJobRepository.updateJobEquipment(suma, job.id);
      }
      if (departure.subcontrata_varios) {
        let suma = 0;
        const resultado = data.METRADO * departure.subcontrata_varios;
        // console.log(
        //   "la partida " +
        //     data.PARTIDA +
        //     " viene con valor de la base de datos el costo varios " +
        //     job.costo_varios +
        //     " esto da del codigo de la partida " +
        //     departure.id +
        //     " de multiplicar el metrado " +
        //     data.METRADO +
        //     " por la mano de obra de bb " +
        //     departure.subcontrata_varios +
        //     " el siguiente resultado " +
        //     resultado +
        //     " para el id del trabajo " +
        //     job.id
        // );
        suma = resultado + job.costo_partida;
        await prismaJobRepository.updateJobSeveral(suma, job.id);
      }
      return httpResponse.SuccessResponse(
        "Los Trabajos de las Partidas modificada correctamente"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar los Trabajos de las Partidas",
        error
      );
    }
  }
}

export const departureJobValidation = new DepartureJobValidation();
