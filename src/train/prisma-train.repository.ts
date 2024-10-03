import { E_Estado_BD, Tren } from "@prisma/client";

import prisma from "@/config/prisma.config";
import { TrainRepository } from "./train.repository";
import {
  I_CreateTrainBD,
  I_Train,
  I_UpdateTrainBodyValidation,
} from "./models/production-unit.interface";
import { T_FindAllTrain } from "./models/train.types";

class PrismaTrainRepository implements TrainRepository {
  async findByCode(code: string, project_id: number): Promise<Tren | null> {
    const train = await prisma.tren.findFirst({
      where: {
        codigo: code,
        proyecto_id: project_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return train;
  }
  async existsName(name: string, project_id: number): Promise<Tren | null> {
    const train = await prisma.tren.findFirst({
      where: {
        nombre: name,
        proyecto_id: project_id,
      },
    });
    return train;
  }
  async updateCuadrillaByIdTrain(
    idTrain: number,
    workers: number,
    official: number,
    pawns: number
  ): Promise<Tren> {
    const updateTrain = await prisma.tren.update({
      where: {
        id: idTrain,
      },
      data: {
        operario: workers,
        oficial: official,
        peon: pawns,
      },
    });
    return updateTrain;
  }

  async codeMoreHigh(project_id: number): Promise<Tren | null> {
    const lastTrain = await prisma.tren.findFirst({
      where: {
        // eliminado: E_Estado_BD.n,
        proyecto_id: project_id,
      },
      orderBy: { codigo: "desc" },
    });
    return lastTrain;
  }
  async createTrain(data: I_CreateTrainBD): Promise<Tren> {
    const train = await prisma.tren.create({
      data,
    });
    return train;
  }
  async updateTrain(
    data: I_UpdateTrainBodyValidation,
    idTrain: number
  ): Promise<Tren> {
    const train = await prisma.tren.update({
      where: { id: idTrain },
      data: data,
    });
    return train;
  }

  async searchNameTrain(
    name: string,
    skip: number,
    limit: number,
    project_id: number
  ): Promise<{ trains: I_Train[]; total: number }> {
    const [trains, total]: [I_Train[], number] = await prisma.$transaction([
      prisma.tren.findMany({
        where: {
          nombre: {
            contains: name,
          },
          eliminado: E_Estado_BD.n,
          proyecto_id: project_id,
        },
        skip,
        take: limit,
        omit: {
          eliminado: true,
        },
      }),
      prisma.tren.count({
        where: {
          nombre: {
            contains: name,
          },
          eliminado: E_Estado_BD.n,
          proyecto_id: project_id,
        },
      }),
    ]);
    return { trains, total };
  }

  async findAll(
    skip: number,
    data: T_FindAllTrain,
    project_id: number
  ): Promise<{ trains: I_Train[]; total: number }> {
    let filters: any = {};
    const arrayNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    if (arrayNumbers.includes(data.queryParams.search)) {
      filters.codigo = {
        contains: data.queryParams.search,
      };
    } else {
      filters.nombre = {
        contains: data.queryParams.search,
      };
    }
    const [trains, total]: [I_Train[], number] = await prisma.$transaction([
      prisma.tren.findMany({
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
        orderBy: {
          codigo: "asc",
        },
      }),
      prisma.tren.count({
        where: {
          ...filters,
          eliminado: E_Estado_BD.n,
          proyecto_id: project_id,
        },
      }),
    ]);
    return { trains, total };
  }

  async findById(idTrain: number): Promise<I_Train | null> {
    const train = await prisma.tren.findFirst({
      where: {
        id: idTrain,
        eliminado: E_Estado_BD.n,
      },
      omit: {
        eliminado: true,
      },
    });
    return train;
  }

  async updateStatusTrain(idTrain: number): Promise<Tren | null> {
    const train = await prisma.tren.findFirst({
      where: {
        id: idTrain,
        eliminado: E_Estado_BD.n,
      },
    });

    const newStateTrain =
      train?.eliminado == E_Estado_BD.y ? E_Estado_BD.n : E_Estado_BD.y;
    const trainUpdate = await prisma.tren.update({
      where: { id: idTrain },
      data: {
        eliminado: newStateTrain,
      },
    });
    return trainUpdate;
  }
}

export const prismaTrainRepository = new PrismaTrainRepository();
