import { E_Estado_BD } from "@prisma/client";

export function valueBooleanState(value: boolean): E_Estado_BD {
  if (value === true) {
    return E_Estado_BD.y;
  } else {
    return E_Estado_BD.n;
  }
}
export function returnBooleanState(value: string): Boolean {
  if (value === "y") {
    return true;
  } else {
    return false;
  }
}
