import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "path";
import bookModel from "./bookSchema";

export const addBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, genre } = req.body;
  // for coverImage
  let uploadResult;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  try {
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const filename = files.coverImage[0].filename;
    const filepath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      filename
    );
    uploadResult = await cloudinary.uploader.upload(filepath, {
      filename_override: filename,
      folder: "book-covers",
      format: coverImageMimeType,
    });
  } catch (error) {
    console.log("Error uploading", error);
  }

  // for file
  let bookFileUpload;
  try {
    const bookFilename = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFilename
    );

    bookFileUpload = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw", // for pdf files
      filename_override: bookFilename,
      folder: "Books-files",
      format: "pdf",
    });
  } catch (error) {
    console.log("error uploading book", error);
  }

  const book = await bookModel.create({
    title,
    genre,
    author: "66aaa632effbef619cef1969",
    coverImage: uploadResult?.secure_url,
    file: bookFileUpload?.secure_url,
  });
  res.json({
    book,
    message: "Book added successfully",
  });
};
