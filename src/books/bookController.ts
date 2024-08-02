import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "path";
import bookModel from "./bookSchema";
import fs from "node:fs";
import createHttpError from "http-errors";
import { AuthRequest } from "../middlewares/authenticate";

export const addBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, genre } = req.body;
    // for coverImage
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const filename = files.coverImage[0].filename;
    const filepath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      filename
    );
    const uploadResult = await cloudinary.uploader.upload(filepath, {
      filename_override: filename,
      folder: "book-covers",
      format: coverImageMimeType,
    });

    // for file

    const bookFilename = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFilename
    );

    const bookFileUpload = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw", // for pdf files
      filename_override: bookFilename,
      folder: "Books-files",
      format: "pdf",
    });

    const _reqid = req as AuthRequest;

    const newBook = await bookModel.create({
      title,
      genre,
      author: _reqid.userId,
      coverImage: uploadResult?.secure_url,
      file: bookFileUpload?.secure_url,
    });

    // delete temp files

    fs.promises.unlink(bookFilePath);
    fs.promises.unlink(filepath);

    res.status(201).json({
      id: newBook._id,
      newBook,
      message: "Book added successfully",
    });
  } catch (error) {
    return next(createHttpError(500, "error creating book"));
  }
};
