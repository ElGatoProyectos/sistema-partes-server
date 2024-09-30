"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.largeMinEleven = void 0;
function largeMinEleven(dni) {
    if (dni.length < 11) {
        return true;
    }
    else {
        return false;
    }
}
exports.largeMinEleven = largeMinEleven;
