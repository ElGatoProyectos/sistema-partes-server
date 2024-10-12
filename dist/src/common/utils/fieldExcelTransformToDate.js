"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.excelDateToDate = void 0;
function excelDateToDate(serial) {
    const excelEpoch = new Date(1900, 0, 1);
    const days = serial;
    return new Date(excelEpoch.getTime() + days * 24 * 60 * 60 * 1000);
}
exports.excelDateToDate = excelDateToDate;
