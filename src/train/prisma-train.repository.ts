import { E_Estado_BD, Tren, UnidadProduccion } from "@prisma/client";

import prisma from "@/config/prisma.config";
import { TrainRepository } from "./train.repository";
import {
  I_CreateTrainBD,
  I_Train,
  I_UpdateTrainBody,
} from "./models/production-unit.interface";

class PrismaTrainRepository implements TrainRepository {
  async existsName(name: string): Promise<Tren | null> {
    const train = await prisma.tren.findFirst({
      where: {
        nombre: name,
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

  async codeMoreHigh(): Promise<Tren | null> {
    const lastTrain = await prisma.tren.findFirst({
      where: {
        eliminado: E_Estado_BD.n,
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
  async updateTrain(data: I_UpdateTrainBody, idTrain: number): Promise<Tren> {
    const train = await prisma.tren.update({
      where: { id: idTrain },
      data: data,
    });
    return train;
  }

  async searchNameTrain(
    name: string,
    skip: number,
    limit: number
  ): Promise<{ trains: I_Train[]; total: number }> {
    const [trains, total]: [I_Train[], number] = await prisma.$transaction([
      prisma.tren.findMany({
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
      prisma.tren.count({
        where: {
          nombre: {
            contains: name,
          },
          eliminado: E_Estado_BD.n,
        },
      }),
    ]);
    return { trains, total };
  }

  async findAll(
    skip: number,
    limit: number
  ): Promise<{ trains: I_Train[]; total: number }> {
    const [trains, total]: [I_Train[], number] = await prisma.$transaction([
      prisma.tren.findMany({
        where: {
          eliminado: E_Estado_BD.n,
        },
        skip,
        take: limit,
        omit: {
          eliminado: true,
        },
      }),
      prisma.tren.count({
        where: {
          eliminado: E_Estado_BD.n,
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
