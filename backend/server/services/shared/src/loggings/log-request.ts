/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as ContextLogger from "@opencensus/propagation-stackdriver";
import { NextFunction, Response } from "express";
import onFinished from "on-finished";
import { IRequest } from "../helpers";

export function LogRequest(req: IRequest, res: Response, next: NextFunction) {
  // handle log google
  if (process.env.SERVICE_LOG && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const requestStartMs = Date.now();
    onFinished(res, () => {
      const latencyMs = Date.now() - requestStartMs;
      req.log[[200, 304].includes(res.statusCode) ? "info" : "error"](
        {
          httpRequest: getLogHttpRequest(req, res, latencyMs),
          payload: getPayloadRequest(req),
        },
        `${req.originalUrl as string}`,
      );
    });
  }

  return next();
}

export function getLogHttpRequest(req: IRequest, res: Response, latencyMs?: number) {
  return {
    status: res.statusCode,
    requestUrl: req.originalUrl,
    requestMethod: req.method,
    protocol: req.protocol,
    userAgent: req.headers["user-agent"],
    responseSize: (res.getHeader && Number(res.getHeader("Content-Length"))) || 0,
    latency: latencyMs
      ? {
          seconds: Math.floor(latencyMs / 1e3),
          nanos: Math.floor((latencyMs % 1e3) * 1e6),
        }
      : null,
  };
}

export function getPayloadRequest(req: IRequest) {
  return {
    body: req.body,
    params: req.params,
    query: req.query,
    headers: req.headers,
  };
}

function makeHeaderWrapper(req: IRequest) {
  return {
    setHeader(name, value) {
      req.headers[name] = value;
    },
    getHeader(name) {
      return req.headers[name] as string;
    },
  };
}

function getOrInjectContext(headerWrapper) {
  let spanContext = ContextLogger.extract(headerWrapper);
  if (spanContext) {
    return spanContext;
  }
  spanContext = ContextLogger.generate();
  ContextLogger.inject(headerWrapper, spanContext);

  return spanContext;
}

export function getTrace(req: IRequest, projectId) {
  const wrapper = makeHeaderWrapper(req);
  const spanContext = getOrInjectContext(wrapper);

  return `projects/${projectId as string}/traces/${spanContext.traceId as string}`;
}
