import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Allmovies = () => {
    const [movies, setMovies] = useState([]);
    const [message, setMessage] = useState('');
    const [isExist, setIsExist] = useState(false);
    const [subscriptions, setSubscriptions] = useState([]);
    const [members, setMembers] = useState([]);
    const navigate = useNavigate();
    const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
    const permissions = userData.permissions || {};

    useEffect(() => {
        fetchMovies();
        fetchSubscriptions();
        fetchMembers();
    }, []);

    const fetchMovies = async () => {
        try {
            const response = await axios.get('http://localhost:5000/movies/');
            setMovies(response.data);
        } catch (error) {
            console.error('Error fetching movies:', error);
            setMessage('Error fetching movies');
        }
    };

    const fetchSubscriptions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/watched_movies/');
            setSubscriptions(response.data);
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            setMessage('Error fetching subscriptions');
        }
    };

    const fetchMembers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/add_members/');
            setMembers(response.data);
        } catch (error) {
            console.error('Error fetching members:', error);
            setMessage('Error fetching members');
        }
    };

    const handleSync = async () => {
        try {
            const response = await axios.post('http://localhost:5000/movies/sync');
            setMessage(response.data.message);
            if (response.data.message === 'success') {
                fetchMovies();
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
    const addmovie = () => {
        navigate('/add_movie');
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

    const getSubscribersForMovie = (movieId) => {
        const movieSubscriptions = subscriptions.filter(sub =>
            sub.Movies.some(movie => movie.movieId === movieId)
        );

        return movieSubscriptions.map(sub => {
            const member = members.find(m => m._id === sub.MemberId);
            return {
                memberId: sub.MemberId,
                memberName: member ? member.name : 'Unknown Member',
                date: sub.Movies.find(m => m.movieId === movieId).date
            };
        });
    };

    return (
        <div className="container">
            {isExist && (
                <>
                    {message && <div className="message">{message}</div>}
                    <button onClick={handleSync} className="sync-button">Sync Movies</button>
                </>
            )}

            {permissions.createMovies && (
                <button onClick={addmovie}>Add movie </button>
            )}

            <div className="movies-grid">
                {movies.map((movie) => {
                    const subscribers = getSubscribersForMovie(movie._id);
                    return (
                        <div key={movie._id} className="movie-card">
                            <img src={movie.image} alt={movie.name} className="movie-image" />
                            <div className="movie-details">
                                <h2>{movie.name}</h2>
                                <p><strong>Genres:</strong> {movie.genres.join(', ')}</p>
                                <p><strong>Premiered:</strong> {new Date(movie.premiered).toLocaleDateString()}</p>

                                <div className="subscriptions-section">
                                    <h3>Subscriptions Watched:</h3>
                                    {subscribers.length > 0 ? (
                                        <ul className="subscribers-list">
                                            {subscribers.map((sub, index) => (
                                                <li key={index}>
                                                    {sub.memberName}
                                                    <br />
                                                    Watched on: {new Date(sub.date).toLocaleDateString()}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No subscriptions yet</p>
                                    )}
                                </div>

                                <div className="movie-actions">
                                    {permissions.updateMovies && (
                                        <button
                                            onClick={() => handleEdit(movie)}
                                            className="edit-button"
                                        >
                                            Edit
                                        </button>
                                    )}
                                    {permissions.deleteMovies && (
                                        <button
                                            onClick={() => handleDelete(movie._id)}
                                            className="delete-button"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Allmovies;




