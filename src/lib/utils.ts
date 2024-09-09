import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateAddress(address: string, numChars: number = 4): string {
  if (address.length <= 2 * numChars) {
    return address;
  }
  return `${address.slice(0, numChars)}...${address.slice(-numChars)}`;
}
