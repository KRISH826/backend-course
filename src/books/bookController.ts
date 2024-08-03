import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "path";
import bookModel from "./bookSchema";
import fs from "node:fs";
import createHttpError from "http-errors";
import { AuthRequest } from "../middlewares/authenticate";
import { error } from "console";

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

    await fs.promises.unlink(bookFilePath);
    await fs.promises.unlink(filepath);

    res.status(201).json({
      id: newBook._id,
      newBook,
      message: "Book added successfully",
    });
  } catch (error) {
    return next(createHttpError(500, "error creating book"));
  }
};

export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, genre } = req.body;
  const bookID = req.params.id;

  const book = await bookModel.findOne({ _id: bookID });

  if (!book) {
    return next(createHttpError(404, "Book not found"));
  }

  const _req = req as AuthRequest;

  if (book.author.toString() !== _req.userId) {
    return next(createHttpError(403, "you can not update"));
  }

  // check if image exits
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  let completeCoverImage = "";

  if (files.coverImage) {
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const filename = files.coverImage[0].filename;
    const filepath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      filename
    );

    completeCoverImage = filename;
    const uploadResult = await cloudinary.uploader.upload(filepath, {
      filename_override: completeCoverImage,
      folder: "book-covers",
      format: coverImageMimeType,
    });
    completeCoverImage = uploadResult.secure_url;
    await fs.promises.unlink(filepath);
  }

  let completedFile = "";

  if (files.file) {
    const bookFilename = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFilename
    );
    completedFile = bookFilename;

    const bookFileUpload = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw", // for pdf files
      filename_override: bookFilename,
      folder: "Books-files",
      format: "pdf",
    });

    completedFile = bookFileUpload.secure_url;
    await fs.promises.unlink(bookFilePath);
  }

  const updatedBook = await bookModel.findOneAndUpdate(
    {
      _id: bookID,
    },
    {
      title,
      genre,
      coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
      file: completedFile ? completedFile : book.file,
    },
    { new: true }
  );

  res.status(201).json({
    updatedBook,
    message: "Book Updated Successfully",
  });
};

export const getallBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const book = await bookModel.find();
    res.status(200).json(book);
  } catch (error) {
    return next(createHttpError(500, "error while getting all"));
  }
};

export const getsingleBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const book = await bookModel.findById(id);
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }
    res.status(200).json({
      success: true,
      message: "book successfully found",
      book,
    });
  } catch (error) {
    return next(createHttpError(404, "error getting book"));
  }
};

//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const bookId = req.params.id;

//   const book = await bookModel.findOne({ _id: bookId });
//   if (!book) {
//     return next(createHttpError(404, "Book not found"));
//   }

//   const _req = req as AuthRequest;

//   try {
//     if (book.author.toString() !== _req.userId) {
//       return next(createHttpError(404, "You can not delete this book"));
//     }

//     const coverImageSPlit = book.coverImage.split("/");
//     const coverImagePublicId =
//       coverImageSPlit.at(-2) + "/" + coverImageSPlit.at(-1)?.split(".").at(-2);

//     // file
//     const bookFileSplit = book.file.split("/");
//     const bookFilePublicId = bookFileSplit.at(-2) + "/" + bookFileSplit.at(-1);

//     await cloudinary.uploader.destroy(coverImagePublicId);
//     await cloudinary.uploader.destroy(bookFilePublicId, {
//       resource_type: "raw",
//     });
//   } catch (error) {
//     return next(createHttpError(404, "error getting book delete"));
//   }

//   await bookModel.deleteOne({ _id: bookId });

//   return res.sendStatus(204).json({
//     success: true,
//     book,
//     message: "Book deleted successfully",
//   });
// };

export const deleteBook1 = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  let book = await bookModel.findByIdAndDelete(id);
  if (!book) {
    return next(createHttpError(404, "Book not found"));
  }
  const _req = req as AuthRequest;

  try {
    if (book.author.toString() !== _req.userId) {
      return next(createHttpError(404, "You can not delete this book"));
    }

    const coverImageSPlit = book.coverImage.split("/");
    const coverImagePublicId =
      coverImageSPlit.at(-2) + "/" + coverImageSPlit.at(-1)?.split(".").at(-2);

    // file
    const bookFileSplit = book.file.split("/");
    const bookFilePublicId = bookFileSplit.at(-2) + "/" + bookFileSplit.at(-1);
    console.log(bookFilePublicId);

    await cloudinary.uploader.destroy(coverImagePublicId);
    await cloudinary.uploader.destroy(bookFilePublicId, {
      resource_type: "raw",
    });
  } catch (error) {
    return next(createHttpError(404, "error getting book delete"));
  }

  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
  });
};
export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const book = await bookModel.findOne({ _id: id });
  if (!book) {
    return next(createHttpError(404, "Book not found"));
  }
  const _req = req as AuthRequest;

  if (book.author.toString() !== _req.userId) {
    return next(createHttpError(404, "You can not delete this book"));
  }

  const coverImageSPlit = book.coverImage.split("/");
  const coverImagePublicId =
    coverImageSPlit.at(-2) + "/" + coverImageSPlit.at(-1)?.split(".").at(-2);

  // file
  const bookFileSplit = book.file.split("/");
  const bookFilePublicId = bookFileSplit.at(-2) + "/" + bookFileSplit.at(-1);
  console.log(bookFilePublicId);

  await cloudinary.uploader.destroy(coverImagePublicId);
  await cloudinary.uploader.destroy(bookFilePublicId, {
    resource_type: "raw",
  });

  await bookModel.deleteOne({ _id: id });

  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
  });
};
