import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const Allusers = () => {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [showUsersList, setShowUsersList] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const BASE_URL = 'http://127.0.0.1:5000';
    const currentUsername = sessionStorage.username;

    const next = (user) => {
        sessionStorage.setItem('user', JSON.stringify(user));
        navigate('/edit_user/');
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/get_all_users');
            const filteredUsers = response.data.map(user => {
                const filteredPermissions = Object.entries(user.permissions || {})
                    .filter(([_, value]) => value === true)
                    .reduce((acc, [key]) => ({ ...acc, [key]: true }), {});

                return {
                    ...user,
                    permissions: filteredPermissions
                };
            });

            setUsers(filteredUsers);
            setShowUsersList(true);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleAddUserClick = () => {
        setShowUsersList(false);
        navigate("/main_page/user-managemant/add-user");
    };

    const deleteUser = async (userId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/delete_user/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });

            if (response.data.message === "deleted") {
                setMessage("User deleted successfully!");
                fetchUsers();
            } else if (response.data.message === "user not found") {
                setMessage("User not found");
            } else {
                setMessage(response.data.message || "Error: Failed to delete user.");
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage("An error occurred while deleting the user.");
            }
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="users-container">
            {message && <div className={`message ${message.includes("Error") ? 'error' : 'success'}`}>{message}</div>}

            <div className="users-header">
                <div className="users-controls">
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

                    <div className="action-buttons">
                        <button onClick={fetchUsers} className="all-movies-button">
                            <i className="fas fa-users"></i> All Users
                        </button>
                        {currentUsername === 'tret' && (
                            <button onClick={handleAddUserClick} className="add-movie-button">
                                <i className="fas fa-user-plus"></i> Add User
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {showUsersList && (
                <div className="users-grid">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <div key={user.id} className="user-card">
                                <div className="user-details">
                                    <h2 className="user-title">{user.firstname} {user.lastname}</h2>
                                    <div className="user-info">
                                        <div className="info-item">
                                            <i className="fas fa-user"></i>
                                            <span>Username: {user.username}</span>
                                        </div>
                                        <div className="info-item">
                                            <i className="fas fa-clock"></i>
                                            <span>Session Timeout: {user.sessiontimeout}</span>
                                        </div>
                                        <div className="info-item">
                                            <i className="fas fa-calendar"></i>
                                            <span>Created Date: {user.createddate}</span>
                                        </div>
                                    </div>

                                    <div className="permissions-section">
                                        <h3 className="section-title">
                                            <i className="fas fa-key"></i> Active Permissions
                                        </h3>
                                        <div className="permissions-grid">
                                            {Object.keys(user.permissions || {}).map(permission => (
                                                <span key={permission} className="permission-tag">
                                                    {permission}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {currentUsername === 'tret' && (
                                        <div className="user-actions">
                                            <button
                                                onClick={() => next(user)}
                                                className="action-button edit-button"
                                                title="Edit User"
                                            >
                                                <i className="fas fa-edit"></i> Edit
                                            </button>
                                            <button
                                                onClick={() => deleteUser(user.id)}
                                                className="action-button delete-button"
                                                title="Delete User"
                                            >
                                                <i className="fas fa-trash"></i> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            <i className="fas fa-users"></i>
                            <p>No users found matching your criteria</p>
                        </div>
                    )}
                </div>
            )}
            {!showUsersList && <Outlet />}
        </div>
    );
};

export default Allusers;