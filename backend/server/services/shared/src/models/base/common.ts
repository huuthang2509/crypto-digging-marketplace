/* eslint-disable @typescript-eslint/no-unsafe-return */

export enum StatusCode {
  Active = "active",
  Blocked = "blocked",
  Deleted = "deleted",
}

export enum EarnFrom {
  Buy = "buy",
  OpenBox = "open_box",
  Lucky = "lucky",
}

export const MetadataFields = ["id", "status", "createdAt", "updatedAt", "createdBy", "updatedBy"];

export function safeParseInt(input: string | number, defaultValue: number = null): number {
  if (!input || typeof input === "number") {
    return Math.floor(<number>input || defaultValue);
  }

  try {
    return parseInt(input, 0);
  } catch {
    return defaultValue;
  }
}

export function safeParseJSON(input: string, defaultValue = null) {
  try {
    return JSON.parse(input);
  } catch {
    return defaultValue;
  }
}
