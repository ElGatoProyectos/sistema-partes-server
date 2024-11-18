import { httpResponse, T_HttpResponse } from "../../common/http.response";
import { I_DepartureJobExcel } from "./models/departureJob.interface";
import { Partida, Trabajo } from "@prisma/client";
import { prismaDepartureJobRepository } from "./prisma-departure-job.repository";

class DepartureJobValidation {
  async updateJobForAdd(
    metrado: number,
    job: Trabajo,
    departure: Partida
  ): Promise<T_HttpResponse> {
    try {
      if (departure.precio) {
        const resultado = metrado * departure.precio;
        job.costo_partida += resultado;
      }
      if (departure.mano_de_obra_unitaria) {
        const resultado = metrado * departure.mano_de_obra_unitaria;
        job.costo_mano_obra += resultado;
      }
      if (departure.material_unitario) {
        const resultado = metrado * departure.material_unitario;
        job.costo_material += resultado;
      }
      if (departure.equipo_unitario) {
        const resultado = metrado * departure.equipo_unitario;
        job.costo_equipo += resultado;
      }
      if (departure.subcontrata_varios) {
        const resultado = metrado * departure.subcontrata_varios;
        job.costo_varios += resultado;
      }
      return httpResponse.SuccessResponse(
        "Trabajo actualizado con los nuevos valores."
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al actualizar el trabajo con los nuevos valores .",
        error
      );
    }
  }
  async updateJobForSubtractAndAdd(
    oldMetrado: number,
    newMetrado: number,
    job: Trabajo,
    departure: Partida
  ): Promise<T_HttpResponse> {
    try {
      if (departure.precio) {
        const resultado = newMetrado * departure.precio;
        const resultadoOld = oldMetrado * departure.precio;
        // console.log(
        //   "el resultado de nuevo metrado " +
        //     newMetrado +
        //     " por el precio " +
        //     departure.precio +
        //     " es igual a " +
        //     resultado
        // );
        // console.log(
        //   "el resultado del viejo metrado " +
        //     oldMetrado +
        //     " por el precio " +
        //     departure.precio +
        //     "  es igual a " +
        //     resultadoOld
        // );
        // console.log(
        //   "el costo partida de sumar costo partida anterior " +
        //     job.costo_partida +
        //     " resultado nuevo " +
        //     resultado +
        //     " resultado viejo " +
        //     resultadoOld
        // );
        job.costo_partida = job.costo_partida + resultado - resultadoOld;
        // console.log("COSTO PARTIDA EL TOTAL ES " + job.costo_partida);
      }
      if (departure.mano_de_obra_unitaria) {
        const resultado = newMetrado * departure.mano_de_obra_unitaria;
        const resultadoOld = oldMetrado * departure.mano_de_obra_unitaria;
        job.costo_mano_obra = job.costo_mano_obra + resultado - resultadoOld;
      }
      if (departure.material_unitario) {
        const resultado = newMetrado * departure.material_unitario;
        const resultadoOld = oldMetrado * departure.material_unitario;
        // console.log(
        //   "el resultado de nuevo metrado " +
        //     newMetrado +
        //     " por material unitario " +
        //     departure.material_unitario +
        //     " es igual a " +
        //     resultado
        // );
        // console.log(
        //   "el resultado del viejo metrado " +
        //     oldMetrado +
        //     " por material unitario " +
        //     departure.material_unitario +
        //     " es igual a " +
        //     resultadoOld
        // );
        // console.log(
        //   "el costo partida de sumar costo_material anterior " +
        //     job.costo_material +
        //     " resultado nuevo " +
        //     resultado +
        //     " resultado viejo " +
        //     resultadoOld
        // );
        job.costo_material = job.costo_material + resultado - resultadoOld;
        // console.log("te quedaria asi costo material " + job.costo_material);
        // console.log("---------------");
      }
      if (departure.equipo_unitario) {
        const resultado = newMetrado * departure.equipo_unitario;
        const resultadoOld = oldMetrado * departure.equipo_unitario;
        job.costo_equipo = job.costo_equipo + resultado - resultadoOld;
      }
      if (departure.subcontrata_varios) {
        const resultado = newMetrado * departure.subcontrata_varios;
        const resultadoOld = oldMetrado * departure.subcontrata_varios;
        job.costo_varios = job.costo_varios + resultado - resultadoOld;
      }
      return httpResponse.SuccessResponse(
        "Trabajo actualizado de los Detalles ya existentes"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al actualizar el trabajo de los Detalles ya existentes",
        error
      );
    }
  }

  async createDetailDepartureJobFromExcel(
    data: I_DepartureJobExcel,
    project_id: number,
    job_id: number,
    departure_id: number
  ): Promise<T_HttpResponse> {
    try {
      //////
      //[note] esto comentado se usaba antes cuando no estaba fork y se pasaba por argumentos todas los trabajos
      // const jobResponse = jobs.find((departure) => {
      //   return departure.codigo === data["ID-TRABAJO"];
      // });

      // if (!jobResponse) {
      //   return httpResponse.BadRequestException(
      //     "No se encontró el id del trabajo que se quiere agregar en el Detalle"
      //   );
      // }
      ///////

      // const jobResponse = await jobValidation.findByCodeValidation(
      //   data["ID-TRABAJO"],
      //   project_id
      // );
      // const job = jobResponse.payload as Trabajo;

      ////////////////////////
      //[note] esto comentado se usaba antes cuando no estaba fork y se pasaba por argumentos todas las partidas
      // const departureWithComa = data.PARTIDA.split(" "); // Divide por espacios

      // const codeDeparture = departureWithComa[0];

      // const departureResponse = departures.find((departure) => {
      //   return departure.id_interno === codeDeparture;
      // });

      // if (!departureResponse) {
      //   return httpResponse.BadRequestException(
      //     "No se encontró la partida que se quiere agregar en el Detalle"
      //   );
      // }
      /////////////////////////////

      // const departureResponse = await departureValidation.findByCodeValidation(
      //   String(codeDeparture),
      //   project_id
      // );
      // const departure = departureResponse.payload as Partida;
      // if (departureResponse && departureResponse.id !== undefined) {

      const detail =
        await prismaDepartureJobRepository.createDetailDepartureJob(
          job_id,
          departure_id,
          +data.METRADO
        );

      return httpResponse.SuccessResponse(
        "El Detalle Trabajo-Partida fue creado correctamente",
        detail
      );
      // }
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
  async findAllDepartureJobWithOutPagination(
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const details =
        await prismaDepartureJobRepository.findAllWithOutPagination(project_id);

      return httpResponse.SuccessResponse(
        "Los Detalles Trabajo Partida por el id del Proyecto fue encontrado con éxito",
        details
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar los Detalles Trabajo Partida por el id del Proyecto",
        error
      );
    }
  }
  async findAllWithOutPaginationForJob(
    job_id: number
  ): Promise<T_HttpResponse> {
    try {
      const details =
        await prismaDepartureJobRepository.findAllWithOutPaginationForJob(
          job_id
        );

      return httpResponse.SuccessResponse(
        "Los Detalles Trabajo Partida por el id del Trabajo fue encontrado con éxito",
        details
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar los Detalles Trabajo Partida por el id del Trabajo",
        error
      );
    }
  }
  async findAllWithOutPaginationForDeparture(
    departure_id: number
  ): Promise<T_HttpResponse> {
    try {
      const details =
        await prismaDepartureJobRepository.findAllWithOutPaginationForDeparture(
          departure_id
        );

      return httpResponse.SuccessResponse(
        "Los Detalles Trabajo Partida por el id de la Partida fue encontrado con éxito",
        details
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar los Detalles Trabajo Partida por el id de la Partida",
        error
      );
    }
  }
}

export const departureJobValidation = new DepartureJobValidation();

//[note] codigo que usaba antes para actualizar el trabajo
// async updateDepartureJob(
//   data: I_DepartureJobExcel,
//   project_id: number,
//   job: Trabajo,
//   departure: Partida
// ): Promise<T_HttpResponse> {
//   try {
//     const jobResponse = await jobValidation.findByCodeValidation(
//       data["ID-TRABAJO"],
//       project_id
//     );
//     const jobfind = jobResponse.payload as Trabajo;
//     const departureWithComa = data.PARTIDA.split(" "); // Divide por espacios

//     const codeDeparture = departureWithComa[0];
//     const departureResponse = await departureValidation.findByCodeValidation(
//       String(codeDeparture),
//       project_id
//     );
//     const departureFind = departureResponse.payload as Partida;

//     let jobFormat = {
//       ...jobfind,
//     };
//     if (departureFind.precio) {
//       let suma = 0;
//       const resultado = data.METRADO * departureFind.precio;
//       // console.log(
//       //   "la partida " +
//       //     data.PARTIDA +
//       //     " viene con valor de la base de datos el trabajo " +
//       //     job.costo_partida +
//       //     " esto da del codigo de la partida " +
//       //     departure.id +
//       //     " de multiplicar el metrado " +
//       //     data.METRADO +
//       //     " por el precio de la partida " +
//       //     departure.precio +
//       //     " el siguiente resultado " +
//       //     resultado +
//       //     " para el id del trabajo " +
//       //     job.id
//       // );
//       suma = resultado + jobfind.costo_partida;
//       // console.log("el resultado de la suma da  " + suma);
//       jobFormat.costo_partida = suma;
//       // await prismaJobRepository.updateJobCost(suma, job.id);
//     }
//     if (departureFind.mano_de_obra_unitaria) {
//       let suma = 0;
//       const resultado = data.METRADO * departureFind.mano_de_obra_unitaria;

//       suma = resultado + jobfind.costo_mano_obra;
//       // await prismaJobRepository.updateJobCostOfLabor(suma, job.id);
//       jobFormat.costo_mano_obra = suma;
//     }
//     if (departureFind.material_unitario) {
//       let suma = 0;
//       const resultado = data.METRADO * departureFind.material_unitario;

//       suma = resultado + jobfind.costo_material;
//       // await prismaJobRepository.updateJobMaterialCost(suma, job.id);
//       jobFormat.costo_material = suma;
//     }
//     if (departureFind.equipo_unitario) {
//       let suma = 0;
//       const resultado = data.METRADO * departureFind.equipo_unitario;

//       suma = resultado + jobfind.costo_equipo;
//       // await prismaJobRepository.updateJobEquipment(suma, job.id);
//       jobFormat.costo_equipo = suma;
//     }
//     if (departureFind.subcontrata_varios) {
//       let suma = 0;
//       const resultado = data.METRADO * departureFind.subcontrata_varios;
//       suma = resultado + jobfind.costo_varios;
//       // await prismaJobRepository.updateJobSeveral(suma, job.id);
//       jobFormat.costo_varios = suma;
//     }
//     const jobResponseUpdate = await jobValidation.updateJob(
//       jobFormat,
//       job.id
//     );
//     if (!jobResponseUpdate.success) {
//       return httpResponse.BadRequestException(
//         "Hubo un problema para actualizar el trabajo en uno de sus campos"
//       );
//     }
//     return httpResponse.SuccessResponse(
//       "Los Trabajos de las Partidas modificada correctamente"
//     );
//   } catch (error) {
//     return httpResponse.InternalServerErrorException(
//       "Error al modificar los Trabajos de las Partidas",
//       error
//     );
//   }
// }
