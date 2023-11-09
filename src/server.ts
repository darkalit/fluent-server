import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import IStatus from "./interface/IStatus";

const PORT = process.env.API_PORT || 7070;

const app = express();
import db from "./db";

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.all("*", (req: Request, res: Response) => {
  let status: IStatus = {
    code: 404,
    status: "Not found",
    message: "Page not found",
  };
  return res.status(404).json(status);
});

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server running at port: ${PORT}`);
  });
});
