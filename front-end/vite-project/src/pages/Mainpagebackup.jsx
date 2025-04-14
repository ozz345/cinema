import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000';
const USERS_URL = `${BASE_URL}/get_all_users`;

const Mainpage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPasswords] = useState('');
  const [message, setMessage] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  const check = async () => {
    try {
      const { data } = await axios.get(USERS_URL);
      console.log('Full data:', data);

      // Filter permissions for all users
      const filteredData = data.map(user => ({
        ...user,
        permissions: Object.fromEntries(
          Object.entries(user.permissions || {})
            .filter(([_, value]) => value === true)
        )
      }));

      setFilteredUsers(filteredData);
      console.log('Filtered users:', filteredData);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      setMessage('Error loading permissions');
    }
  };

  return (
    <>
      <h1>Movies - Subscriptions Web Site</h1>
      <button>Movies</button>
      <button>Subscriptions</button>
      <button>User Managemant</button>
      <button>Log Out</button>

      <button onClick={check}>check</button>

      {/* Display filtered permissions for all users */}
      {filteredUsers.length > 0 && (
        <div>
          <h3>Users and Their Active Permissions:</h3>
          {filteredUsers.map((user, userIndex) => (
            <div key={userIndex}>
              <h4>{user.firstname} {user.lastname}</h4>
              <ul>
                {Object.entries(user.permissions).map(([permission, value], index) => (
                  <li key={index}>{permission}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </>
  );
};

export default Mainpage;



