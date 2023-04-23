import express, { Express, Request, Response } from "express";
import { gameMiddleware } from "./middlewares/gameMiddleware";
import "dotenv/config.js";

const app: Express = express();
const port = process.env.API_PORT || 3000;

app.get("/", async (req: Request, res: Response) => {
  gameMiddleware();
  res.status(200)
});

app.listen(port, () => {
  gameMiddleware();
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
