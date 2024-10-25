import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { jobValidation } from "@/job/job.validation";
import { I_DepartureJobExcel } from "./models/departureJob.interface";
import { Partida, Trabajo } from "@prisma/client";
import { departureValidation } from "../departure.validation";
import { prismaJobRepository } from "@/job/prisma-job.repository";
import { prismaDepartureJobRepository } from "./prisma-departure-job.repository";

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
      let jobFormat = {
        ...job,
      };
      if (departure.precio) {
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
        jobFormat.costo_partida = suma;
        // await prismaJobRepository.updateJobCost(suma, job.id);
      }
      if (departure.mano_de_obra_unitaria) {
        let suma = 0;
        const resultado = data.METRADO * departure.mano_de_obra_unitaria;

        suma = resultado + job.costo_mano_obra;
        // await prismaJobRepository.updateJobCostOfLabor(suma, job.id);
        jobFormat.costo_mano_obra = suma;
      }
      if (departure.material_unitario) {
        let suma = 0;
        const resultado = data.METRADO * departure.material_unitario;

        suma = resultado + job.costo_material;
        // await prismaJobRepository.updateJobMaterialCost(suma, job.id);
        jobFormat.costo_material = suma;
      }
      if (departure.equipo_unitario) {
        let suma = 0;
        const resultado = data.METRADO * departure.equipo_unitario;

        suma = resultado + job.costo_equipo;
        // await prismaJobRepository.updateJobEquipment(suma, job.id);
        jobFormat.costo_equipo = suma;
      }
      if (departure.subcontrata_varios) {
        let suma = 0;
        const resultado = data.METRADO * departure.subcontrata_varios;
        suma = resultado + job.costo_varios;
        // await prismaJobRepository.updateJobSeveral(suma, job.id);
        jobFormat.costo_varios = suma;
      }
      const jobResponseUpdate = await jobValidation.updateJob(
        jobFormat,
        job.id
      );
      if (!jobResponseUpdate.success) {
        return httpResponse.BadRequestException(
          "Hubo un problema para actualizar el trabajo en uno de sus campos"
        );
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
  async createDetailDepartureJobFromExcel(
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
      const detail =
        await prismaDepartureJobRepository.createDetailDepartureJob(
          job.id,
          departure.id,
          +data.METRADO
        );
      return httpResponse.SuccessResponse(
        "El Detalle Trabajo-Partida fue creado correctamente",
        detail
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar los Trabajos de las Partidas",
        error
      );
    }
  }
  async createDetailDepartureJob(
    job_id: number,
    departure_id: number,
    metrado: number
  ): Promise<T_HttpResponse> {
    try {
      const detail =
        await prismaDepartureJobRepository.createDetailDepartureJob(
          job_id,
          departure_id,
          metrado
        );
      return httpResponse.SuccessResponse(
        "El Detalle Trabajo-Partida fue creado correctamente",
        detail
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar los Trabajos de las Partidas",
        error
      );
    }
  }
  async findByForJob(job_id: number): Promise<T_HttpResponse> {
    try {
      const detail = await prismaDepartureJobRepository.findByIdJob(job_id);
      if (!detail) {
        return httpResponse.NotFoundException(
          "La Búsqueda del Detalle Trabajo Partida no fue encontrado",
          detail
        );
      }
      return httpResponse.SuccessResponse(
        "Detalle Trabajo Partida encontrado",
        detail
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Detalle Trabajo Partida",
        error
      );
    }
  }
  async findById(detail_id: number): Promise<T_HttpResponse> {
    try {
      const detail = await prismaDepartureJobRepository.findById(detail_id);
      if (!detail) {
        return httpResponse.NotFoundException(
          "La Búsqueda del Detalle Trabajo Partida no fue encontrado",
          detail
        );
      }
      return httpResponse.SuccessResponse(
        "Detalle Trabajo Partida encontrado",
        detail
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Detalle Trabajo Partida",
        error
      );
    }
  }
  async findByForDeparture(departure_id: number): Promise<T_HttpResponse> {
    try {
      const detail = await prismaDepartureJobRepository.findByIdDeparture(
        departure_id
      );
      if (!detail) {
        return httpResponse.NotFoundException(
          "La Búsqueda del Detalle Trabajo Partida no fue encontrado",
          detail
        );
      }
      return httpResponse.SuccessResponse(
        "Detalle Trabajo Partida encontrado",
        detail
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Detalle Trabajo Partida",
        error
      );
    }
  }
  async findByForDepartureAndJob(
    departure_id: number,
    job_id: number
  ): Promise<T_HttpResponse> {
    try {
      const detail =
        await prismaDepartureJobRepository.findByIdDepartureAndIdJob(
          departure_id,
          job_id
        );
      if (!detail) {
        return httpResponse.NotFoundException(
          "La Búsqueda del Detalle Trabajo Partida por el id de la Partida y el Trabajo no fue encontrado",
          detail
        );
      }
      return httpResponse.SuccessResponse(
        "Detalle Trabajo Partida por el id de la Partida y el Trabajo fue encontrado",
        detail
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Detalle Trabajo Partida al buscar por el id de la Partida y el Trabajo ",
        error
      );
    }
  }
}

export const departureJobValidation = new DepartureJobValidation();
