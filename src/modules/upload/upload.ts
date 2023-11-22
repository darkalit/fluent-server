import { Request } from "express";
import multer from "multer";
import { ApiError } from "../error";
import httpStatus from "http-status";
import path from "path";

const storage = multer.diskStorage({
  destination: function (_req: Request, _file: Express.Multer.File, cb) {
    const filepath = path.resolve("public", "uploads");
    cb(null, filepath);
  },
  filename: function (_req: Request, file: Express.Multer.File, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + "." + file.originalname.split(".").pop());
  },
});

function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  if (/^image\/.+$/.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(httpStatus.BAD_REQUEST, "Wrong file type"));
  }
}

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 + 1,
  },
  fileFilter,
});

export default upload;
