import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Editmovie = () => {
  const [message, setMessage] = useState('');
  const movieData = JSON.parse(sessionStorage.getItem('movie') || '{}');
  const navigate = useNavigate();

  const [movie, setMovie] = useState({
    id: movieData._id || '',
    name: movieData.name || '',
    genres: movieData.genres || [],
    image: movieData.image || '',
    premiered: movieData.premiered || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/movies/${movie.id}`, movie);
      if (response.data.message === "updated") {
        setMessage("Movie updated successfully!");
        setTimeout(() => {
          navigate("/main_page/movies");
        }, 1000);
      } else {
        setMessage("Error: Failed to update movie.");
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage("An error occurred while updating movie. Please try again later.");
    }
  };

  const handleCancel = () => {
    navigate("/main_page/movies");
  };

  return (
    <div className="edit-movie-container">
      <h1>Edit Movie</h1>

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={movie.name}
            onChange={(e) => setMovie({ ...movie, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Genres:</label>
          <input
            type="text"
            value={movie.genres.join(', ')}
            onChange={(e) => setMovie({ ...movie, genres: e.target.value.split(',').map(genre => genre.trim()) })}
            required
          />
        </div>

        <div className="form-group">
          <label>Image URL:</label>
          <input
            type="text"
            value={movie.image}
            onChange={(e) => setMovie({ ...movie, image: e.target.value })}
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
          <button type="submit" className="submit-button">Update Movie</button>
          <button type="button" onClick={handleCancel} className="cancel-button">Cancel</button>
        </div>
      </form>

      {message && <p className={message.includes("Error") ? "error-message" : "success-message"}>{message}</p>}
    </div>
  );
};

export default Editmovie;