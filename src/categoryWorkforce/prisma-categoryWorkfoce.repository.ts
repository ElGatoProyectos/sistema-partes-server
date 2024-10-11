import prisma from "@/config/prisma.config";
import { CategoriaObrero, E_Estado_BD } from "@prisma/client";
import {
  I_CategoryWorkforce,
  I_CreateCategoryWorkforceBD,
} from "./models/categoryWorkforce.interface";
import { BankCategoryforceRepository } from "./categoryWorkforce.repository";

class PrismaCategoryWorkforceRepository implements BankCategoryforceRepository {
  async createCategoryWorkforceMasive(
    data: I_CreateCategoryWorkforceBD[]
  ): Promise<{ count: number }> {
    const categoryWorkforces = await prisma.categoriaObrero.createMany({
      data,
    });
    return categoryWorkforces;
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

  async createCategoryWorkforce(
    data: I_CreateCategoryWorkforceBD
  ): Promise<CategoriaObrero> {
    const categoryWorkforce = await prisma.categoriaObrero.create({
      data,
    });
    return categoryWorkforce;
  }
  async findAll(): Promise<CategoriaObrero[]> {
    const categoryWorkforces = await prisma.categoriaObrero.findMany({
      where: {
        eliminado: E_Estado_BD.n,
      },
    });
    return categoryWorkforces;
  }
  async findById(bank_id: number): Promise<I_CategoryWorkforce | null> {
    const categoryWorkforce = await prisma.categoriaObrero.findFirst({
      where: {
        id: bank_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return categoryWorkforce;
  }
}

export const prismaCategoryWorkforceRepository =
  new PrismaCategoryWorkforceRepository();
