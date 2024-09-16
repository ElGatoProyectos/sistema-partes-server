import validator from "validator";

export function emailValid(email: string): Boolean {
  if (validator.isEmail(email)) {
    return true;
  } else {
    return false;
  }
}
