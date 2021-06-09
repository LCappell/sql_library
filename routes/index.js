var express = require("express");
var router = express.Router();

const Book = require("../models").Book;

// Async Handler

const asyncHandler = (cb) => {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

/* GET home page - redirect to Books */
router.get("/", (req, res, next) => {
  res.redirect("/books");
});

// Get all Books
router.get(
  "/books",
  asyncHandler(async (req, res) => {
    const books = await Book.findAll({ order: [["createdAt", "DESC"]] });
    res.render("index", { books });
  })
);

// Get new book page

router.get(
  "/books/new",
  asyncHandler(async (req, res) => {
    res.render("new-book");
  })
);

// Post request to create new book

router.post(
  "/books/new",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/books");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        // checking the error
        book = await Book.build(req.body);
        res.render("new-book", {
          book,
          errors: error.errors,
          title: "New Book",
        });
      } else {
        throw error; // error caught in the asyncHandler's catch block
      }
    }
  })
);

// Get individual book page

router.get(
  "/books/:id",
  asyncHandler(async (req, res, next, err) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("update-book", { book });
    } else {
      next(err);
    }
  })
);
// Update book request

router.post(
  "/books/:id",
  asyncHandler(async (req, res, next) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect("/");
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        // checking the error
        book = await Book.build(req.body);
        book.id = req.params.id;
        res.render("update-book", {
          book,
          errors: error.errors,
          title: "Edit Book",
        });
      } else {
        throw error; // error caught in the asynchanlders catch block
      }
    }
  })
);

// Get Delete page

router.post(
  "/books/:id/delete",
  asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy(req.body);
      res.redirect("/books");
    } else {
      next(err);
    }
  })
);

module.exports = router;
