import validator from "validator";

export function lettersInNumbers(word: string): Boolean {
  if (!validator.isNumeric(word)) {
    return true;
  } else {
    return false;
  }
}
