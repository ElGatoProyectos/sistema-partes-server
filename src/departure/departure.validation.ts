import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaDepartureRepository } from "./prisma-departure.repository";
import {
  I_DepartureExcel,
  I_UpdateDepartureBD,
} from "./models/departure.interface";
import { unitValidation } from "@/unit/unit.validation";
import { Unidad } from "@prisma/client";

class DepartureValidation {
  async updateDeparture(
    departure_id: number,
    data: I_DepartureExcel,
    usuario_id: number,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      let departureFormat: any = {
        id_interno: data["ID-PARTIDA"] ? String(data["ID-PARTIDA"].trim()) : "",
        item: data.ITEM || "",
        partida: data.PARTIDA || "",
        metrado_inicial: data.METRADO,
        metrado_total: data.METRADO,
        precio: +data.PRECIO,
        parcial: data.PARCIAL,
        mano_de_obra_unitaria: 0,
        material_unitario: 0,
        equipo_unitario: 0,
        subcontrata_varios: 0,
        usuario_id: usuario_id,
        proyecto_id: project_id,
      };
      if (data.UNI) {
        const unitResponse = await unitValidation.findBySymbol(
          data.UNI.trim(),
          project_id
        );
        const unit = unitResponse.payload as Unidad;
        departureFormat.unidad_id = unit.id;
      }

      const responseUnifiedIndex =
        await prismaDepartureRepository.updateDeparture(
          departureFormat,
          departure_id
        );
      return httpResponse.SuccessResponse(
        "Unidad modificada correctamente",
        responseUnifiedIndex
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar la Unidad",
        error
      );
    }
  }
  async codeMoreHigh(project_id: number): Promise<T_HttpResponse> {
    try {
      const departure = await prismaDepartureRepository.codeMoreHigh(
        project_id
      );
      if (!departure) {
        return httpResponse.SuccessResponse("No se encontraron resultados", []);
      }
      return httpResponse.SuccessResponse("Partida encontrada", departure);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Partida",
        error
      );
    }
  }

  async findByCodeValidation(
    code: string,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const departure = await prismaDepartureRepository.findByCode(
        code,
        project_id
      );
      if (!departure) {
        return httpResponse.NotFoundException("Partida no fue encontrada");
      }
      return httpResponse.SuccessResponse(
        "La Partida fue encontrada",
        departure
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Partida ",
        error
      );
    }
  }

  async findById(departure_id: number): Promise<T_HttpResponse> {
    try {
      const departureResponse = await prismaDepartureRepository.findById(
        departure_id
      );
      if (!departureResponse) {
        return httpResponse.NotFoundException("La Partida no fue encontrada");
      }
      return httpResponse.SuccessResponse(
        "La Partida fue encontrada",
        departureResponse
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Partida ",
        error
      );
    }
  }
  async findByName(name: string, project_id: number): Promise<T_HttpResponse> {
    try {
      const nameExists = await prismaDepartureRepository.existsName(
        name,
        project_id
      );
      if (nameExists) {
        return httpResponse.NotFoundException(
          "El nombre ingresado de la Partida ya existe en la base de datos"
        );
      }
      return httpResponse.SuccessResponse(
        "El nombre no existe, puede proceguir"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al buscar el nombre de la Partida en la base de datos",
        error
      );
    }
  }
}

export const departureValidation = new DepartureValidation();
