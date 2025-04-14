import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Allmoviesforsubs = ({ mem_id }) => {
    const [movies, setMovies] = useState([]);
    const [watchedMovies, setWatchedMovies] = useState([]);
    const [message, setMessage] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState('');
    const [watchDate, setWatchDate] = useState('');
    const navigate = useNavigate();
    const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
    const permissions = userData.permissions || {};

    useEffect(() => {
        fetchMovies();
        fetchWatchedMovies();
    }, [mem_id]);

    const fetchMovies = async () => {
        try {
            const response = await axios.get('http://localhost:5000/movies');
            console.log('Movies data:', response.data); // Debug log
            setMovies(response.data);
        } catch (error) {
            console.error('Error fetching movies:', error);
            setMessage('Error fetching movies');
        }
    };

    const fetchWatchedMovies = async () => {
        try {
            const response = await axios.get('http://localhost:5000/watched_movies/');
            console.log('Watched movies data:', response.data); // Debug log
            // Find the subscription for this member
            const memberSubscription = response.data.find(sub => sub.MemberId === mem_id);
            if (memberSubscription) {
                setWatchedMovies(memberSubscription.Movies || []);
            } else {
                setWatchedMovies([]);
            }
        } catch (error) {
            console.error('Error fetching watched movies:', error);
            setMessage('Error fetching watched movies');
        }
    };

    const handleAddWatchedMovie = async (e) => {
        e.preventDefault();
        if (!selectedMovie || !watchDate) {
            setMessage('Please select a movie and date');
            return;
        }

        try {
            const movie = movies.find(m => m._id === selectedMovie);
            if (!movie) {
                setMessage('Selected movie not found');
                return;
            }

            const response = await axios.post('http://localhost:5000/watched_movies/', {
                MemberId: mem_id,
                movie_id: selectedMovie,
                watch_date: watchDate
            });

            if (response.data.message === 'success') {
                setMessage('Movie added to watched list');
                setShowAddForm(false);
                setSelectedMovie('');
                setWatchDate('');
                fetchWatchedMovies();
            }
        } catch (error) {
            console.error('Error adding watched movie:', error);
            setMessage('Error adding watched movie');
        }
    };

    const handleDeleteWatchedMovie = async (movieId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/watched_movies/${mem_id}/${movieId}`);
            if (response.data.message === 'deleted') {
                setMessage('Movie removed from watched list');
                fetchWatchedMovies();
            }
        } catch (error) {
            console.error('Error deleting watched movie:', error);
            setMessage('Error deleting watched movie');
        }
    };

    // Get unwatched movies (movies that are not in watchedMovies)
    const getUnwatchedMovies = () => {
        const watchedMovieIds = watchedMovies.map(wm => wm.movieId);
        return movies.filter(movie => !watchedMovieIds.includes(movie._id));
    };

    const handleEdit = (movie) => {
        sessionStorage.setItem('movie', JSON.stringify(movie));
        navigate('/edit_movie');
    };

    const next = (movie) => {
        sessionStorage.setItem('movie_single', JSON.stringify(movie));
        navigate("/movie_single/");
    };

    const handleDelete = async (movieId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/movies/${movieId}`);
            if (response.data.message === 'deleted') {
                setMessage('Movie deleted successfully');
                fetchMovies();
            } else {
                setMessage('Error deleting movie');
            }
        } catch (error) {
            console.error('Error deleting movie:', error);
            setMessage('Error deleting movie');
        }
    };

    return (
        <div className="watched-movies-container">
            {message && <div className="message">{message}</div>}

            {permissions.updateSubscriptions && (
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="add-button"
                >
                    {showAddForm ? 'Cancel' : 'Add Watched Movie'}
                </button>
            )}

            {showAddForm && permissions.updateSubscriptions && (
                <form onSubmit={handleAddWatchedMovie} className="add-form">
                    <div className="form-group">
                        <label>Select Movie:</label>
                        <select
                            value={selectedMovie}
                            onChange={(e) => setSelectedMovie(e.target.value)}
                            required
                        >
                            <option value="">Select a movie</option>
                            {getUnwatchedMovies().map(movie => (
                                <option key={movie._id} value={movie._id}>
                                    {movie.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Watch Date:</label>
                        <input
                            type="date"
                            value={watchDate}
                            onChange={(e) => setWatchDate(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">Add to Watched</button>
                </form>
            )}

            <div className="watched-movies-grid">
                {watchedMovies.map((watchedMovie) => {
                    const movie = movies.find(m => m._id === watchedMovie.movieId);
                    return (
                        <div key={watchedMovie.movieId} className="watched-movie-card">
                            <div className="watched-movie-details">
                                <button onClick={() => next(movie)}> {movie ? movie.name : 'Unknown Movie'}</button>
                                <p><strong>Watched on:</strong> {new Date(watchedMovie.date).toLocaleDateString()}</p>
                                {permissions.updateSubscriptions && (
                                    <button
                                        onClick={() => handleDeleteWatchedMovie(watchedMovie.movieId)}
                                        className="delete-button"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Allmoviesforsubs;







































{/* <div className="movies-grid">
{movies.map((movie) => (
    <div key={movie._id} className="movie-card">
        <img src={movie.image} alt={movie.name} className="movie-image" />
        <div className="movie-details">
            <h2>{movie.name}</h2>
            <p><strong>Genres:</strong> {movie.genres.join(', ')}</p>
            <p><strong>Premiered:</strong> {new Date(movie.premiered).toLocaleDateString()}</p>
            <div className="movie-actions">
                <button
                    onClick={() => handleEdit(movie)}
                    className="edit-button"
                >
                    Edit
                </button>
                <button
                    onClick={() => handleDelete(movie._id)}
                    className="delete-button"
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
))}
</div> */}