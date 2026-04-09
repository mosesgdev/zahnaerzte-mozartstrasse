import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(src: string): string {
  if (src.startsWith("/")) return `${basePath}${src}`;
  return src;
}
