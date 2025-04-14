import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const Addmovie = () => {
  const [movie, setMovie] = useState({
    name: '',
    genres: '',
    image: '',
    premiered: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!movie.name || !movie.genres || !movie.image || !movie.premiered) {
      setMessage('All fields are required');
      return;
    }

    try {
      // Convert genres string to array
      const movieData = {
        ...movie,
        genres: movie.genres.split(',').map(genre => genre.trim())
      };

      const response = await axios.post('http://localhost:5000/add_movies/', movieData);
      if (response.data.message === 'success') {
        setMessage('Movie added successfully!');
        setTimeout(() => {
          navigate('/main_page/movies');
        }, 1000);
      } else {
        setMessage('Error adding movie');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while adding movie');
    }
  };

  const handleCancel = () => {
    navigate('/main_page/movies');
  };

  return (
    <div className="add-movie-container">
      <h1>Add New Movie</h1>

      <form onSubmit={handleSubmit} className="add-form">
        <div className="form-group">
          <label>Movie Name:</label>
          <input
            type="text"
            value={movie.name}
            onChange={(e) => setMovie({ ...movie, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Genres (comma-separated):</label>
          <input
            type="text"
            value={movie.genres}
            onChange={(e) => setMovie({ ...movie, genres: e.target.value })}
            placeholder="e.g., Action, Drama, Comedy"
            required
          />
        </div>

        <div className="form-group">
          <label>Image URL:</label>
          <input
            type="url"
            value={movie.image}
            onChange={(e) => setMovie({ ...movie, image: e.target.value })}
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>

        <div className="form-group">
          <label>Premiered Date:</label>
          <input
            type="date"
            value={movie.premiered}
            onChange={(e) => setMovie({ ...movie, premiered: e.target.value })}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">Add Movie</button>
          <button type="button" onClick={handleCancel} className="cancel-button">Cancel</button>
        </div>
      </form>

      {message && <p className={message.includes('Error') ? 'error-message' : 'success-message'}>{message}</p>}
    </div>
  );
};

export default Addmovie;