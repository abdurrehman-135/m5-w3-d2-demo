const mongoose = require("mongoose");

const Book = require("../models/Book");

function validateObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Book not found.");
    error.statusCode = 404;
    throw error;
  }
}

function normalizeBookPayload(body) {
  return {
    title: body.title?.trim(),
    author: body.author?.trim(),
  };
}

function validateBookPayload(body) {
  if (!body.title || !body.author) {
    const error = new Error("Title and author are required.");
    error.statusCode = 400;
    throw error;
  }
}

async function getBooks(_request, response, next) {
  try {
    const books = await Book.find().sort({ createdAt: 1, _id: 1 }).lean();
    response.json(books);
  } catch (error) {
    next(error);
  }
}

async function getBookById(request, response, next) {
  try {
    validateObjectId(request.params.id);

    const book = await Book.findById(request.params.id).lean();

    if (!book) {
      const error = new Error("Book not found.");
      error.statusCode = 404;
      throw error;
    }

    response.json(book);
  } catch (error) {
    next(error);
  }
}

async function createBook(request, response, next) {
  try {
    const payload = normalizeBookPayload(request.body);
    validateBookPayload(payload);

    const book = await Book.create(payload);
    response.status(201).json(book);
  } catch (error) {
    next(error);
  }
}

async function updateBook(request, response, next) {
  try {
    validateObjectId(request.params.id);

    const payload = normalizeBookPayload(request.body);
    validateBookPayload(payload);

    const book = await Book.findByIdAndUpdate(request.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      const error = new Error("Book not found.");
      error.statusCode = 404;
      throw error;
    }

    response.json(book);
  } catch (error) {
    next(error);
  }
}

async function deleteBook(request, response, next) {
  try {
    validateObjectId(request.params.id);

    const book = await Book.findByIdAndDelete(request.params.id);

    if (!book) {
      const error = new Error("Book not found.");
      error.statusCode = 404;
      throw error;
    }

    response.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createBook,
  deleteBook,
  getBookById,
  getBooks,
  updateBook,
};
