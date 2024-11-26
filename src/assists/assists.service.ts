import { httpResponse, T_HttpResponse } from "../common/http.response";
import prisma from "../config/prisma.config";
import {
  Asistencia,
  CategoriaObrero,
  Combo,
  E_Asistencia_BD,
  E_Estado_BD,
  ManoObra,
  Proyecto,
} from "@prisma/client";
import { workforceValidation } from "../workforce/workforce.validation";
import { projectValidation } from "../project/project.validation";
import { prismaAssistsRepository } from "./prisma-assists.repository";
import { assistsWorkforceValidation } from "./assists.validation";
import {
  T_FindAllAssists,
  T_FindAllAssistsForDailyPart,
  T_FindAllWeekAssists,
} from "./models/assists.types";
import { jwtService } from "../auth/jwt.service";
import { I_Usuario } from "../user/models/user.interface";
import { I_AssistsBody } from "./models/assists.interface";
import { prismaWorkforceRepository } from "../workforce/prisma-workforce.repository";
import { categoryWorkforceValidation } from "../categoryWorkforce/categoryWorkforce.validation";
import { comboValidation } from "../dailyPart/combo/combo.validation";

class AssistsService {
  async findAll(
    data: T_FindAllAssists,
    project_id: string,
    token: string
  ): Promise<T_HttpResponse> {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const userTokenResponse = await jwtService.getUserFromToken(token);
      if (!userTokenResponse) return userTokenResponse;
      const userResponse = userTokenResponse.payload as I_Usuario;
      const resultIdProject = await projectValidation.findById(+project_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear la Asistencia con el id del Proyecto proporcionado"
        );
      }

      const workforcesManyResponse =
        await workforceValidation.findAllWithoutPaginationForProject(
          +project_id
        );

      if (!workforcesManyResponse || workforcesManyResponse.length === 0) {
        return httpResponse.BadRequestException(
          "No se entontraron registros en la Mano de Obra en el Proyecto para crear la asistencia",
          []
        );
      }
      const weekOfTheYear = Array.from({ length: 52 }, (v, i) =>
        String(i + 1).padStart(2, "0")
      );
      if (data.queryParams.week) {
        const week = data.queryParams.week as string;
        const result = week.split(".");
        const dayWeek = result[1];
        if (!weekOfTheYear.includes(dayWeek)) {
          return httpResponse.BadRequestException(
            "No existe la semana que ha pasado"
          );
        }
      }

      if (data.queryParams.state) {
        const valueState = this.verifyState(data.queryParams.state);
        if (!valueState) {
          return httpResponse.BadRequestException(
            "El Estado ingresado de la Asistencia no existe"
          );
        }
      }

      if (
        userResponse.Rol?.rol === "ADMIN" ||
        userResponse.Rol?.rol === "USER" ||
        userResponse.Rol?.rol === "GERENTE_PROYECTO" ||
        userResponse.Rol?.rol === "CONTROL_COSTOS" ||
        userResponse.Rol?.rol === "ASISTENTE_CONTROL_COSTOS"
      ) {
        return this.findAndResponseWithAssists(+project_id, skip, data);
      } else {
        return this.findAndResponseWithAssists(
          +project_id,
          skip,
          data,
          userResponse.id
        );
      }
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear y traer las Asistencias",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async findAllForWeek(
    data: T_FindAllWeekAssists,
    project_id: string,
    token: string
  ): Promise<T_HttpResponse> {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;

      const resultIdProject = await projectValidation.findById(+project_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear la Asistencia con el id del Proyecto proporcionado"
        );
      }

      const weekOfTheYear = Array.from({ length: 52 }, (v, i) =>
        String(i + 1).padStart(2, "0")
      );
      if (data.queryParams.week) {
        const week = data.queryParams.week as string;
        const result = week.split(".");
        const dayWeek = result[1];
        if (!weekOfTheYear.includes(dayWeek)) {
          return httpResponse.BadRequestException(
            "No existe la semana que ha pasado"
          );
        }
      }

      const resultAllAssists = await prismaAssistsRepository.findAllByWeek(
        skip,
        data,
        +project_id
      );
      const { assistsConverter, total } = resultAllAssists;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        limit: data.queryParams.limit,
        pageCount,
        data: assistsConverter,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todas las Asistencias ya que existen",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Asistencia de la Semana ",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  private async findAndResponseWithAssists(
    project_id: number,
    skip: number,
    data: T_FindAllAssists,
    user_id?: number
  ): Promise<T_HttpResponse> {
    const date = new Date();
    const peruOffset = -5 * 60;

    const peruDate = new Date(
      date.getTime() + (date.getTimezoneOffset() + peruOffset) * 60000
    );
    peruDate.setUTCHours(0, 0, 0, 0);

    const result = await prismaWorkforceRepository.findAllByDate(
      peruDate,
      +project_id
    );

    if (!result || result.length === 0) {
      const resultAllAssists = await prismaAssistsRepository.findAll(
        skip,
        data,
        +project_id,
        user_id
      );
      return this.createSuccessResponse(resultAllAssists, data.queryParams);
    }
    const assistsResponse = await this.processWorkforceAssists(
      result,
      date,
      +project_id
    );
    if (!assistsResponse.success) {
      return httpResponse.BadRequestException(
        "Hubo un problema en Crear las asistencias de la Mano de Obra"
      );
    }
    const resultAllAssists = await prismaAssistsRepository.findAll(
      skip,
      data,
      +project_id,
      user_id
    );
    return this.createSuccessResponse(resultAllAssists, data.queryParams);
  }

  async synchronization(project_id: string) {
    try {
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }
      const date = new Date();
      const result = await prismaWorkforceRepository.findAllByDate(
        date,
        +project_id
      );
      if (!result || result.length === 0) {
        return httpResponse.BadRequestException(
          "No se encontro Mano de Obra para crear la asistencia",
          []
        );
      }
      const assistsResponse = await this.processWorkforceAssists(
        result,
        date,
        +project_id
      );
      if (!assistsResponse.success) {
        return httpResponse.BadRequestException(
          "Hubo un problema en crear la sincronización y hacer las asistencias de la Mano de Obra"
        );
      }
      return httpResponse.SuccessResponse(
        "Éxito al crear la sincronización de toda la Mano de Obra sin la Asistencia de Hoy",
        result
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear la sincronización de toda la Mano de Obra sin la Asistencia de Hoy",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async create(project_id: string, token: string): Promise<T_HttpResponse> {
    try {
      const userTokenResponse = await jwtService.getUserFromToken(token);
      if (!userTokenResponse) return userTokenResponse;
      const userResponse = userTokenResponse.payload as I_Usuario;

      const resultIdProject = await projectValidation.findById(+project_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear la Asistencia con el id del Proyecto proporcionado"
        );
      }

      const project= resultIdProject.payload as Proyecto;

      const date = new Date();
      const verifyDate = await assistsWorkforceValidation.findByDate(date,project.id);
      const workforcesManyResponse =
        await workforceValidation.findAllWithoutPaginationForProject(
          +project_id
        );

      if (!workforcesManyResponse || workforcesManyResponse.length === 0) {
        return httpResponse.SuccessResponse(
          "No se entontraron registros en la Mano de Obra en el Proyecto para crear la asistencia",
          []
        );
      }

      if (verifyDate.success) {
        return httpResponse.BadRequestException(
          "Ya se realizó la asistencia para este día"
        );
      }

      const assistsResponse = await this.processWorkforceAssists(
        workforcesManyResponse,
        date,
        +project_id
      );
      if (!assistsResponse.success) {
        return httpResponse.BadRequestException(
          "Hubo un problema en crear las asistencias de la Mano de Obra"
        );
      }

      return httpResponse.CreatedResponse("Asistencias creadas correctamente");
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear la asistencia",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async update(
    mano_obra_id: number,
    project_id: string,
    token: string
  ): Promise<T_HttpResponse> {
    try {
      const userTokenResponse = await jwtService.getUserFromToken(token);
      if (!userTokenResponse) return userTokenResponse;

      const resultIdProject = await projectValidation.findById(+project_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede actualizar la Asistencia con el id del Proyecto proporcionado"
        );
      }

      const workforceResponse = await workforceValidation.findById(
        +mano_obra_id
      );
      if (!workforceResponse.success) {
        return httpResponse.BadRequestException(
          "No se encontró el id de la Mano de Obra que quiere actualizar"
        );
      }

      const workforce = workforceResponse.payload as ManoObra;

      const assistsResponse = await assistsWorkforceValidation.findByDateAndMO(
        mano_obra_id, +project_id
      );

      if (!assistsResponse.success) {
        return httpResponse.BadRequestException(
          `No se encontró Asistencia para ${workforce.nombre_completo} ${workforce.apellido_materno} ${workforce.apellido_paterno}`
        );
      }

      const assists = assistsResponse.payload as Asistencia;

      const valuesAssists: { [key: string]: E_Asistencia_BD } = {
        A: E_Asistencia_BD.F,
        F: E_Asistencia_BD.A,
      };
      const resultValue = valuesAssists[assists.asistencia];

      let updateAssists;
      if (resultValue === E_Asistencia_BD.A) {
        updateAssists = await prismaAssistsRepository.updateAssistsPresent(
          assists.id,
          resultValue,
          +project_id
        );
      } else {
        updateAssists = await prismaAssistsRepository.updateAssistsNotPresent(
          assists.id,
          resultValue,
          +project_id
        );
      }

      return httpResponse.CreatedResponse(
        "Asistencia actualizada correctamente",
        updateAssists
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al actualizar la Asistencia",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async updateStatusAssists(
    assists_id: number,
    token: string
  ): Promise<T_HttpResponse> {
    try {
      const userTokenResponse = await jwtService.getUserFromToken(token);
      if (!userTokenResponse) return userTokenResponse;

      const resultAsssits = await assistsWorkforceValidation.findById(
        assists_id
      );
      if (!resultAsssits.success) {
        return resultAsssits;
      }

      const responseAssists = await prismaAssistsRepository.updateStatusAssists(
        assists_id
      );
      return httpResponse.CreatedResponse(
        "Asistencia eliminada correctamente",
        responseAssists
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al eliminar la Asistencia",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async findById(assists_id: number): Promise<T_HttpResponse> {
    try {
      const assistsResponse = await prismaAssistsRepository.findById(
        assists_id
      );
      if (!assistsResponse) {
        return httpResponse.NotFoundException(
          "El id de la Asistencia no fue encontrado"
        );
      }
      return httpResponse.SuccessResponse(
        "Asistencia encontrada",
        assistsResponse
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Asistencia",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async processWorkforceAssists(
    workforcesManyResponse: any[],
    date: Date,
    project_id: number
  ): Promise<{ success: boolean }> {
    const processedDate = new Date(date.toLocaleDateString("en-CA"));
    const valueIsBetweenWeek = 8.5;
    const valueIsEndWeek = 5.5;
    const value = this.isBetweenWeek(date)
      ? valueIsBetweenWeek
      : valueIsEndWeek;

    const assistsPromises = workforcesManyResponse.map((workforce) => {
      const assistsFormat = {
        fecha: processedDate,
        horas: value,
        hora_parcial: 0,
        hora_normal: 0,
        horas_trabajadas: 0,
        horas_60: 0,
        horas_100: 0,
        asistencia: E_Asistencia_BD.F,
        horas_extras_estado: E_Estado_BD.n,
        mano_obra_id: workforce.id,
        proyecto_id: project_id,
      };

      return prismaAssistsRepository.createAssists(assistsFormat);
    });

    const assistsResponses = await Promise.all(assistsPromises);

    const success = assistsResponses.every((response) => response !== null);

    return { success };
  }
  async findAllPresents(
    data: T_FindAllAssistsForDailyPart,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }

      if (data.queryParams.category && data.queryParams.category !== "TODOS") {
        const categoriesWorkforce =
          await categoryWorkforceValidation.findAllWithPagination(project_id);
        const categories = categoriesWorkforce.payload as CategoriaObrero[];
        const flag = categories.some(
          (categorie) => categorie.id === +data.queryParams.category
        );
        if (!flag) {
          return httpResponse.BadRequestException(
            "El id introducido de la Categoria no existe"
          );
        }
      }

      if (data.queryParams.combo) {
        const comboResponse = await comboValidation.findManyWithOutPagination(
          project_id
        );
        const combos = comboResponse.payload as Combo[];
        const flag = combos.some(
          (combo) => combo.id === +data.queryParams.combo
        );
        if (!flag) {
          return httpResponse.BadRequestException(
            "El id introducido del Combo no existe"
          );
        }
      }

      const result = await prismaAssistsRepository.findAllPresents(
        skip,
        data,
        project_id
      );

      const { assists, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: assists,
      };
      return httpResponse.SuccessResponse(
        "La Asistencia de los presentes fue encontrada con éxito",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Asistencia de los presentes",
        error
      );
    }
  }

  async findDatesForLegend(project_id: number) {
    try {
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }
      const result = await prismaAssistsRepository.findDatesByLegend(
        project_id
      );

      return httpResponse.SuccessResponse(
        "Se encontró con éxito los datos de la Leyenda",
        result
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar los datos para la Leyenda de la Asistencia",
        error
      );
    }
  }

  createSuccessResponse(result: any, queryParams: any): T_HttpResponse {
    const { assistsConverter, total } = result;
    const pageCount = Math.ceil(total / queryParams.limit);
    const formData = {
      total,
      page: queryParams.page,
      limit: queryParams.limit,
      pageCount,
      data: assistsConverter,
    };
    return httpResponse.SuccessResponse(
      "Éxito al traer todas las Asistencias ya que existen",
      formData
    );
  }
  private verifyState(state: string): Boolean {
    const valoresPosibles = [
      "ASIGNADO",
      "DOBLEMENTE_ASIGNADO",
      "FALTA",
      "NO_ASIGNADO",
    ];
    return valoresPosibles.includes(state);
  }
  isBetweenWeek(date: Date): boolean {
    const dayWeek = date.getDay(); // Obtiene el día de la semana (0 para domingo, 1 para lunes, etc.)
    return dayWeek >= 1 && dayWeek <= 5; // Lunes (1) a viernes (5)
  }

  // isFinDeSemana(date: Date): boolean {
  //   const dayWeek = date.getDay();
  //   return dayWeek === 0 || dayWeek === 6; // Domingo (0) o sábado (6)
  // }
}

export const assistsService = new AssistsService();
