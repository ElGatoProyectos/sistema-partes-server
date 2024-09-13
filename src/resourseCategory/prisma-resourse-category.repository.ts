import prisma from "@/config/prisma.config";
import { ResourseCategoryRepository } from "./resourseCategory.repository";
import {
  I_ResourseCategory,
  I_CreateResourseCategoryBD,
  I_UpdateResourseCategoryBody,
} from "./models/resourseCategory.interface";
import { CategoriaRecurso, E_Estado_BD } from "@prisma/client";

class PrismaResourseCategoryRepository implements ResourseCategoryRepository {
  async searchNameResourseCategory(
    name: string,
    skip: number,
    limit: number
  ): Promise<{
    resoursesCategories: I_ResourseCategory[];
    total: number;
  }> {
    const [resoursesCategories, total]: [I_ResourseCategory[], number] =
      await prisma.$transaction([
        prisma.categoriaRecurso.findMany({
          where: {
            nombre: {
              contains: name,
            },
            eliminado: E_Estado_BD.n,
          },
          skip,
          take: limit,
          omit: {
            eliminado: true,
          },
        }),
        prisma.unidadProduccion.count({
          where: {
            nombre: {
              contains: name,
            },
            eliminado: E_Estado_BD.n,
          },
        }),
      ]);
    return { resoursesCategories, total };
  }
  async findAll(
    skip: number,
    limit: number
  ): Promise<{
    categoriesResources: I_ResourseCategory[];
    total: number;
  }> {
    const [categoriesResources, total]: [I_ResourseCategory[], number] =
      await prisma.$transaction([
        prisma.categoriaRecurso.findMany({
          where: {
            eliminado: E_Estado_BD.n,
          },
          skip,
          take: limit,
          omit: {
            eliminado: true,
          },
        }),
        prisma.categoriaRecurso.count({
          where: {
            eliminado: E_Estado_BD.n,
          },
        }),
      ]);
    return { categoriesResources, total };
  }

  async findById(
    idResourseCategory: number
  ): Promise<I_ResourseCategory | null> {
    const resourseCategory = await prisma.categoriaRecurso.findFirst({
      where: {
        id: idResourseCategory,
        eliminado: E_Estado_BD.n,
      },
      omit: {
        eliminado: true,
      },
    });
    return resourseCategory;
  }

  async existsName(name: string): Promise<CategoriaRecurso | null> {
    const resourseCategory = await prisma.categoriaRecurso.findFirst({
      where: {
        nombre: name,
        eliminado: E_Estado_BD.n,
      },
    });
    return resourseCategory;
  }

  async createResourseCategory(
    data: I_CreateResourseCategoryBD
  ): Promise<CategoriaRecurso> {
    const resourseCategory = await prisma.categoriaRecurso.create({
      data,
    });
    return resourseCategory;
  }

  async updateResourseCategory(
    data: I_UpdateResourseCategoryBody,
    idResourseCategory: number
  ): Promise<CategoriaRecurso> {
    const resourseCategory = await prisma.categoriaRecurso.update({
      where: { id: idResourseCategory },
      data: data,
    });
    return resourseCategory;
  }
  async updateStatusResourseCategory(
    idResourseCategory: number
  ): Promise<CategoriaRecurso> {
    const resourseCategory = await prisma.categoriaRecurso.findFirst({
      where: {
        id: idResourseCategory,
      },
    });

    const newStateResourseCategory =
      resourseCategory?.eliminado == E_Estado_BD.y
        ? E_Estado_BD.n
        : E_Estado_BD.y;

    const companyUpdate = await prisma.categoriaRecurso.update({
      where: { id: idResourseCategory },
      data: {
        eliminado: newStateResourseCategory,
      },
    });
    return companyUpdate;
  }
}

export const prismaResourseCategoryRepository =
  new PrismaResourseCategoryRepository();
