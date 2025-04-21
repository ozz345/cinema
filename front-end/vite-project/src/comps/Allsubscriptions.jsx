import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Allmoviesforsubs from './Allmoviesforsubs';
import axios from 'axios';

const Allsubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
    const [message, setMessage] = useState('');
    const [isSynced, setIsSynced] = useState(false);
    const [showMembersList, setShowMembersList] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [watchedFilter, setWatchedFilter] = useState('all');
    const [watchedMovies, setWatchedMovies] = useState([]);
    const navigate = useNavigate();
    const BASE_URL = 'http://127.0.0.1:5000';
    const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
    const permissions = userData.permissions || {};

    useEffect(() => {
        fetchSubscriptions();
        fetchWatchedMovies();
    }, []);

    useEffect(() => {
        let filtered = subscriptions.filter(subscription =>
            subscription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subscription.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subscription.city.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Apply watched movies filter
        if (watchedFilter === 'with') {
            filtered = filtered.filter(subscription => {
                const memberWatchedMovies = watchedMovies.filter(wm => wm.MemberId === subscription._id);
                return memberWatchedMovies.length > 0;
            });
        } else if (watchedFilter === 'without') {
            filtered = filtered.filter(subscription => {
                const memberWatchedMovies = watchedMovies.filter(wm => wm.MemberId === subscription._id);
                return memberWatchedMovies.length === 0;
            });
        }

        setFilteredSubscriptions(filtered);
    }, [searchTerm, subscriptions, watchedFilter, watchedMovies]);

    const fetchSubscriptions = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/add_members`);
            setSubscriptions(response.data);
            setFilteredSubscriptions(response.data);
            if (response.data && response.data.length > 0) {
                setIsSynced(true);
            }
        } catch (error) {
            setMessage('Error fetching subscriptions');
            console.error('Error:', error);
        }
    };

    const fetchWatchedMovies = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/watched_movies`);
            setWatchedMovies(response.data);
        } catch (error) {
            console.error('Error fetching watched movies:', error);
        }
    };

    const handleSync = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/add_members/sync`);
            setMessage(response.data.message);
            if (response.data.message === 'success') {
                setIsSynced(true);
                fetchSubscriptions();
            }
        } catch (error) {
            setMessage('Error syncing members');
            console.error('Error:', error);
        }
    };

    const handleEdit = (member) => {
        sessionStorage.setItem('member', JSON.stringify(member));
        navigate('/edit_member');
    };

    const handleAddMember = () => {
        setShowMembersList(false);
        navigate("/main_page/subscription/add-member");
    };

    const handleAllMembers = () => {
        setShowMembersList(true);
        navigate("/main_page/subscription");
        fetchSubscriptions();
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleDelete = async (memberId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/delete_member/${memberId}`);
            if (response.data.message === 'deleted') {
                setMessage('Member deleted successfully');
                fetchSubscriptions();
            } else {
                setMessage('Error deleting member');
            }
        } catch (error) {
            setMessage('Error deleting member');
            console.error('Error:', error);
        }
    };

    const handleWatchedFilter = (e) => {
        setWatchedFilter(e.target.value);
    };

    return (
        <div className="subscriptions-container">
            {message && <div className={`message ${message.includes("Error") ? 'error' : 'success'}`}>{message}</div>}

            {!isSynced && (
                <div className="sync-section">
                    <button className="sync-button" onClick={handleSync}>
                        <i className="fas fa-sync-alt"></i> Sync Members
                    </button>
                </div>
            )}

            <div className="subscriptions-header">
                <div className="subscriptions-controls">
                    <div className="search-filter-container">
                        <div className="search-box">
                            <i className="fas fa-search"></i>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="search-input"
                            />
                        </div>
                        <div className="filter-box">
                            <select
                                value={watchedFilter}
                                onChange={handleWatchedFilter}
                                className="filter-select"
                            >
                                <option value="all">All Members</option>
                                <option value="with">With Watched Movies</option>
                                <option value="without">Without Watched Movies</option>
                            </select>
                        </div>
                    </div>



                    <div className="action-buttons">
                        <button onClick={handleAllMembers} className="action-button all-movies-button">
                            <i className="fas fa-users"></i> All Members
                        </button>
                        {permissions.createSubscriptions && (
                            <button onClick={handleAddMember} className="action-button add-movie-button">
                                <i className="fas fa-user-plus"></i> Add Member
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {showMembersList && (
                <div className="subscriptions-grid">
                    {filteredSubscriptions.length > 0 ? (
                        filteredSubscriptions.map((subscription) => (
                            <div key={subscription._id} className="subscription-card">
                                <div className="member-details">
                                    <h2 className="member-title">{subscription.name}</h2>
                                    <div className="member-info">
                                        <div className="info-item">
                                            <i className="fas fa-envelope">Email:</i>
                                            <span>{subscription.email}</span>
                                        </div>
                                        <div className="info-item">
                                            <i className="fas fa-city">City:</i>
                                            <span>{subscription.city}</span>
                                        </div>
                                    </div>

                                    <div className="member-actions">
                                        {permissions.updateSubscriptions && (
                                            <button
                                                onClick={() => handleEdit(subscription)}
                                                className="action-button edit-button"
                                                title="Edit Member"
                                            >
                                                <i className="fas fa-edit"></i> Edit
                                            </button>
                                        )}
                                        {permissions.deleteSubscriptions && (
                                            <button
                                                onClick={() => handleDelete(subscription._id)}
                                                className="action-button delete-button"
                                                title="Delete Member"
                                            >
                                                <i className="fas fa-trash"></i> Delete
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="watched-movies-section">
                                    <h3 className="section-title">
                                        <i className="fas fa-film"></i> Watched Movies
                                    </h3>
                                    <Allmoviesforsubs mem_id={subscription._id} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            <i className="fas fa-users"></i>
                            <p>No members found matching your criteria</p>
                        </div>
                    )}
                </div>
            )}
            {!showMembersList && <Outlet />}
        </div>
    );
};

export default Allsubscriptions;