import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const USERS_URL = 'http://127.0.0.1:5000';

const Loginpage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPasswords] = useState('');
  const [message, setMessage] = useState('');

  // Clear sessionStorage when component mounts
  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setMessage('Username and password are required');
      return;
    }

    try {
      // First check if user exists in Users.json
      const { data: users } = await axios.get(`${USERS_URL}/get_all_users`);
      const userExists = users.some(user => user.username === username);

      // Get MongoDB users and handle the response properly
      const { data: mongoUsers } = await axios.get(`${USERS_URL}/get_all_users_MDB`);
      console.log('MongoDB Response:', mongoUsers); // Debug log

      // Ensure mongoUsers is an array and find the user
      const mongoUser = Array.isArray(mongoUsers)
        ? mongoUsers.find(user => user.username === username)
        : null;

      console.log('Found MongoDB User:', mongoUser); // Debug log

      if (mongoUser) {
        // Verify password from MongoDB
        if (mongoUser.password !== password) {
          setMessage("An error occurred. Please try again later.");
          return;
        }
        sessionStorage.setItem('id', mongoUser._id);
        console.log('Setting MongoDB ID:', mongoUser._id);
      }

      if (!userExists) {
        // If user doesn't exist, redirect to add_user
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('password', password);

        setMessage("Welcome! Please Add User First!");
        console.log(mongoUser._id);

        setTimeout(() => {
          navigate("/add_user_firstime/");
        }, 1000);
        return;
      }

      // If user exists, verify credentials and get user details
      const { data: loginData } = await axios.get(USERS_URL);
      const match = loginData.find(user =>
        user.username === username &&
        user.password === password
      );

      if (match) {
        setMessage("Login successful!");
        // Store user information in sessionStorage
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('id', match._id);
        sessionStorage.setItem('firstname', match.firstname);
        sessionStorage.setItem('lastname', match.lastname);
        sessionStorage.setItem('fullname', `${match.firstname} ${match.lastname}`);

        setTimeout(() => {
          navigate("/main_page/");
        }, 1000);
      } else {
        setMessage("Invalid username or password");
      }
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>User Name:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPasswords(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">Login</button>
      </form>
      <div className="message">
        {message && <p className={message.includes("Error") ? "error" : "success"}>{message}</p>}
      </div>
      <div className="create-account-link">
        New User? <Link to='/create_account/'>Create Account</Link>
      </div>
    </div>
  );
};

export default Loginpage;
