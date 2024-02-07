import serverless from "serverless-http";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { NOT_ALLOWED_CORS } from "./errors";

import "../utils/json-utils";

export function makeExpressApp(makeRoutes: Function) {
  const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "").split(",");
  const allowOrigins = ALLOWED_ORIGINS.map((name) => [`http://${name.trim()}`, `https://${name.trim()}`]).flat();

  const app = express();
  app.use(express.json());
  app.use(
    cors({
      origin: function (origin, callback) {
        if (origin && allowOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(NOT_ALLOWED_CORS);
        }
      }
    })
  );
  app.use(helmet());
  app.use(helmet.xssFilter());
  app.use(function (req: any, res, next) {
    if (req.apiGateway.event.requestContext.authorizer) {
      const claims = req.apiGateway.event.requestContext.authorizer.claims || {};
      req.claims = claims;
      req.userId = claims["cognito:username"];
    }

    next();
  });

  makeRoutes(app);

  app.use((err: any, req: any, res: any, next: any) => {
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || "INTERNAL_SERVER_ERROR";
    res.status(statusCode).json({ message: errorMessage });
  });

  return serverless(app);
}
