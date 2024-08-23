-- AlterTable
ALTER TABLE `listaprecio` MODIFY `titulo` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `partida` ADD COLUMN `total` DOUBLE NULL,
    MODIFY `item` TEXT NOT NULL,
    MODIFY `partida` TEXT NOT NULL,
    MODIFY `unidad` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `tren` MODIFY `titulo` TEXT NOT NULL,
    MODIFY `cuadrilla` TEXT NULL,
    MODIFY `nota` TEXT NULL;

-- CreateTable
CREATE TABLE `Trabajo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tren_id` INTEGER NOT NULL,
    `up_id` INTEGER NOT NULL,
    `codigo` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `duracion` INTEGER NOT NULL,
    `fecha_inicio` DATETIME(3) NOT NULL,
    `fecha_finalizacion` DATETIME(3) NOT NULL,
    `estado` BOOLEAN NOT NULL,
    `costo_partida` INTEGER NOT NULL,
    `costo_mano_obra` INTEGER NOT NULL,
    `costo_material` INTEGER NOT NULL,
    `costo_equipo` INTEGER NOT NULL,
    `costo_varios` INTEGER NOT NULL,

    UNIQUE INDEX `Trabajo_tren_id_key`(`tren_id`),
    UNIQUE INDEX `Trabajo_up_id_key`(`up_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Trabajo` ADD CONSTRAINT `Trabajo_tren_id_fkey` FOREIGN KEY (`tren_id`) REFERENCES `Tren`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trabajo` ADD CONSTRAINT `Trabajo_up_id_fkey` FOREIGN KEY (`up_id`) REFERENCES `UnidadProduccion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReporteTrenes` ADD CONSTRAINT `ReporteTrenes_trenId_fkey` FOREIGN KEY (`trenId`) REFERENCES `Tren`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReportePartidas` ADD CONSTRAINT `ReportePartidas_partida_id_fkey` FOREIGN KEY (`partida_id`) REFERENCES `Partida`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
