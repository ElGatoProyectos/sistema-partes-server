/*
  Warnings:

  - You are about to drop the column `categoria` on the `detallepreciohoramo` table. All the data in the column will be lost.
  - You are about to drop the column `titulo` on the `proyecto` table. All the data in the column will be lost.
  - You are about to alter the column `estado` on the `trabajo` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Enum(EnumId(8))`.
  - You are about to drop the column `titulo` on the `tren` table. All the data in the column will be lost.
  - You are about to drop the column `titulo` on the `unidadproduccion` table. All the data in the column will be lost.
  - You are about to drop the `listaprecio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reportepartidas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reportetrenes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[codigo]` on the table `DetallePrecioHoraMO` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_interno]` on the table `Partida` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo]` on the table `Tren` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo]` on the table `UnidadProduccion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoria_obrero_id` to the `DetallePrecioHoraMO` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proyecto_id` to the `Partida` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codigo_proyecto` to the `Proyecto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costo_proyecto` to the `Proyecto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `direccion` to the `Proyecto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empresa_id` to the `Proyecto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fecha_fin` to the `Proyecto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre_completo` to the `Proyecto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre_consorcio` to the `Proyecto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre_corto` to the `Proyecto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plazo_proyecto` to the `Proyecto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `Tren` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proyecto_id` to the `Tren` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `UnidadProduccion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `reportepartidas` DROP FOREIGN KEY `ReportePartidas_partida_id_fkey`;

-- DropForeignKey
ALTER TABLE `reportetrenes` DROP FOREIGN KEY `ReporteTrenes_trenId_fkey`;

-- AlterTable
ALTER TABLE `detallepreciohoramo` DROP COLUMN `categoria`,
    ADD COLUMN `categoria_obrero_id` INTEGER NOT NULL,
    MODIFY `codigo` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `partida` ADD COLUMN `proyecto_id` INTEGER NOT NULL,
    MODIFY `id_interno` VARCHAR(191) NOT NULL,
    MODIFY `item` VARCHAR(191) NOT NULL,
    MODIFY `partida` VARCHAR(191) NOT NULL,
    MODIFY `unidad` VARCHAR(191) NOT NULL,
    MODIFY `parcial` DOUBLE NULL DEFAULT 0,
    MODIFY `total` DOUBLE NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `proyecto` DROP COLUMN `titulo`,
    ADD COLUMN `codigo_proyecto` VARCHAR(191) NOT NULL,
    ADD COLUMN `costo_proyecto` DOUBLE NOT NULL,
    ADD COLUMN `direccion` VARCHAR(191) NOT NULL,
    ADD COLUMN `empresa_id` INTEGER NOT NULL,
    ADD COLUMN `fecha_fin` DATE NOT NULL,
    ADD COLUMN `nombre_completo` VARCHAR(191) NOT NULL,
    ADD COLUMN `nombre_consorcio` VARCHAR(191) NOT NULL,
    ADD COLUMN `nombre_corto` VARCHAR(191) NOT NULL,
    ADD COLUMN `plazo_proyecto` VARCHAR(191) NOT NULL,
    MODIFY `descripcion` TEXT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `trabajo` MODIFY `fecha_inicio` DATE NOT NULL,
    MODIFY `fecha_finalizacion` DATE NOT NULL,
    MODIFY `estado` ENUM('y', 'n') NOT NULL DEFAULT 'y';

-- AlterTable
ALTER TABLE `tren` DROP COLUMN `titulo`,
    ADD COLUMN `nombre` VARCHAR(191) NOT NULL,
    ADD COLUMN `proyecto_id` INTEGER NOT NULL,
    MODIFY `codigo` VARCHAR(191) NOT NULL,
    MODIFY `cuadrilla` VARCHAR(191) NULL,
    MODIFY `nota` TEXT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `unidadproduccion` DROP COLUMN `titulo`,
    ADD COLUMN `nombre` VARCHAR(191) NOT NULL,
    MODIFY `codigo` VARCHAR(191) NOT NULL,
    MODIFY `nota` TEXT NULL DEFAULT '';

-- DropTable
DROP TABLE `listaprecio`;

-- DropTable
DROP TABLE `reportepartidas`;

-- DropTable
DROP TABLE `reportetrenes`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `dni` VARCHAR(191) NOT NULL,
    `nombre_completo` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `rol` ENUM('ADMIN', 'USER') NOT NULL,
    `estatus` ENUM('y', 'n') NOT NULL DEFAULT 'y',
    `contrasena` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Usuario_email_key`(`email`),
    UNIQUE INDEX `Usuario_dni_key`(`dni`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Empresa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_empresa` VARCHAR(191) NOT NULL,
    `descripcion_empresa` TEXT NULL DEFAULT '',
    `limite_proyecto` INTEGER NOT NULL DEFAULT 1,
    `usuarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetalleUsuarioEmpresa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `empresa_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetalleTrabajoPartida` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `trabajo_id` INTEGER NOT NULL,
    `partida_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ManoDeObra` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `unidad` INTEGER NOT NULL,
    `fecha_inicio` DATE NOT NULL,
    `fecha_cese` DATE NOT NULL,
    `banco` VARCHAR(191) NOT NULL,
    `cuenta` TEXT NOT NULL,
    `fecha_nacimiento` DATE NOT NULL,
    `escolaridad` VARCHAR(191) NOT NULL,
    `usuario_id` INTEGER NOT NULL,
    `tipo_obrero_id` INTEGER NOT NULL,
    `origen_obrero_id` INTEGER NOT NULL,
    `especialidad_obrero_id` INTEGER NOT NULL,
    `categoria_obrero_id` INTEGER NOT NULL,

    UNIQUE INDEX `ManoDeObra_tipo_obrero_id_key`(`tipo_obrero_id`),
    UNIQUE INDEX `ManoDeObra_origen_obrero_id_key`(`origen_obrero_id`),
    UNIQUE INDEX `ManoDeObra_especialidad_obrero_id_key`(`especialidad_obrero_id`),
    UNIQUE INDEX `ManoDeObra_categoria_obrero_id_key`(`categoria_obrero_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CategoriaObrero` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoObrero` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrigenObrero` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EspecialidadObrero` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Recurso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_indice` VARCHAR(191) NOT NULL,
    `id_unificado` VARCHAR(191) NOT NULL,
    `codigo` VARCHAR(191) NOT NULL,
    `recurso` VARCHAR(191) NOT NULL,
    `unidad` VARCHAR(191) NOT NULL,
    `precio` DOUBLE NOT NULL,
    `categoria_recurso` INTEGER NOT NULL,

    UNIQUE INDEX `Recurso_id_indice_key`(`id_indice`),
    UNIQUE INDEX `Recurso_id_unificado_key`(`id_unificado`),
    UNIQUE INDEX `Recurso_codigo_key`(`codigo`),
    UNIQUE INDEX `Recurso_categoria_recurso_key`(`categoria_recurso`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CategoriaRecurso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Asistencia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATETIME(3) NOT NULL,
    `hora_inicio` VARCHAR(191) NOT NULL,
    `hora_fin` VARCHAR(191) NOT NULL,
    `horas` DOUBLE NOT NULL,
    `asistencia` ENUM('F', 'A') NOT NULL DEFAULT 'F',
    `horas_extras_estado` ENUM('y', 'n') NOT NULL DEFAULT 'n',
    `horas_extras` DOUBLE NOT NULL,
    `mano_obra_id` INTEGER NOT NULL,

    UNIQUE INDEX `Asistencia_mano_obra_id_key`(`mano_obra_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ParteDiario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `fecha` DATE NOT NULL,
    `etapa` VARCHAR(191) NOT NULL,
    `jornada` VARCHAR(191) NOT NULL,
    `hora_inicio` VARCHAR(191) NOT NULL,
    `hora_fin` VARCHAR(191) NOT NULL,
    `descripcion_actividad` TEXT NULL DEFAULT '',
    `nota` TEXT NULL DEFAULT '',
    `distanciamiento` ENUM('y', 'n') NULL,
    `protocolo_ingreso` ENUM('y', 'n') NULL,
    `protocolo_salida` ENUM('y', 'n') NULL,
    `trabajo_id` INTEGER NOT NULL,

    UNIQUE INDEX `ParteDiario_trabajo_id_key`(`trabajo_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ParteDiarioMO` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parte_diario_id` INTEGER NOT NULL,
    `mano_obra_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ParteDiarioRecurso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parte_diario_id` INTEGER NOT NULL,
    `recurso_id` INTEGER NOT NULL,
    `cantidad` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PrecioHoraMO` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha_inicio` DATE NOT NULL,
    `fecha_fin` DATE NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReporteTren` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `costo_total` DOUBLE NOT NULL,
    `costo_anterior` DOUBLE NOT NULL,
    `costo_actual` DOUBLE NOT NULL,
    `costo_parcial` DOUBLE NOT NULL,
    `saldo` DOUBLE NULL DEFAULT 0,
    `lunes` DOUBLE NULL DEFAULT 0,
    `martes` DOUBLE NULL DEFAULT 0,
    `miercoles` DOUBLE NULL DEFAULT 0,
    `jueves` DOUBLE NULL DEFAULT 0,
    `viernes` DOUBLE NULL DEFAULT 0,
    `sabado` DOUBLE NULL DEFAULT 0,
    `domingo` DOUBLE NULL DEFAULT 0,
    `fecha_inicio` DATE NOT NULL,
    `fecha_fin` DATE NOT NULL,
    `tren_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReportePartida` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `costo_total` DOUBLE NOT NULL,
    `costo_anterior` DOUBLE NOT NULL,
    `costo_actual` DOUBLE NOT NULL,
    `costo_parcial` DOUBLE NOT NULL,
    `partida_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `DetallePrecioHoraMO_codigo_key` ON `DetallePrecioHoraMO`(`codigo`);

-- CreateIndex
CREATE UNIQUE INDEX `Partida_id_interno_key` ON `Partida`(`id_interno`);

-- CreateIndex
CREATE UNIQUE INDEX `Tren_codigo_key` ON `Tren`(`codigo`);

-- CreateIndex
CREATE UNIQUE INDEX `UnidadProduccion_codigo_key` ON `UnidadProduccion`(`codigo`);

-- AddForeignKey
ALTER TABLE `Empresa` ADD CONSTRAINT `Empresa_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetalleUsuarioEmpresa` ADD CONSTRAINT `DetalleUsuarioEmpresa_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetalleUsuarioEmpresa` ADD CONSTRAINT `DetalleUsuarioEmpresa_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Proyecto` ADD CONSTRAINT `Proyecto_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tren` ADD CONSTRAINT `Tren_proyecto_id_fkey` FOREIGN KEY (`proyecto_id`) REFERENCES `Proyecto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Partida` ADD CONSTRAINT `Partida_proyecto_id_fkey` FOREIGN KEY (`proyecto_id`) REFERENCES `Proyecto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetalleTrabajoPartida` ADD CONSTRAINT `DetalleTrabajoPartida_trabajo_id_fkey` FOREIGN KEY (`trabajo_id`) REFERENCES `Trabajo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetalleTrabajoPartida` ADD CONSTRAINT `DetalleTrabajoPartida_partida_id_fkey` FOREIGN KEY (`partida_id`) REFERENCES `Partida`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ManoDeObra` ADD CONSTRAINT `ManoDeObra_categoria_obrero_id_fkey` FOREIGN KEY (`categoria_obrero_id`) REFERENCES `CategoriaObrero`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ManoDeObra` ADD CONSTRAINT `ManoDeObra_especialidad_obrero_id_fkey` FOREIGN KEY (`especialidad_obrero_id`) REFERENCES `EspecialidadObrero`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ManoDeObra` ADD CONSTRAINT `ManoDeObra_tipo_obrero_id_fkey` FOREIGN KEY (`tipo_obrero_id`) REFERENCES `TipoObrero`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ManoDeObra` ADD CONSTRAINT `ManoDeObra_origen_obrero_id_fkey` FOREIGN KEY (`origen_obrero_id`) REFERENCES `OrigenObrero`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ManoDeObra` ADD CONSTRAINT `ManoDeObra_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recurso` ADD CONSTRAINT `Recurso_categoria_recurso_fkey` FOREIGN KEY (`categoria_recurso`) REFERENCES `CategoriaRecurso`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Asistencia` ADD CONSTRAINT `Asistencia_mano_obra_id_fkey` FOREIGN KEY (`mano_obra_id`) REFERENCES `ManoDeObra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParteDiario` ADD CONSTRAINT `ParteDiario_trabajo_id_fkey` FOREIGN KEY (`trabajo_id`) REFERENCES `Trabajo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParteDiarioMO` ADD CONSTRAINT `ParteDiarioMO_parte_diario_id_fkey` FOREIGN KEY (`parte_diario_id`) REFERENCES `ParteDiario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParteDiarioMO` ADD CONSTRAINT `ParteDiarioMO_mano_obra_id_fkey` FOREIGN KEY (`mano_obra_id`) REFERENCES `ManoDeObra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParteDiarioRecurso` ADD CONSTRAINT `ParteDiarioRecurso_parte_diario_id_fkey` FOREIGN KEY (`parte_diario_id`) REFERENCES `ParteDiario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParteDiarioRecurso` ADD CONSTRAINT `ParteDiarioRecurso_recurso_id_fkey` FOREIGN KEY (`recurso_id`) REFERENCES `Recurso`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetallePrecioHoraMO` ADD CONSTRAINT `DetallePrecioHoraMO_categoria_obrero_id_fkey` FOREIGN KEY (`categoria_obrero_id`) REFERENCES `CategoriaObrero`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReporteTren` ADD CONSTRAINT `ReporteTren_tren_id_fkey` FOREIGN KEY (`tren_id`) REFERENCES `Tren`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReportePartida` ADD CONSTRAINT `ReportePartida_partida_id_fkey` FOREIGN KEY (`partida_id`) REFERENCES `Partida`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
