"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.converToDate = void 0;
function converToDate(date) {
    const dateWithTime = new Date(date);
    // dateWithTime.setHours(0, 0, 0, 0);
    // const dateWithoutTim = dateWithTime.toISOString().split("T")[0];
    // const dateResponse = new Date(dateWithoutTim);
    return dateWithTime;
}
exports.converToDate = converToDate;
