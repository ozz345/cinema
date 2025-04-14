import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserGreeting = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get_all_users');
        const currentUser = response.data.find(user =>
          user.username === sessionStorage.getItem('username')
        );

        if (currentUser) {
          setUserData(currentUser);
          // Store complete user data in sessionStorage
          sessionStorage.setItem('user', JSON.stringify(currentUser));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleUsernameClick = () => {
    if (userData) {
      navigate("/edituser_without_prem/");
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '20px',
      backgroundColor: '#f8f9fa',
      padding: '10px 20px',
      borderRadius: '5px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      Welcome, <span
        onClick={handleUsernameClick}
        style={{
          cursor: 'pointer',
          color: '#007bff',
          textDecoration: 'underline'
        }}
      >
        {userData?.username || sessionStorage.getItem('username') || 'User'}
      </span> !
    </div>
  );
};

export default UserGreeting;