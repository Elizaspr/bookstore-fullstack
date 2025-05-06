
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// Ensure the 'db' folder exists
const dbFolderPath = path.join(__dirname, 'db');
if (!fs.existsSync(dbFolderPath)) {
  fs.mkdirSync(dbFolderPath, { recursive: true });  // Create the folder if it doesn't exist
  console.log('Database directory created:', dbFolderPath);  // Log to confirm

}

// Now initialize the database
const db = new Database(path.join(dbFolderPath, 'database.db'));  // Use the correct path to the db file

// Get all books
exports.getAll = () => {
  const stmt = db.prepare('SELECT * FROM books');
  return stmt.all();
};

// Search books
exports.search = (query, genre) => {
  const stmt = db.prepare(`
    SELECT * FROM books
    WHERE title LIKE ? AND (? IS NULL OR genre = ?)
  `);
  return stmt.all(`%${query}%`, genre, genre);
};

// Get one book by ID
exports.getById = (id) => {
  const stmt = db.prepare('SELECT * FROM books WHERE id = ?');
  return stmt.get(id);
};

// Add new book
exports.add = (book) => {
  const stmt = db.prepare(`
    INSERT INTO books (title, author, genre, price, description)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(book.title, book.author, book.genre, book.price, book.description);
  return { id: result.lastInsertRowid, ...book };
};

// Update book
exports.update = (id, book) => {
  const stmt = db.prepare(`
    UPDATE books SET title = ?, author = ?, genre = ?, price = ?, description = ?
    WHERE id = ?
  `);
  const result = stmt.run(book.title, book.author, book.genre, book.price, book.description, id);
  return result.changes > 0 ? exports.getById(id) : null;
};

// Bulk upload books
exports.bulkUpload = (books) => {
  const stmt = db.prepare(`
    INSERT INTO books (title, author, genre, price, description)
    VALUES (?, ?, ?, ?, ?)
  `);
  const insertMany = db.transaction((bookList) => {
    for (const book of bookList) {
      stmt.run(book.title, book.author, book.genre, book.price, book.description);
    }
  });
  insertMany(books);
  return books.length;
};