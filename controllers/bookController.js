const bookProp = require("../models/bookProp");

exports.getAllBooks = (req, res) => {
  res.json(bookProp.getAll());
};

exports.searchBooks = (req, res) => {
  const { q = "", genre } = req.query;
  const results = bookProp.search(q, genre);
  res.json(results);
};

exports.getBookById = (req, res) => {
  const book = bookProp.getById(req.params.id);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
};

exports.addBook = (req, res) => {
  const book = bookProp.add(req.body);
  res.status(201).json(book);
};

exports.editBook = (req, res) => {
  const updated = bookProp.update(req.params.id, req.body);
  updated ? res.json(updated) : res.status(404).json({ message: "Not found" });
};

exports.bulkUploadBooks = (req, res) => {
  const count = bookProp.bulkUpload(req.body.books);
  res.json({ message: `${count} books uploaded.` });
};