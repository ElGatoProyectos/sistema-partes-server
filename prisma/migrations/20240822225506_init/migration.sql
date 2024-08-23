-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `dni` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `role` ENUM('SUPERADMIN', 'ADMIN', 'USER') NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `password` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_dni_key`(`dni`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Proyecto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO', 'PENDIENTE', 'FINALIZADO') NOT NULL,
    `fecha_creacion` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UnidadProduccion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `proyecto_id` INTEGER NOT NULL,
    `codigo` INTEGER NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `nota` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tren` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` INTEGER NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `cuadrilla` VARCHAR(191) NULL,
    `nota` VARCHAR(191) NULL,
    `operario` INTEGER NOT NULL,
    `oficial` INTEGER NOT NULL,
    `peon` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Partida` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_interno` INTEGER NOT NULL,
    `item` VARCHAR(191) NOT NULL,
    `partida` VARCHAR(191) NOT NULL,
    `unidad` VARCHAR(191) NOT NULL,
    `metrado` DOUBLE NOT NULL,
    `precio` DOUBLE NOT NULL,
    `parcial` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ListaPrecio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha_inicio` DATETIME(3) NOT NULL,
    `fecha_fin` DATETIME(3) NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetallePrecioHoraMO` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` INTEGER NOT NULL,
    `categoria` VARCHAR(191) NOT NULL,
    `hora_normal` DOUBLE NOT NULL,
    `hora_extra_60` DOUBLE NOT NULL,
    `hora_extra_100` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReporteTrenes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `trenId` INTEGER NOT NULL,
    `costo_total` DOUBLE NOT NULL,
    `costo_anterior` DOUBLE NOT NULL,
    `costo_actual` DOUBLE NOT NULL,
    `costo_parcial` DOUBLE NOT NULL,
    `saldo` DOUBLE NULL,
    `lunes` DOUBLE NULL,
    `martes` DOUBLE NULL,
    `miercoles` DOUBLE NULL,
    `jueves` DOUBLE NULL,
    `viernes` DOUBLE NULL,
    `sabado` DOUBLE NULL,
    `domingo` DOUBLE NULL,
    `fecha_inicio` DATETIME(3) NOT NULL,
    `fecha_fin` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReportePartidas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `partida_id` INTEGER NOT NULL,
    `costo_total` DOUBLE NOT NULL,
    `costo_anterior` DOUBLE NOT NULL,
    `costo_actual` DOUBLE NOT NULL,
    `costo_parcial` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UnidadProduccion` ADD CONSTRAINT `UnidadProduccion_proyecto_id_fkey` FOREIGN KEY (`proyecto_id`) REFERENCES `Proyecto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
