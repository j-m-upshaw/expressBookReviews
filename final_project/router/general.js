const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req,res) => {
  const {username, password} = req.body;
  // Checks if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  // Checks if the user already exists
  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res.send(JSON.stringify(book, null, 4));
    } else {
        res.status(404).json({ message: "Book not found"});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const authoredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
  if (authoredBooks.length > 0) {
    res.send(JSON.stringify(authoredBooks, null, 4));
  } else {
    res.status(404).json({ message: "Books by this author not found" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const titledBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
  if (titledBooks.length > 0) {
    // res.sendStatus(200).json(JSON.stringify(titledBooks, null, 4)); Was only giving OK as a response, not the actual data. Changed to res.status(200).json(titledBooks) to send the data back with a 200 status code.
    res.status(200).json(titledBooks);
  } else {
    res.status(404).json({ message: "Books with this title not found" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.status(200).json(book.reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
