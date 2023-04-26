import express, { Express, NextFunction, Request, Response } from "express";
import { gameMiddleware } from "./middlewares/gameMiddleware";
import "dotenv/config.js";
import { gameService } from "./games";

const app: Express = express();
const port = process.env.API_PORT || 3000;

app.get("/send", async (req: Request, res: Response) => {
  const timer = await gameService();
  res.send(`Ok ${timer}`);
});

app.listen(port, async () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  await gameMiddleware();
});
