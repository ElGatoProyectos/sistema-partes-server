import prisma from "@/config/prisma.config";
import { CategoriaObrero, E_Estado_BD } from "@prisma/client";
import {
  I_CategoryWorkforce,
  I_CreateCategoryWorkforceBD,
  I_UpdateCategoryWorkforceBD,
} from "./models/categoryWorkforce.interface";
import { CategoryWorkforceRepository } from "./categoryWorkforce.repository";
import { T_FindAllCategoryWorkforce } from "./models/categoryWorkforce.types";

class PrismaCategoryWorkforceRepository implements CategoryWorkforceRepository {
  async createCategoryWorkforce(
    data: I_CreateCategoryWorkforceBD
  ): Promise<CategoriaObrero> {
    const categoryWorkforce = await prisma.categoriaObrero.create({
      data,
    });
    return categoryWorkforce;
  }

  async createCategoryWorkforceMasive(
    data: I_CreateCategoryWorkforceBD[]
  ): Promise<{ count: number }> {
    const categoryWorkforces = await prisma.categoriaObrero.createMany({
      data,
    });
    return categoryWorkforces;
  }
  async updateCategoryWorkforce(
    category_id: number,
    data: I_UpdateCategoryWorkforceBD
  ): Promise<CategoriaObrero> {
    const category = await prisma.categoriaObrero.update({
      where: {
        id: category_id,
      },
      data: data,
    });
    return category;
  }

  async updateStatusCategoryWorkforce(
    category_id: number
  ): Promise<CategoriaObrero> {
    const categoryResponse = await prisma.categoriaObrero.update({
      where: {
        id: category_id,
      },
      data: {
        eliminado: E_Estado_BD.y,
      },
    });
    return categoryResponse;
  }

  async findByName(
    name: string,
    project_id: number
  ): Promise<CategoriaObrero | null> {
    const categoryWorkforce = await prisma.categoriaObrero.findFirst({
      where: {
        nombre: {
          contains: name,
        },
        proyecto_id: project_id,
      },
    });
    return categoryWorkforce;
  }
  async findAll(
    skip: number,
    data: T_FindAllCategoryWorkforce,
    project_id: number
  ): Promise<{ categories: I_CategoryWorkforce[]; total: number }> {
    let filters: any = {};

    if (data.queryParams.search) {
      filters.nombre = {
        contains: data.queryParams.search,
      };
    }
    const [categories, total]: [I_CategoryWorkforce[], number] =
      await prisma.$transaction([
        prisma.categoriaObrero.findMany({
          where: {
            ...filters,
            eliminado: E_Estado_BD.n,
            proyecto_id: project_id,
          },
          skip,
          take: data.queryParams.limit,
          omit: {
            eliminado: true,
          },
        }),
        prisma.categoriaObrero.count({
          where: {
            ...filters,
            eliminado: E_Estado_BD.n,
            proyecto_id: project_id,
          },
        }),
      ]);
    return { categories, total };
  }
  async findById(category_id: number): Promise<I_CategoryWorkforce | null> {
    const categoryWorkforce = await prisma.categoriaObrero.findFirst({
      where: {
        id: category_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return categoryWorkforce;
  }
}

export const prismaCategoryWorkforceRepository =
  new PrismaCategoryWorkforceRepository();
