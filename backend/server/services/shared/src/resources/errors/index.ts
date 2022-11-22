import { ErrorKey } from "./type";
import resourcesError from "./vi";

export * from "./type";
export * from "./vi";

export interface IOptionMessageError {
  params?: object;
}

export const enum LanguageOption {
  Vietnamese = "vi",
}

export function getMessageError(key: string, opts?: IOptionMessageError): string {
  const message: string = resourcesError[key];

  if (!message) {
    if (typeof key === "string") {
      return key;
    }

    return getMessageError(ErrorKey.UnknownError);
  }

  return opts && opts.params ? parseMessageError(message, opts.params) : message;
}

export function checkErrorCodeExist(key: string): string {
  return resourcesError[key] as string;
}

export function parseMessageError(message: string, params: object): string {
  const delimiterLeft = "{{";
  const delimiterRight = "}}";
  const keyParams = Object.keys(params);
  if (keyParams.length === 0) {
    return message;
  }
  keyParams.forEach((e) => {
    message = message.replace(delimiterLeft + e + delimiterRight, params[e]);
  });

  return message;
}
