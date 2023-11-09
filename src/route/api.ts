import express, { Request, Response } from "express";

const app = express();

app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("API OK!");
});

app.get("/ping", (_req: Request, res: Response) => {
  res.status(200).send("pong");
});

export default app;
