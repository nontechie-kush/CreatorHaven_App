import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  // Merge Tailwind classes after clsx dedupes conditional strings
  return twMerge(clsx(...inputs));
}