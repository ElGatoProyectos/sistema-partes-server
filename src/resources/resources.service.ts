import { unifiedIndexValidation } from "./../unifiedIndex/unifiedIndex.validation";
import * as xlsx from "xlsx";
import { I_ResourcesExcel } from "./models/resources.interface";
import { httpResponse } from "@/common/http.response";
import {
  CategoriaRecurso,
  IndiceUnificado,
  Proyecto,
  Recurso,
  Unidad,
} from "@prisma/client";
import { projectValidation } from "@/project/project.validation";
import prisma from "@/config/prisma.config";
import { resourceValidation } from "./resources.validation";
import { resourseCategoryValidation } from "@/resourseCategory/resourseCategory.validation";
import { unitValidation } from "@/unit/unit.validation";
import { T_FindAllResource } from "./models/resource.types";
import { prismaResourcesRepository } from "./prisma-resources.repository";

class ResourceService {
  async registerResourceMasive(file: any, project_id: number) {
    try {
      const buffer = file.buffer;

      const workbook = xlsx.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetToJson = xlsx.utils.sheet_to_json(sheet) as I_ResourcesExcel[];
      let error = 0;
      let errorNumber = 0;
      let errorRows: number[] = [];
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
        sheetToJson.map(async (item: I_ResourcesExcel, index: number) => {
          index++;
          if (
            item["NOMBRE INDICE UNIFICADO"] === undefined ||
            item.CODIGO == undefined ||
            item["NOMBRE DEL RECURSO"] === undefined ||
            item.UNIDAD === undefined ||
            item["NOMBRE CATEGORIA RECURSO"] === undefined
          ) {
            error++;
            errorRows.push(index + 1);
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo.El NOMBRE INDICE UNIFICADO,CODIGO, NOMBRE DEL RECURSO, UNIDAD, NOMBRE CATEGORIA RECURSO son obligatorios.Verificar las filas: ${errorRows.join(
            ", "
          )}.`
        );
      }

      //[note] buscar si existe el nombre del Indice Unificado
      await Promise.all(
        sheetToJson.map(async (item: I_ResourcesExcel, index: number) => {
          index++;

          const unifiedIndexResponse = await unifiedIndexValidation.findByName(
            item["NOMBRE INDICE UNIFICADO"].trim(),
            responseProject.id
          );
          if (!unifiedIndexResponse.success) {
            error++;
            errorRows.push(index + 1);
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. El nombre del Indice Unificado no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(
            ", "
          )}`
        );
      }

      //[note] buscar si existe el nombre de la Unidad
      await Promise.all(
        sheetToJson.map(async (item: I_ResourcesExcel, index: number) => {
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
          `Error al leer el archivo. El nombre de la Unidad no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(
            ", "
          )}`
        );
      }

      //[note] buscar si existe el nombre de la Categoria del Recurso
      await Promise.all(
        sheetToJson.map(async (item: I_ResourcesExcel, index: number) => {
          index++;
          const resourceCategoryResponse =
            await resourseCategoryValidation.existsName(
              item["NOMBRE CATEGORIA RECURSO"].trim(),
              responseProject.id
            );
          if (!resourceCategoryResponse.success) {
            error++;
            errorRows.push(index + 1);
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. El nombre de la Categoria del Recurso no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(
            ", "
          )}`
        );
      }

      //  [SUCCESS] Guardo o actualizo el Recursoo
      let resourceResponse;
      let resource;

      for (const item of sheetToJson) {
        resourceResponse = await resourceValidation.findByNameValidation(
          String(item["NOMBRE DEL RECURSO"].trim()),
          project_id
        );
        if (resourceResponse.success) {
          resource = resourceResponse.payload as Recurso;
          await resourceValidation.updateResource(
            item,
            +resource.id,
            responseProject.id
          );
        } else {
          const resourceCategoryResponse =
            await resourseCategoryValidation.existsName(
              item["NOMBRE CATEGORIA RECURSO"].trim(),
              project_id
            );
          const resourceCategory =
            resourceCategoryResponse.payload as CategoriaRecurso;
          const unitResponse = await unitValidation.findBySymbol(
            item.UNIDAD,
            project_id
          );
          const unit = unitResponse.payload as Unidad;
          const unifiedIndexResponse = await unifiedIndexValidation.findByName(
            item["NOMBRE INDICE UNIFICADO"].trim(),
            project_id
          );
          const unifiedIndex = unifiedIndexResponse.payload as IndiceUnificado;
          const lastResource = await resourceValidation.codeMoreHigh(
            project_id
          );
          const lastResourceFind = lastResource.payload as Recurso;

          // Incrementar el código en 1
          const nextCodigo = (parseInt(lastResourceFind?.codigo) || 0) + 1;

          const formattedCodigo = nextCodigo.toString().padStart(4, "0");
          await prisma.recurso.create({
            data: {
              codigo: formattedCodigo,
              nombre: item["NOMBRE DEL RECURSO"],
              precio: item.PRECIO ? parseInt(item.PRECIO) : null,
              unidad_id: unit.id,
              proyecto_id: project_id,
              id_unificado: unifiedIndex.id,
              categoria_recurso_id: resourceCategory.id,
            },
          });
        }
      }

      await prisma.$disconnect();

      return httpResponse.SuccessResponse("Recursos creados correctamente!");
    } catch (error) {
      await prisma.$disconnect();
      return httpResponse.InternalServerErrorException(
        "Error al leer los Recursos",
        error
      );
    }
  }
  async findAll(data: T_FindAllResource, project_id: string) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }
      const result = await prismaResourcesRepository.findAll(
        skip,
        data,
        +project_id
      );

      const { resources, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: resources,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todos los Recursos",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todos los Recursos",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const resourceService = new ResourceService();
