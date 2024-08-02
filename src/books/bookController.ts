import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "path";

export const addBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const {title, author,} = req.body;
  console.log("files", req.files);
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

  res.json({
    message: "Book added successfully",
  });
};
