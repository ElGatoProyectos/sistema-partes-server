import { projectValidation } from "@/project/project.validation";
import {
  I_CreateTrainUnitBody,
  I_Cuadrilla_Train,
  I_TrainExcel,
  I_UpdateTrainBody,
} from "./models/production-unit.interface";
import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { trainValidation } from "./train.validation";
import { Proyecto, Tren } from "@prisma/client";
import { prismaTrainRepository } from "./prisma-train.repository";
import { TrainResponseMapper } from "./mappers/train.mapper";
import * as xlsx from "xlsx";
import prisma from "@/config/prisma.config";
import { T_FindAll } from "@/common/models/pagination.types";
import validator from "validator";
import { T_FindAllTrain } from "./models/train.types";

class TrainService {
  async createTrain(
    data: I_CreateTrainUnitBody,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const resultTrain = await trainValidation.findByName(
        data.nombre,
        project_id
      );
      if (!resultTrain.success) {
        return resultTrain;
      }
      const resultIdProject = await projectValidation.findById(project_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear el Tren con el id del Proyecto proporcionado"
        );
      }

      const lastTrain = await trainValidation.codeMoreHigh(project_id);
      const lastTrainResponse = lastTrain.payload as Tren;

      // Incrementar el código en 1
      const nextCodigo = (parseInt(lastTrainResponse?.codigo) || 0) + 1;

      const formattedCodigo = nextCodigo.toString().padStart(3, "0");

      const trainFormat = {
        ...data,
        codigo: formattedCodigo,
        operario: 1,
        oficial: 1,
        peon: 1,
        proyecto_id: project_id,
      };

      const responseTrain = await prismaTrainRepository.createTrain(
        trainFormat
      );
      const trainMapper = new TrainResponseMapper(responseTrain);
      return httpResponse.CreatedResponse(
        "Tren creado correctamente",
        trainMapper
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear Tren",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateTrain(
    data: I_UpdateTrainBody,
    idTrain: number,
    project_id: string
  ): Promise<T_HttpResponse> {
    try {
      const resultIdTrain = await trainValidation.findById(idTrain);
      if (!resultIdTrain.success) {
        return httpResponse.BadRequestException(
          "No se pudo encontrar el id del Tren que se quiere editar"
        );
      }
      const resultTrainFind = resultIdTrain.payload as Tren;
      if (resultTrainFind.nombre != data.nombre) {
        const resultTrain = await trainValidation.findByName(
          data.nombre,
          +project_id
        );
        if (!resultTrain.success) {
          return resultTrain;
        }
      }
      const resultIdProject = await projectValidation.findById(+project_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear el Tren con el id del proyecto proporcionado"
        );
      }
      const trainResponse = resultIdTrain.payload as Tren;
      const trainFormat = {
        ...data,
        operario: data.operario,
        oficial: data.oficial,
        peon: data.peon,
        proyecto_id: +project_id,
      };
      const responseTrain = await prismaTrainRepository.updateTrain(
        trainFormat,
        idTrain
      );
      const trainMapper = new TrainResponseMapper(responseTrain);
      return httpResponse.SuccessResponse(
        "Tren modificado correctamente",
        trainMapper
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar el Tren",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateCuadrillaTrain(data: I_Cuadrilla_Train, train_id: number) {
    try {
      const resultIdTrain = await trainValidation.findById(train_id);
      if (!resultIdTrain.success) {
        return httpResponse.BadRequestException(
          "No se pudo encontrar el id del Tren que se quiere editar"
        );
      }
      const trainUpdate = await prismaTrainRepository.updateCuadrillaByIdTrain(
        train_id,
        data.official,
        data.pawns,
        data.workers
      );
      const trainMapper = new TrainResponseMapper(trainUpdate);
      return httpResponse.SuccessResponse(
        "Cuadrilla del Tren modificada con éxito",
        trainMapper
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al editar la cuadrilla del Tren",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findById(idTrain: number): Promise<T_HttpResponse> {
    try {
      const trainResponse = await prismaTrainRepository.findById(idTrain);
      if (!trainResponse) {
        return httpResponse.NotFoundException(
          "El id del Tren no fue no encontrado"
        );
      }
      return httpResponse.SuccessResponse("Tren encontrado", trainResponse);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Tren",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findByName(
    name: string,
    data: T_FindAll,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const result = await prismaTrainRepository.searchNameTrain(
        name,
        skip,
        data.queryParams.limit,
        +project_id
      );

      const { trains, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: trains,
      };
      return httpResponse.SuccessResponse("Éxito al buscar el Tren", formData);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Trenes",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findAll(data: T_FindAllTrain, project_id: string) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const result = await prismaTrainRepository.findAll(
        skip,
        data,
        +project_id
      );

      const { trains, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: trains,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todos los Trenes",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todas los Trenes",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateStatusTrain(idTrain: number): Promise<T_HttpResponse> {
    try {
      const trainResponse = await trainValidation.findById(idTrain);
      if (!trainResponse.success) {
        return trainResponse;
      } else {
        const result = await prismaTrainRepository.updateStatusTrain(idTrain);
        return httpResponse.SuccessResponse(
          "Tren eliminado correctamente",
          result
        );
      }
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error en eliminar el Tren",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async registerTrainMasive(file: any, project_id: number) {
    try {
      const buffer = file.buffer;

      const workbook = xlsx.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetToJson = xlsx.utils.sheet_to_json(sheet) as I_TrainExcel[];
      let error = 0;
      let errorNumber = 0;
      //[NOTE] PARA QUE NO TE DE ERROR EL ARCHIVO:
      //[NOTE] SI HAY 2 FILAS AL PRINCIPIO VACIAS
      //[NOTE] EL CODIGO DEBE ESTAR COMO STRING
      //[NOTE] -NO DEBE EL CODIGO TENER LETRAS
      //[NOTE] -QUE EL CÓDIGO EMPIECE CON EL 001
      //[NOTE] -QUE LOS CÓDIGOS VAYAN AUMENTANDO
      //[NOTE] -NO PUEDE SER EL CÓDGO MAYOR A 1 LA DIFERENCIA ENTRE CADA UNO

      //[NOTE] ACÁ VERIFICA SI HAY 2 FILAS VACIAS
      //Usamos rango 0 para verificar q estamos leyendo las primeras filas
      const firstTwoRows: any = xlsx.utils
        .sheet_to_json(sheet, { header: 1, range: 0, raw: true })
        .slice(0, 2); //nos limitamos a las primeras 2
      //verificamos si están vacias las primeras filas
      const isEmptyRow = (row: any[]) =>
        row.every((cell) => cell === null || cell === undefined || cell === "");
      //verificamos si tiene menos de 2 filas o si en las primeras 2 esta vacia lanzamos el error
      if (
        firstTwoRows.length < 2 ||
        (isEmptyRow(firstTwoRows[0]) && isEmptyRow(firstTwoRows[1]))
      ) {
        return httpResponse.BadRequestException(
          "Error al leer el archivo. Verificar los campos"
        );
      }
      const project = await projectValidation.findById(project_id);
      if (!project.success) return project;
      const responseProject = project.payload as Proyecto;
      const seenCodes = new Set<string>();
      let previousCodigo: number | null = null;

      //[note] aca si hay espacio en blanco.
      await Promise.all(
        sheetToJson.map(async (item: I_TrainExcel, index: number) => {
          index++;
          if (item["ID-TREN"] == undefined || item.TREN == undefined) {
            error++;
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          "Error al leer el archivo. Verificar los campos"
        );
      }

      //[note] Aca verificamos que el codigo no tenga letras ni que sea menor que el anterior
      await Promise.all(
        sheetToJson.map(async (item: I_TrainExcel) => {
          //verificamos si tenemos el codigo
          const codigo = parseInt(item["ID-TREN"], 10); // Intenta convertir el string a número

          if (!validator.isNumeric(item["ID-TREN"])) {
            errorNumber++; // Aumenta si el código no es un número válido
          } else {
            // Verifica si el código ya ha sido procesado
            if (!seenCodes.has(item["ID-TREN"])) {
              // errorNumber++; // Aumenta si hay duplicado
              seenCodes.add(item["ID-TREN"]);
            }

            // Verifica si el código actual no es mayor que el anterior
            if (previousCodigo !== null && codigo <= previousCodigo) {
              errorNumber++;
            }

            previousCodigo = codigo;
          }
        })
      );

      if (errorNumber > 0) {
        return httpResponse.BadRequestException(
          "Error al leer el archivo. Verificar los campos"
        );
      }

      //[NOTE] Acá verifico si el primer elemento es 001
      const sortedCodesArray = Array.from(seenCodes)
        .map((item) => item.padStart(3, "0"))
        .sort((a, b) => parseInt(a) - parseInt(b));

      if (sortedCodesArray[0] != "001") {
        errorNumber++;
      }

      if (errorNumber > 0) {
        return httpResponse.BadRequestException(
          "Error al leer el archivo. Verificar los campos"
        );
      }
      //[NOTE] ACÁ DE QUE LA DIFERENCIA SEA SÓLO 1
      for (let i = 1; i < sortedCodesArray.length; i++) {
        const currentCode = parseInt(sortedCodesArray[i]);
        const previousCode = parseInt(sortedCodesArray[i - 1]);

        if (currentCode !== previousCode + 1) {
          errorNumber++; // Aumenta si el código actual no es 1 número mayor que el anterior
          break; // Puedes detener el ciclo en el primer error
        }
      }

      if (errorNumber > 0) {
        return httpResponse.BadRequestException(
          "Error al leer el archivo. Verificar los campos"
        );
      }

      //[SUCCESS] Guardo o actualizo la Unidad de Producción
      let code;
      let productionUnit;
      await Promise.all(
        sheetToJson.map(async (item: I_TrainExcel) => {
          code = await trainValidation.findByCode(
            String(item["ID-TREN"]),
            project_id
          );
          if (!code.success) {
            productionUnit = code.payload as Tren;
            await trainValidation.updateTrain(
              item,
              +productionUnit.id,
              responseProject.id
            );
          } else {
            await prisma.tren.create({
              data: {
                codigo: String(item["ID-TREN"]),
                nombre: item.TREN,
                nota: item.NOTA,
                operario: 1,
                oficial: 1,
                peon: 1,
                proyecto_id: responseProject.id,
              },
            });
          }
        })
      );

      await prisma.$disconnect();

      return httpResponse.SuccessResponse("Trenes creados correctamente!");
    } catch (error) {
      console.log(error);
      await prisma.$disconnect();
      return httpResponse.InternalServerErrorException(
        "Error al leer el Tren",
        error
      );
    }
  }
}

export const trainService = new TrainService();
