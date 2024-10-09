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
        const;
        const resultado = data.METRADO * departure.precio;
        console.log(
          "esto da del codigo de la partida " +
            departure.id +
            " de multiplicar el metrado " +
            data.METRADO +
            " por el precio de la partida " +
            departure.precio +
            " el siguiente resultado " +
            resultado
        );
        const responseTrain = await prismaJobRepository.updateJobFromExcel(
          resultado,
          job.id
        );
        const jobResponseUpdate =
          await prismaDepartureRepository.updateDeparture(
            departureFormat,
            departure_id
          );
      }

      //     let departureFormat: any = {
      //       id_interno: String(data["ID-PARTIDA"]) || "",
      //       item: data.ITEM || "",
      //       partida: data.PARTIDA || "",
      //       metrado_inicial: data.METRADO,
      //       metrado_total: data.METRADO,
      //       precio: +data.PRECIO,
      //       parcial: data.PARCIAL,
      //       mano_de_obra_unitaria: 0,
      //       material_unitario: 0,
      //       equipo_unitario: 0,
      //       subcontrata_varios: 0,
      //       usuario_id: usuario_id,
      //       proyecto_id: project_id,
      //     };
      //     if (data.UNI) {
      //       const unitResponse = await unitValidation.findBySymbol(
      //         data.UNI,
      //         project_id
      //       );
      //       const unit = unitResponse.payload as Unidad;
      //       departureFormat.unidad_id = unit.id;
      //     }
      //     const responseUnifiedIndex =
      //       await prismaDepartureRepository.updateDeparture(
      //         departureFormat,
      //         departure_id
      //       );
      return httpResponse.SuccessResponse(
        "Partida-Trabajo modificada correctamente",
        "responseUnifiedIndex"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar la Partida y el Trabajo",
        error
      );
    }
  }
  // async updateDeparture(
  //   departure_id: number,
  //   data: I_DepartureExcel,
  //   usuario_id: number,
  //   project_id: number
  // ): Promise<T_HttpResponse> {
  //   try {
  //     let departureFormat: any = {
  //       id_interno: String(data["ID-PARTIDA"]) || "",
  //       item: data.ITEM || "",
  //       partida: data.PARTIDA || "",
  //       metrado_inicial: data.METRADO,
  //       metrado_total: data.METRADO,
  //       precio: +data.PRECIO,
  //       parcial: data.PARCIAL,
  //       mano_de_obra_unitaria: 0,
  //       material_unitario: 0,
  //       equipo_unitario: 0,
  //       subcontrata_varios: 0,
  //       usuario_id: usuario_id,
  //       proyecto_id: project_id,
  //     };
  //     if (data.UNI) {
  //       const unitResponse = await unitValidation.findBySymbol(
  //         data.UNI,
  //         project_id
  //       );
  //       const unit = unitResponse.payload as Unidad;
  //       departureFormat.unidad_id = unit.id;
  //     }
  //     const responseUnifiedIndex =
  //       await prismaDepartureRepository.updateDeparture(
  //         departureFormat,
  //         departure_id
  //       );
  //     return httpResponse.SuccessResponse(
  //       "Unidad modificada correctamente",
  //       responseUnifiedIndex
  //     );
  //   } catch (error) {
  //     return httpResponse.InternalServerErrorException(
  //       "Error al modificar la Unidad",
  //       error
  //     );
  //   }
  // }
}

export const departureJobValidation = new DepartureJobValidation();
