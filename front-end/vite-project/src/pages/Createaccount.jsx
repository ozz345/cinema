import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000';
const USERS_URL = `${BASE_URL}/create_account/`;

const Createaccount = () => {
  const [username, setUsername] = useState('')
  const [passwords, setPasswords] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !passwords) {
      setMessage('Both username and password are required');
      return;
    }

    try {
      const response = await axios.post(USERS_URL, {"username": username, "password": passwords }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000
      });

      console.log('Server response:', response.data);

      if (response.data.message === "try again") {
        setMessage("Error: Username already exists. Please try again.");
      } else if (response.data.message === "success") {
        setMessage("Account created successfully!");

        setTimeout(() => {
          navigate('/');
        }, 1000)




      }
    } catch (error) {
      console.error('Error:', error);
      setMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <>
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit}>
        User Name:{' '}
        <input
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        Password:{' '}
        <input
          type='password'
          value={passwords}
          onChange={(e) => setPasswords(e.target.value)}
        />
        <br />
        <button type='submit'>Create Account</button>
      </form>
      {message && <p style={{ color: message.includes("Error") ? "red" : "green" }}>{message}</p>}
    </>
  );
};

export default Createaccount;
