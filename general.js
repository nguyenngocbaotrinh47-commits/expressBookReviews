const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Khai báo axios theo yêu cầu của Task 11

// Task 7: Đăng ký người dùng
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  
  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user. Please provide username and password."});
});

// Task 10: Lấy danh sách tất cả sách (Sử dụng Async/Await)
public_users.get('/', async function (req, res) {
  try {
    const getBooks = await Promise.resolve(books);
    return res.status(200).send(JSON.stringify(getBooks, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books"});
  }
});

// Task 11: Tìm sách theo ISBN (Sử dụng Promises)
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })
  .then(book => res.status(200).json(book))
  .catch(err => res.status(404).json({message: err}));
});
  
// Task 12: Tìm sách theo Tác giả (Sử dụng Promises)
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  
  new Promise((resolve, reject) => {
    let filtered_books = Object.values(books).filter(b => b.author === author);
    if (filtered_books.length > 0) {
      resolve(filtered_books);
    } else {
      reject("Author not found");
    }
  })
  .then(data => res.status(200).json({booksByAuthor: data}))
  .catch(err => res.status(404).json({message: err}));
});

// Task 13: Tìm sách theo Tiêu đề (Sử dụng Promises)
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  
  new Promise((resolve, reject) => {
    let filtered_books = Object.values(books).filter(b => b.title === title);
    if (filtered_books.length > 0) {
      resolve(filtered_books);
    } else {
      reject("Title not found");
    }
  })
  .then(data => res.status(200).json({booksByTitle: data}))
  .catch(err => res.status(404).json({message: err}));
});

// Task 6: Lấy Review của sách
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  if (books[isbn]) {
      return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.public_users = public_users;
