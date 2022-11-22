/* eslint-disable */
import * as lb from "@google-cloud/logging-bunyan";
import Bunyan from "bunyan";
import bformat from "bunyan-format";
import { Express, NextFunction, Response } from "express";
import morgan from "morgan";
import { IRequest, responseError } from "../helpers";
import { DefaultLogger, ILogger } from "./default";
import { getTrace, LogRequest } from "./log-request";
import { NodeEnv } from "./type";

let defaultLogger: ILogger = DefaultLogger;

function makeChildLogger(trace) {
  return (defaultLogger as any).child({ [lb.LOGGING_TRACE_KEY]: trace }, true);
}

export async function LogMiddleware(app: Express, { logName, service }): Promise<void> {
  try {
    if (process.env.NODE_ENV === NodeEnv.LOCAL) {
      app.use(morgan("dev"));
    }
    let projectId;
    const streamLogs = [{ stream: bformat({ outputMode: "short" }), level: (process.env.LEVEL_LOG || "debug") as any }];
    logName = logName || "default";

    // Google log
    if (process.env.SERVICE_LOG && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      const streamLogGoogleCloud = new lb.LoggingBunyan({
        logName,
        serviceContext: {
          service,
          version: process.env.NODE_ENV || NodeEnv.DEVELOP,
        },
      }) as any;
      streamLogs.push(streamLogGoogleCloud.stream((process.env.LEVEL_LOG_GOOGLE || "debug") as any));
      projectId = await streamLogGoogleCloud.stackdriverLog.logging.auth.getProjectId();
    }
    const logger: any = Bunyan.createLogger({
      name: logName,
      streams: streamLogs,
    });
    defaultLogger = logger;

    // @ts-ignore
    app.use((req: IRequest, res: Response, next: NextFunction) => {
      try {
        req.log = projectId ? makeChildLogger(getTrace(req, projectId)) : defaultLogger;

        return next();
      } catch (error) {
        return responseError(req, res, error);
      }
    });
    // @ts-ignore
    app.use(LogRequest);

    process.on("unhandledRejection", (error) => {
      if (process.env.NODE_ENV !== NodeEnv.PRODUCTION) {
        defaultLogger.error(error);
      }

      defaultLogger.error(error);
    });
  } catch (error) {
    defaultLogger.error(error);

    throw error;
  }
}

export function getLogger(): ILogger {
  return defaultLogger;
}

export { defaultLogger as logger };
