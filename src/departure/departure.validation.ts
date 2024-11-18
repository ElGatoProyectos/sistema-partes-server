import { httpResponse, T_HttpResponse } from "../common/http.response";
import { prismaDepartureRepository } from "./prisma-departure.repository";
import { I_DepartureExcel } from "./models/departure.interface";
import { Partida, Unidad } from "@prisma/client";

class DepartureValidation {
  async updateDeparture(
    departure: Partida,
    data: I_DepartureExcel,
    usuario_id: number,
    project_id: number,
    units: Unidad[]
  ): Promise<T_HttpResponse> {
    try {
      let resultado;
      if (data.METRADO && data.PRECIO) {
        resultado = parseInt(data.METRADO) * parseInt(data.PRECIO);
      }
      let departureFormat: any = {
        id_interno: data["ID-PARTIDA"] ? String(data["ID-PARTIDA"].trim()) : "",
        item: data.ITEM || "",
        partida: data.PARTIDA || "",
        metrado_inicial: parseInt(data.METRADO) || 0,
        metrado_total: parseInt(data.METRADO) || 0,
        precio: parseInt(data.PRECIO) || 0,
        parcial: data.METRADO && data.PRECIO ? resultado : 0,
        mano_de_obra_unitaria: data["MANO DE OBRA UNITARIO"]
          ? data["MANO DE OBRA UNITARIO"]
          : departure.mano_de_obra_unitaria,
        material_unitario: data["MATERIAL UNITARIO"]
          ? data["MATERIAL UNITARIO"]
          : departure.material_unitario,
        equipo_unitario: data["EQUIPO UNITARIO"]
          ? data["EQUIPO UNITARIO"]
          : departure.equipo_unitario,
        subcontrata_varios: data["SUBCONTRATA - VARIOS UNITARIO"]
          ? data["SUBCONTRATA - VARIOS UNITARIO"]
          : departure.subcontrata_varios,
        usuario_id: usuario_id,
        proyecto_id: project_id,
      };
      if (data.UNI && data.UNI.trim() !== "") {
        // const unitResponse = await unitValidation.findBySymbol(
        //   data.UNI.trim(),
        //   project_id
        // );
        // const unit = unitResponse.payload as Unidad;
        // departureFormat.unidad_id = unit.id;

        const unit = units.find((unit) => {
          return unit.simbolo?.toUpperCase() === data.UNI.toUpperCase();
        });

        departureFormat.unidad_id = unit ? unit.id : null;
      }

      const responseUnifiedIndex =
        await prismaDepartureRepository.updateDeparture(
          departureFormat,
          departure.id
        );
      return httpResponse.SuccessResponse(
        "Partida modificada correctamente",
        responseUnifiedIndex
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar la Partida",
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
  async findAllWithOutPagination(project_id: number): Promise<T_HttpResponse> {
    try {
      const departure =
        await prismaDepartureRepository.findAllWithOutPagination(project_id);

      return httpResponse.SuccessResponse("Partidas encontradas", departure);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar las Partida",
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
          "El nombre ingresado de la Partida ya existe dentro del Proyecto"
        );
      }
      return httpResponse.SuccessResponse(
        "El nombre no existe, puede proceguir"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el nombre de la Partida en la base de datos",
        error
      );
    }
  }
  async IsLastId(project_id: number): Promise<T_HttpResponse> {
    try {
      const departure = await prismaDepartureRepository.isLastId(project_id);
      if (!departure) {
        return httpResponse.NotFoundException(
          "Codigo de la última Partida no fue encontrado",
          departure
        );
      }
      return httpResponse.SuccessResponse(
        "Código de la última Partida fue encontrada",
        departure
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar código de la Partida",
        error
      );
    }
  }
  async updateDepartureMetradoTotal(
    departure_id: number,
    total: number
  ): Promise<T_HttpResponse> {
    try {
      const departure = await prismaDepartureRepository.updateMetradoTotal(
        departure_id,
        total
      );
      if (!departure) {
        return httpResponse.NotFoundException(
          "No se pudo actualizar con el nuevo metrado ",
          departure
        );
      }
      return httpResponse.SuccessResponse(
        "Metrado Total actualizado con éxito",
        departure
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al editar la partida con su nuevo metrado total",
        error
      );
    }
  }
}

export const departureValidation = new DepartureValidation();
