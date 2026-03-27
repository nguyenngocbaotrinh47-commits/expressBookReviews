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

// Khai báo thư viện (đảm bảo em đã có dòng này ở đầu file)
const axios = require('axios');

// Task 10: Get all books using Async/Await and Axios
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('https://raw.githubusercontent.com/ibm-developer-skills-network/expressBookReview/master/books.json');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books"});
  }
});

// Task 11: Get book details based on ISBN using Async/Await and Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get('https://raw.githubusercontent.com/ibm-developer-skills-network/expressBookReview/master/books.json');
    const book = response.data[isbn];
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error retrieving book details"});
  }
});
  
// Task 12: Get book details based on author using Async/Await and Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get('https://raw.githubusercontent.com/ibm-developer-skills-network/expressBookReview/master/books.json');
    const allBooks = response.data;
    const filtered_books = Object.values(allBooks).filter(b => b.author === author);
    
    if (filtered_books.length > 0) {
      return res.status(200).json({booksByAuthor: filtered_books});
    } else {
      return res.status(404).json({message: "Author not found"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books by author"});
  }
});

// Task 13: Get book details based on title using Async/Await and Axios
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get('https://raw.githubusercontent.com/ibm-developer-skills-network/expressBookReview/master/books.json');
    const allBooks = response.data;
    const filtered_books = Object.values(allBooks).filter(b => b.title === title);
    
    if (filtered_books.length > 0) {
      return res.status(200).json({booksByTitle: filtered_books});
    } else {
      return res.status(404).json({message: "Title not found"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books by title"});
  }
});
});

module.exports.public_users = public_users;
