import * as xlsx from "xlsx";
import { I_WorkforceExcel } from "./models/workforce.interface";
import { httpResponse } from "@/common/http.response";
import { projectValidation } from "@/project/project.validation";
import {
  Banco,
  CategoriaObrero,
  E_Estado_MO_BD,
  EspecialidadObrero,
  ManoObra,
  OrigenObrero,
  Proyecto,
  TipoObrero,
  Unidad,
  Usuario,
} from "@prisma/client";
import prisma from "@/config/prisma.config";
import { typeWorkforceValidation } from "@/typeWorkforce/typeWorkforce.validation";
import { originWorkforceValidation } from "@/originWorkforce/originWorkforce.validation";
import { specialtyWorkforceValidation } from "@/specialtyWorkforce/specialtyWorkfoce.validation";
import { unitValidation } from "@/unit/unit.validation";
import { categoryWorkforceValidation } from "@/categoryWorkforce/categoryWorkforce.validation";
import { bankWorkforceValidation } from "@/bankWorkforce/bankWorkforce.validation";
import { workforceValidation } from "./workforce.validation";
import { jwtService } from "@/auth/jwt.service";
import { T_FindAllWorkforce } from "./models/workforce.types";
import { prismaWorkforceRepository } from "./prisma-workforce.repository";

class WorkforceService {
  async registerWorkforceMasive(file: any, project_id: number, token: string) {
    try {
      const buffer = file.buffer;

      const workbook = xlsx.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetToJson = xlsx.utils.sheet_to_json(sheet) as I_WorkforceExcel[];
      let error = 0;
      let errorNumber = 0;
      let errorRows: number[] = [];
      const userTokenResponse = await jwtService.getUserFromToken(token);
      if (!userTokenResponse.success) {
        return userTokenResponse;
      }
      const userResponse = userTokenResponse.payload as Usuario;
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
        sheetToJson.map(async (item: I_WorkforceExcel, index: number) => {
          index++;
          if (
            item.DNI === undefined ||
            item["APELLIDO Y NOMBRE COMPLETO"] === undefined ||
            item.TIPO === undefined ||
            item.ORIGEN === undefined ||
            item.CATEGORIA === undefined ||
            item.ESPECIALIDAD === undefined ||
            item.UNIDAD === undefined
          ) {
            error++;
            errorRows.push(index + 1);
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo.El DNI,NOMBRE Y APELLIDO, TIPO, ORIGEN, CATEGORIA, ESPECIALIDAD, UNIDAD son obligatorios.Verificar las filas: ${errorRows.join(
            ", "
          )}.`
        );
      }

      //[note] buscar si existe el nombre del tipo
      await Promise.all(
        sheetToJson.map(async (item: I_WorkforceExcel, index: number) => {
          index++;

          const typeResponse = await typeWorkforceValidation.findByName(
            item.TIPO.trim(),
            responseProject.id
          );
          if (!typeResponse.success) {
            error++;
            errorRows.push(index + 1);
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. El nombre del Tipo de Mano de Obra no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(
            ", "
          )}`
        );
      }
      //[note] buscar si existe el nombre del Origen
      await Promise.all(
        sheetToJson.map(async (item: I_WorkforceExcel, index: number) => {
          index++;

          const originResponse = await originWorkforceValidation.findByName(
            item.ORIGEN.trim(),
            responseProject.id
          );
          if (!originResponse.success) {
            error++;
            errorRows.push(index + 1);
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. El nombre del Origen de Mano de Obra no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(
            ", "
          )}`
        );
      }
      //[note] buscar si existe el nombre de la Categoria
      await Promise.all(
        sheetToJson.map(async (item: I_WorkforceExcel, index: number) => {
          index++;

          const categoryResponse = await categoryWorkforceValidation.findByName(
            item.CATEGORIA.trim(),
            responseProject.id
          );
          if (!categoryResponse.success) {
            error++;
            errorRows.push(index + 1);
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. El nombre de la Categoria de Mano de Obra no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(
            ", "
          )}`
        );
      }
      //[note] buscar si existe el nombre de la Especialidad
      await Promise.all(
        sheetToJson.map(async (item: I_WorkforceExcel, index: number) => {
          index++;

          const specialtyResponse =
            await specialtyWorkforceValidation.findByName(
              item.ESPECIALIDAD.trim(),
              responseProject.id
            );
          if (!specialtyResponse.success) {
            error++;
            errorRows.push(index + 1);
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. La Especialidad del Origen de Mano de Obra no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(
            ", "
          )}`
        );
      }
      //[note] buscar si existe el simbolo de la Unidad
      await Promise.all(
        sheetToJson.map(async (item: I_WorkforceExcel, index: number) => {
          index++;

          const unitResponse = await unitValidation.findBySymbol(
            item.UNIDAD.trim(),
            responseProject.id
          );
          if (!unitResponse.success) {
            error++;
            errorRows.push(index + 1);
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. El nombre de la Unidad de Mano de Obra no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(
            ", "
          )}`
        );
      }
      //[note] buscar si existe el nombre del Banco
      await Promise.all(
        sheetToJson.map(async (item: I_WorkforceExcel, index: number) => {
          index++;

          if (item.BANCO) {
            const bankResponse = await bankWorkforceValidation.findByName(
              item.BANCO.trim(),
              responseProject.id
            );
            if (!bankResponse.success) {
              error++;
              errorRows.push(index + 1);
            }
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. El nombre del Banco de Mano de Obra no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(
            ", "
          )}`
        );
      }
      //[note] Verifico si el estado es uno de los que existen
      await Promise.all(
        sheetToJson.map(async (item: I_WorkforceExcel, index: number) => {
          index++;
          if (
            item.ESTADO.toUpperCase() != E_Estado_MO_BD.ACTIVO &&
            item.ESTADO.toUpperCase() != E_Estado_MO_BD.INACTIVO
          ) {
            error++;
            errorRows.push(index + 1);
          }
        })
      );
      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. El Estado de la Mano de Obra sólo puede ser Activo o Inactivo. Fallo en las siguientes filas: ${errorRows.join(
            ", "
          )}`
        );
      }

      // //[SUCCESS] Guardo o actualizo la Mano de Obraa
      let workforceResponse;
      let workforce;
      for (const item of sheetToJson) {
        workforceResponse = await workforceValidation.findByDni(
          item.DNI.toString(),
          project_id
        );
        if (workforceResponse.success) {
          workforce = workforceResponse.payload as ManoObra;
          await workforceValidation.updateWorkforce(
            item,
            responseProject.id,
            workforce.id,
            userResponse.id
          );
        } else {
          const typeResponse = await typeWorkforceValidation.findByName(
            item.TIPO,
            responseProject.id
          );

          const type = typeResponse.payload as TipoObrero;
          const originResponse = await originWorkforceValidation.findByName(
            item.ORIGEN,
            responseProject.id
          );
          const origin = originResponse.payload as OrigenObrero;
          const categoryResponse = await categoryWorkforceValidation.findByName(
            item.CATEGORIA,
            responseProject.id
          );
          const category = categoryResponse.payload as CategoriaObrero;
          const specialtyResponse =
            await specialtyWorkforceValidation.findByName(
              item.ESPECIALIDAD,
              responseProject.id
            );
          const specialty = specialtyResponse.payload as EspecialidadObrero;
          const unitResponse = await unitValidation.findBySymbol(
            item.UNIDAD,
            responseProject.id
          );
          const unit = unitResponse.payload as Unidad;
          let bank;
          if (item.BANCO) {
            const bankResponse = await bankWorkforceValidation.findByName(
              item.BANCO,
              responseProject.id
            );
            bank = bankResponse.payload as Banco;
          }
          const lastWorkforce = await workforceValidation.codeMoreHigh(
            project_id
          );
          const lastWorkforceResponse = lastWorkforce.payload as ManoObra;

          // Incrementar el código en 1
          const nextCodigo = (parseInt(lastWorkforceResponse?.codigo) || 0) + 1;

          const formattedCodigo = nextCodigo.toString().padStart(3, "0");
          const excelEpoch = new Date(1899, 11, 30);
          let inicioDate;
          if (item.INGRESO) {
            inicioDate = new Date(
              excelEpoch.getTime() + item.INGRESO * 86400000
            );
            inicioDate.setUTCHours(0, 0, 0, 0);
          }
          let endDate;
          if (item.CESE) {
            endDate = new Date(excelEpoch.getTime() + item.CESE * 86400000);
            endDate.setUTCHours(0, 0, 0, 0);
          }
          let dateOfBirth;
          if (item["FECHA DE NACIMIENTO"]) {
            dateOfBirth = new Date(
              excelEpoch.getTime() + item["FECHA DE NACIMIENTO"] * 86400000
            );
            dateOfBirth.setUTCHours(0, 0, 0, 0);
          }
          await prisma.manoObra.create({
            data: {
              codigo: formattedCodigo,
              documento_identidad: item.DNI.toString(),
              nombre_completo: item["APELLIDO Y NOMBRE COMPLETO"],
              tipo_obrero_id: type.id,
              origen_obrero_id: origin.id,
              categoria_obrero_id: category.id,
              especialidad_obrero_id: specialty.id,
              unidad_id: unit.id,
              banco_id: bank ? bank.id : null,
              fecha_inicio: item.INGRESO ? inicioDate : null,
              fecha_cese: item.CESE ? endDate : null,
              fecha_nacimiento: item["FECHA DE NACIMIENTO"]
                ? dateOfBirth
                : null,
              estado:
                item.ESTADO == E_Estado_MO_BD.ACTIVO
                  ? E_Estado_MO_BD.ACTIVO
                  : E_Estado_MO_BD.INACTIVO,
              escolaridad: item.ESCOLARIDAD ? String(item.ESCOLARIDAD) : null,
              cuenta: item.CUENTA,
              telefono: String(item.CELULAR),
              email_personal: item.CORREO,
              observacion: item.OBSERVACION,
              proyecto_id: responseProject.id,
              usuario_id: userResponse.id,
            },
          });
        }
      }

      await prisma.$disconnect();

      return httpResponse.SuccessResponse("Empleados creados correctamente!");
    } catch (error) {
      await prisma.$disconnect();
      return httpResponse.InternalServerErrorException(
        "Error al leer la Mano de Obra",
        error
      );
    }
  }
  async findAll(data: T_FindAllWorkforce, project_id: string) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }
      const result = await prismaWorkforceRepository.findAll(
        skip,
        data,
        +project_id
      );

      const { workforces, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: workforces,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer toda la Mano de Obra",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer toda la Mano de Obra",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const workforceService = new WorkforceService();
