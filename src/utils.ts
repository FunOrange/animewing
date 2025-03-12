import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...classes: ClassValue[]) => {
  return twMerge(clsx(...classes));
};

export const pad2 = (num: number) => num.toString().padStart(2, "0");
