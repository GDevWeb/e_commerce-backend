import { randomUUID } from "node:crypto";

export const generateSKU = (name: string): string => {
  const truncName = name.slice(0, 3).toUpperCase();
  const hash = randomUUID().slice(0, 8);
  const sku = truncName + "-" + hash.toUpperCase();

  return sku;
};
