import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Movie_single = () => {
    const [movies, setMovies] = useState([]);
    const [movies_sing, setMovies_sing] = useState([]);


    const movieData = JSON.parse(sessionStorage.getItem('movie_single') || '{}');
    const [message, setMessage] = useState('');
    const [isExist, setIsExist] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const response = await axios.get('http://localhost:5000/movies/');
            const movie_sing = response.data.find(movie => movie.name === movieData.name);

            setMovies(response.data);
            setMovies_sing([movieData])




        } catch (error) {
            console.error('Error fetching movies:', error);
            setMessage('Error fetching movies');
        }
    };

    const handleSync = async () => {
        try {
            const response = await axios.post('http://localhost:5000/movies/sync');
            setMessage(response.data.message);
            if (response.data.message === 'success') {
                fetchMovies(); // Refresh the list after syncing
            }
        } catch (error) {
            console.error('Error syncing movies:', error);
            setMessage('Error syncing movies');
        }
    };

    const handleEdit = (movie) => {
        sessionStorage.setItem('movie', JSON.stringify(movie));
        navigate('/edit_movie');
    };

    const back = () => {

        navigate('/main_page/subscription');
    };


    const handleDelete = async (movieId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/movies/${movieId}`);
            if (response.data.message === 'deleted') {
                setMessage('Movie deleted successfully');
                fetchMovies(); // Refresh the list after deletion
            } else {
                setMessage('Error deleting movie');
            }
        } catch (error) {
            console.error('Error deleting movie:', error);
            setMessage('Error deleting movie');
        }
    };

    return (
        <div className="container">







            <div className="movies-grid">

                {movies_sing.map((movie) => (
                    <div key={movie._id} className="movie-card">
                        <img src={movie.image} alt={movie.name} className="movie-image" />
                        <div className="movie-details">
                            <h2>{movie.name}  {new Date(movie.premiered).toLocaleDateString()}</h2>
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

                                <button
                                    onClick={back}
                                    className="delete-button"
                                >
                                    back
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Movie_single;




