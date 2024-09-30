"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lettersInNumbers = void 0;
const validator_1 = __importDefault(require("validator"));
function lettersInNumbers(word) {
    if (!validator_1.default.isNumeric(word)) {
        return true;
    }
    else {
        return false;
    }
}
exports.lettersInNumbers = lettersInNumbers;
