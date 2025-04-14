import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://127.0.0.1:5000';

const Adduserfirstime = () => {
  const navigate = useNavigate();
  const ID_USERNAME = sessionStorage.getItem('id');
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState({
    id: ID_USERNAME,
    firstname: '',
    lastname: '',
    username: sessionStorage.getItem('username'),
    createddate: new Date().toLocaleDateString(),
    sessiontimeout: 0
  });

  const [permissions, setPermissions] = useState({
    id: ID_USERNAME,
    permissions: {
      viewMovies: true,
      createMovies: false,
      updateMovies: false,
      deleteMovies: false,
      viewSubscriptions: true,
      createSubscriptions: false,
      updateSubscriptions: false,
      deleteSubscriptions: false
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData.firstname || !userData.lastname) {
      setMessage('First name and last name are required');
      return;
    }

    try {
      // Add user to Users.json
      const userResponse = await axios.post(`${BASE_URL}/add_users/`, userData);
      console.log('User response:', userResponse.data);

      // Add permissions to Permissions.json
      const permissionsResponse = await axios.post(`${BASE_URL}/add_user/`, permissions);
      console.log('Permissions response:', permissionsResponse.data);

      // Check if either operation was successful
      if (userResponse.data || permissionsResponse.data) {
        setMessage("User and permissions created successfully!");
        setTimeout(() => {
          navigate("/main_page/");
        }, 1000);
      } else {
        setMessage("Error creating user or permissions");
      }
    } catch (error) {
      console.error('Error:', error);
      // Check if the error is due to duplicate user
      if (error.response && error.response.status === 409) {
        setMessage("User already exists");
      } else {
        setMessage("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="add-user-container">
      <h1>Add New User</h1>
      <form onSubmit={handleSubmit} className="add-user-form">
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            value={userData.firstname}
            onChange={(e) => setUserData({ ...userData, firstname: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            value={userData.lastname}
            onChange={(e) => setUserData({ ...userData, lastname: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={userData.username}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Session Timeout (minutes):</label>
          <input
            type="number"
            value={userData.sessiontimeout}
            onChange={(e) => setUserData({ ...userData, sessiontimeout: parseInt(e.target.value) })}
          />
        </div>
        <div className="permissions-section">
          <h3>Default Permissions:</h3>
          <p>View Movies: Enabled</p>
          <p>View Subscriptions: Enabled</p>
          <p>Other permissions will be disabled by default</p>
        </div>
        <button type="submit" className="submit-button">Add User</button>
      </form>
      {message && <p className={message.includes("Error") ? "error" : "success"}>{message}</p>}
    </div>
  );
};

export default Adduserfirstime;