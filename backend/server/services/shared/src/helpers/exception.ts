import { Request, Response } from "express";
import { Model } from "sequelize";
import { ILogger } from "../loggings";
import { checkErrorCodeExist, getMessageError, IOptionMessageError } from "../resources/errors";

export interface IOptionError extends IOptionMessageError {
  statusCode?: number;
  additionResp?: Record<string, any>;
}

export interface IError {
  code?: string;
  message?: string;
  debugMessage?: string;
}

export interface IRequest<I extends (new () => I) & typeof Model = any> extends Request {
  [x: string]: any;
  log: ILogger;
  currentUser: I;
  role: any;
  file: any;
}

function parseError(error: any): IError {
  const result: IError = {};
  result.code = checkErrorCodeExist(error.code) ? error.code : "internal_error";
  result.message = error.message || "INTERNAL ERROR";
  if (error.debugMessage) {
    result.debugMessage = error.debugMessage;
  }

  return result;
}

function parseLevelLog(error, logger: ILogger): keyof ILogger | number {
  if (error.stack && error.stack !== "" && typeof error.stack === "string") {
    if (!logger?.fatal) {
      return "error";
    }

    return "fatal";
  }

  return "error";
}

export function responseError(
  req: IRequest,
  res: Response,
  error: any,
  options: IOptionError = { statusCode: 400 },
): any {
  const statusCode = options.statusCode;
  const additionResp = options.additionResp || {};
  req.log &&
    req.log[parseLevelLog(error, req.log)](
      {
        error,
        req: {
          body: req.body,
          headers: req.headers,
          params: req.params,
        },
        stack: error.stack || "",
      },
      error,
    );

  // case not production
  if (typeof error === "string") {
    return res.status(statusCode).json({
      ...additionResp,
      ...parseError({
        code: error,
        message: getMessageError(error, options),
      }),
    });
  }
  if (typeof error === "object") {
    const errorCode = error.code || "error_unknown";

    return res.status(statusCode).json({
      ...additionResp,
      ...parseError({
        code: errorCode,
        message: error.message || getMessageError(errorCode, options),
        debugMessage: error.stack || error.message,
      }),
    });
  }
  if (Array.isArray(error)) {
    const errors = error.map(parseError);

    return res.status(statusCode ?? 400).json({ ...additionResp, errors });
  }

  return res.status(statusCode).json({ ...additionResp, ...parseError(error) });
}
