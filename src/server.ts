import express, { Express, NextFunction, Request, Response } from "express";
import { gameMiddleware } from "./middlewares/gameMiddleware";
import "dotenv/config.js";

const app: Express = express();
const port = process.env.API_PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  gameMiddleware();
  res.send("OK");
});

app.listen(port, async () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  await gameMiddleware();
});
