import * as bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { existsSync, readdirSync } from "fs";
import passport from "passport";
import { dirname } from "path";
import { initDatabase, LogMiddleware } from "shared";
import { jwtStrategy } from "./config";

initDatabase("digging", {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
});

const getDirectories = (source) =>
  readdirSync(source, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

function initRouters(app) {
  const rootPath = dirname(require.main.filename);
  const directoryModuleName = "apis";
  const pathModule = `${rootPath}/${directoryModuleName}`;
  if (!existsSync(pathModule)) {
    return app;
  }
  const directories = getDirectories(`${rootPath}/${directoryModuleName}`);
  directories.forEach((e) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { router } = require(`${rootPath}/${directoryModuleName}/${e}/router`);
    app.use("/", router);
  });
  return app;
}

async function initServerExpress() {
  const PORT = +process.env.PORT || 9000;
  const HOST = process.env.HOST || "0.0.0.0";
  const ENV = process.env.NODE_ENV || "development";
  const app = express();

  app.get("/healthz", (_, res) => res.status(200).send("OK"));

  app.use(bodyParser.json());
  app.use(cors());

  app.use(passport.initialize());
  passport.use("jwt", jwtStrategy);

  await LogMiddleware(app, { logName: process.env.LOG_NAME, service: process.env.LOG_NAME });

  await initRouters(app);

  app.listen(PORT, HOST, () => {
    console.log("Express server listening on %d, in %s mode", PORT, ENV);
  });
}

initServerExpress();
