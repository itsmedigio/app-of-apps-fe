import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const createBook = async () => {
    try {
      const response = await axios.post('http://localhost:5000/books', {
        title,
        author,
      });
      setBooks([...books, response.data]);
      setTitle('');
      setAuthor('');
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

  const updateBook = async (bookId, newTitle, newAuthor) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/books/${bookId}`,
        {
          title: newTitle,
          author: newAuthor,
        }
      );
      const updatedBooks = books.map((book) =>
        book.id === bookId ? response.data : book
      );
      setBooks(updatedBooks);
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const deleteBook = async (bookId) => {
    try {
      await axios.delete(`http://localhost:5000/books/${bookId}`);
      const updatedBooks = books.filter((book) => book.id !== bookId);
      setBooks(updatedBooks);
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div className="App">
      <h1 className="title">Library App</h1>
      <div className="form-container">
        <h2>Add a Book</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <button onClick={createBook}>Add Book</button>
      </div>
      <div className="books-container">
        <h2>Books</h2>
        {books.map((book) => (
          <div key={book.id} className="book-item">
            <input
              type="text"
              value={book.title}
              onChange={(e) =>
                updateBook(book.id, e.target.value, book.author)
              }
            />
            <input
              type="text"
              value={book.author}
              onChange={(e) =>
                updateBook(book.id, book.title, e.target.value)
              }
            />
            <button onClick={() => deleteBook(book.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
