import validator from "validator";

export function wordIsNumeric(word: string): Boolean {
  if (!validator.isNumeric(word)) {
    return true;
  } else {
    return false;
  }
}
