const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); 

// Task 7: Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  
  // Check if both username and password are provided in the request body
  if (username && password) {
    // Validate if the user already exists in our records
    if (!isValid(username)) { 
      // Add the new user credentials to the users array
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  // Return an error if credentials are missing
  return res.status(404).json({message: "Unable to register user. Please provide username and password."});
});

// Task 10: Get the list of all books available in the shop
// Implemented using async/await to handle asynchronous operations
public_users.get('/', async function (req, res) {
  try {
    // Simulating an asynchronous fetching operation
    const getBooks = await Promise.resolve(books);
    return res.status(200).send(JSON.stringify(getBooks, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books"});
  }
});

// Task 11: Get book details based on ISBN
// Implemented using async/await for better readability and maintainability
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  
  try {
    // Simulating asynchronous retrieval of a specific book by its ISBN
    const book = await Promise.resolve(books[isbn]);
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error retrieving book by ISBN"});
  }
});
  
// Task 12: Get book details based on author
// Implemented using async/await to handle the data filtering asynchronously
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  
  try {
    // Fetch all books and filter them based on the provided author name
    const allBooks = await Promise.resolve(books);
    const filtered_books = Object.values(allBooks).filter(b => b.author === author);
    
    // Check if any books match the author criteria
    if (filtered_books.length > 0) {
      return res.status(200).json({booksByAuthor: filtered_books});
    } else {
      return res.status(404).json({message: "Author not found"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books by author"});
  }
});

// Task 13: Get book details based on title
// Implemented using async/await to keep consistent asynchronous pattern
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  
  try {
    // Fetch all books and filter them based on the exact title
    const allBooks = await Promise.resolve(books);
    const filtered_books = Object.values(allBooks).filter(b => b.title === title);
    
    // Return the matched books or a 404 error if empty
    if (filtered_books.length > 0) {
      return res.status(200).json({booksByTitle: filtered_books});
    } else {
      return res.status(404).json({message: "Title not found"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books by title"});
  }
});

// Task 6: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  // Directly access the reviews object for the provided ISBN
  if (books[isbn]) {
      return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.public_users = public_users;
