import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Outlet } from 'react-router-dom';
import '../App.css';

const Allmovies = () => {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [message, setMessage] = useState('');
    const [isExist, setIsExist] = useState(false);
    const [subscriptions, setSubscriptions] = useState([]);
    const [members, setMembers] = useState([]);
    const [showMoviesList, setShowMoviesList] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [subscriptionFilter, setSubscriptionFilter] = useState('all');
    const navigate = useNavigate();
    const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
    const permissions = userData.permissions || {};

    useEffect(() => {
        fetchMovies();
        fetchSubscriptions();
        fetchMembers();
    }, []);

    useEffect(() => {
        let filtered = movies.filter(movie =>
            movie.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Apply subscription filter
        if (subscriptionFilter === 'with') {
            filtered = filtered.filter(movie => {
                const movieSubscriptions = subscriptions.filter(sub =>
                    sub.Movies.some(m => m.movieId === movie._id)
                );
                return movieSubscriptions.length > 0;
            });
        } else if (subscriptionFilter === 'without') {
            filtered = filtered.filter(movie => {
                const movieSubscriptions = subscriptions.filter(sub =>
                    sub.Movies.some(m => m.movieId === movie._id)
                );
                return movieSubscriptions.length === 0;
            });
        }

        setFilteredMovies(filtered);
    }, [searchTerm, movies, subscriptionFilter, subscriptions]);

    const fetchMovies = async () => {
        try {
            const response = await axios.get('http://localhost:5000/movies/');
            setMovies(response.data);
            setFilteredMovies(response.data);
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

    const handleAddMovie = () => {
        setShowMoviesList(false);
        navigate("/main_page/movies/add-movie");
    };

    const handleAllMovies = () => {
        setShowMoviesList(true);
        navigate("/main_page/movies");
        fetchMovies();
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSubscriptionFilter = (e) => {
        setSubscriptionFilter(e.target.value);
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
        <div className="movies-container">
            {isExist && (
                <div className="sync-section">
                    {message && <div className={`message ${message.includes("Error") ? 'error' : 'success'}`}>{message}</div>}
                    <button onClick={handleSync} className="sync-button">
                        <i className="fas fa-sync-alt"></i> Sync Movies
                    </button>
                </div>
            )}

            <div className="movies-header">

                <div className="movies-controls">
                    <div className="search-filter-container">
                        <div className="search-box">
                            <i className="fas fa-search"></i>
                            <input
                                type="text"
                                placeholder="Search.."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="search-input"
                            />
                        </div>
                        <div className="filter-box">
                            <select
                                value={subscriptionFilter}
                                onChange={handleSubscriptionFilter}
                                className="filter-select"
                            >
                                <option value="all">All Movies</option>
                                <option value="with">With Subscriptions</option>
                                <option value="without">Without Subscriptions</option>
                            </select>
                        </div>
                    </div>




                    <div className="action-buttons">
                        <button onClick={handleAllMovies} className="action-button all-movies-button">
                            <i className="fas fa-film"></i> All Movies
                        </button>
                        {permissions.createMovies && (
                            <button onClick={handleAddMovie} className="action-button add-movie-button">
                                <i className="fas fa-plus"></i> Add Movie
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {showMoviesList && (
                <div className="movies-grid">
                    {filteredMovies.length > 0 ? (
                        filteredMovies.map((movie) => {
                            const subscribers = getSubscribersForMovie(movie._id);
                            return (
                                <div key={movie._id} className="movie-card">
                                    <div className="movie-image-container">
                                        <img src={movie.image} alt={movie.name} className="movie-image" />
                                        <div className="movie-actions">
                                            {permissions.updateMovies && (
                                                <button
                                                    onClick={() => handleEdit(movie)}
                                                    className="action-button edit-button"
                                                    title="Edit Movie"
                                                >
                                                    Edit
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                            )}
                                            {permissions.deleteMovies && (
                                                <button
                                                    onClick={() => handleDelete(movie._id)}
                                                    className="action-button delete-button"
                                                    title="Delete Movie"
                                                >
                                                    Delete
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="movie-details">
                                        <h2 className="movie-title">{movie.name}</h2>
                                        <div className="movie-info">
                                            <div className="info-item">
                                                <i className="fas fa-tags"></i>
                                                <span>{movie.genres.join(', ')}</span>
                                            </div>
                                            <div className="info-item">
                                                <i className="fas fa-calendar"></i>
                                                <span>{new Date(movie.premiered).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="subscriptions-section">
                                            <h3 className="section-title">
                                                <i className="fas fa-users"></i> Subscriptions Watched
                                            </h3>
                                            {subscribers.length > 0 ? (
                                                <ul className="subscribers-list">
                                                    {subscribers.map((sub, index) => (
                                                        <li key={index} className="subscriber-item">
                                                            <div className="subscriber-info">
                                                                <span className="subscriber-name">{sub.memberName}</span>
                                                                <span className="watch-date">
                                                                    <i className="fas fa-clock"></i> {new Date(sub.date).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="no-subscriptions">No subscriptions yet</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-results">
                            <i className="fas fa-film"></i>
                            <p>No movies found matching your criteria</p>
                        </div>
                    )}
                </div>
            )}
            {!showMoviesList && <Outlet />}
        </div>
    );
};

export default Allmovies;




