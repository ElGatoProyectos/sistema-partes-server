"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailValid = void 0;
const validator_1 = __importDefault(require("validator"));
function emailValid(email) {
    if (validator_1.default.isEmail(email)) {
        return true;
    }
    else {
        return false;
    }
}
exports.emailValid = emailValid;
