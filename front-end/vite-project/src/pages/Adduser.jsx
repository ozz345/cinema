import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000';
const PERMISSIONS_URL = `${BASE_URL}/add_user/`;
const ADD_USER_URL = `${BASE_URL}/add_users/`;
const ADD_USER_MDB_URL = `${BASE_URL}/create_account/`;
const date = new Date()

const Adduser = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate()
  const [permissions, setPermissions] = useState({
    id: sessionStorage.id,
    firstname: '',
    lastname: '',
    username: '',
    password: '',
    sessiontimeout:'0',
    createddate: date.toLocaleDateString(),
    viewMovies: false,
    createMovies: false,
    updateMovies: false,
    deleteMovies: false,
    viewSubscriptions: false,
    createSubscriptions: false,
    updateSubscriptions: false,
    deleteSubscriptions: false
  });

  // Check if all subscription permissions are selected
  if (permissions.createSubscriptions &&
    permissions.updateSubscriptions &&
    permissions.deleteSubscriptions) {
    permissions.viewSubscriptions = true;
  }

  // Check if all movie permissions are selected
  if (permissions.createMovies &&
    permissions.updateMovies &&
    permissions.deleteMovies) {
    permissions.viewMovies = true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!permissions.firstname || !permissions.lastname || !permissions.username || !permissions.password) {
      setMessage('All fields are required');
      return;
    }

    try {
      // First, add user to MongoDB
      const mdbResponse = await axios.post(ADD_USER_MDB_URL, {
        username: permissions.username,
        password: permissions.password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000
      });

      console.log('MongoDB response:', mdbResponse.data);

      if (mdbResponse.data.message === "try again") {
        setMessage("Error: Username already exists in MongoDB");
        return;
      }

      // Get the MongoDB user ID from the response
      const mongoUserId = mdbResponse.data.id;

      // Prepare the user data for Users.json
      const userData = {
        id: mongoUserId, // Use MongoDB ID
        firstname: permissions.firstname,
        lastname: permissions.lastname,
        username: permissions.username,
        createddate: permissions.createddate,
        sessiontimeout: permissions.sessiontimeout
      };

      // Add user to Users.json
      const userResponse = await axios.post(ADD_USER_URL, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000
      });

      console.log('User data response:', userResponse.data);

      // Prepare permissions data
      const permissionsData = {
        id: mongoUserId, // Use same MongoDB ID
        permissions: {
          viewMovies: permissions.viewMovies,
          createMovies: permissions.createMovies,
          updateMovies: permissions.updateMovies,
          deleteMovies: permissions.deleteMovies,
          viewSubscriptions: permissions.viewSubscriptions,
          createSubscriptions: permissions.createSubscriptions,
          updateSubscriptions: permissions.updateSubscriptions,
          deleteSubscriptions: permissions.deleteSubscriptions
        }
      };

      // Add permissions
      const permissionsResponse = await axios.post(PERMISSIONS_URL, permissionsData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000
      });

      console.log('Permissions response:', permissionsResponse.data);

      // Check all responses
      if (mdbResponse.data && userResponse.data && permissionsResponse.data) {
        if (permissionsResponse.data.message === "Permission with this ID already exists") {
          setMessage("Error: User ID already exists. Please try again.");
        } else if (permissionsResponse.data.message === "Created" || userResponse.data.message === "created") {
          setMessage("User created successfully!");
          // Navigate immediately after successful creation
          navigate("/main_page/user-managemant");
        } else {
          setMessage(permissionsResponse.data.message || "User created but with unexpected response");
          // Navigate even if the message is unexpected but creation was successful
          navigate("/main_page/user-managemant");
        }
      } else {
        setMessage("Unexpected server response format");
      }

    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.message === 'Network Error') {
        setMessage("Cannot connect to server. Please make sure the backend server is running.");
      } else if (error.response?.status === 500) {
        setMessage("Server error: Please check the console for details");
      } else {
        setMessage("An error occurred. Please try again later.");
      }
    }
  };

  const check = async () => {
    navigate("/main_page/user-managemant");


  }

  return (
    <>
      <h1>Add User</h1>

      <form onSubmit={handleSubmit}>
        Firsts Name:{' '}
        <input
          type='text'
          value={permissions.firstname}
          onChange={(e) => setPermissions({ ...permissions, firstname: e.target.value })}
        />
        <br />
        Last Name:{' '}
        <input
          type='text'
          value={permissions.lastname}
          onChange={(e) => setPermissions({ ...permissions, lastname: e.target.value })}
        />
        <br />
        UserName:{' '}
        <input
          type='text'
          value={permissions.username}
          onChange={(e) => setPermissions({ ...permissions, username: e.target.value })}
        />
        <br />
        Password:{' '}
        <input
          type='password'
          value={permissions.password}
          onChange={(e) => setPermissions({ ...permissions, password: e.target.value })}
        />
        <br />
        SessionTimeOut (Min):{' '}
        <input
          type='number'
          onChange={(e) => setPermissions({ ...permissions, sessiontimeout: +e.target.value })}
        />
        <br />
        <div>
          <h3>Movies Permissions:</h3>
          <input
            type="checkbox"
            checked={permissions.viewMovies}
            onChange={() => setPermissions({ ...permissions, viewMovies: !permissions.viewMovies })}
          /> View Movies
          <br />
          <input
            type="checkbox"
            checked={permissions.createMovies}
            onChange={() => setPermissions({ ...permissions, createMovies: !permissions.createMovies })}
          /> Create Movies
          <br />
          <input
            type="checkbox"
            checked={permissions.updateMovies}
            onChange={() => setPermissions({ ...permissions, updateMovies: !permissions.updateMovies })}
          /> Update Movies
          <br />
          <input
            type="checkbox"
            checked={permissions.deleteMovies}
            onChange={() => setPermissions({ ...permissions, deleteMovies: !permissions.deleteMovies })}
          /> Delete Movies
        </div>
        <br />
        <div>
          <h3>Subscriptions Permissions:</h3>
          <input
            type="checkbox"
            checked={permissions.viewSubscriptions}
            onChange={() => setPermissions({ ...permissions, viewSubscriptions: !permissions.viewSubscriptions })}
          /> View Subscriptions
          <br />
          <input
            type="checkbox"
            checked={permissions.createSubscriptions}
            onChange={() => setPermissions({ ...permissions, createSubscriptions: !permissions.createSubscriptions })}
          /> Create Subscriptions
          <br />
          <input
            type="checkbox"
            checked={permissions.updateSubscriptions}
            onChange={() => setPermissions({ ...permissions, updateSubscriptions: !permissions.updateSubscriptions })}
          /> Update Subscriptions
          <br />
          <input
            type="checkbox"
            checked={permissions.deleteSubscriptions}
            onChange={() => setPermissions({ ...permissions, deleteSubscriptions: !permissions.deleteSubscriptions })}
          /> Delete Subscriptions
        </div>
        <br />
        <button type='submit'>Add User</button>
      </form>
      <button onClick={check}>Cancel</button>
      {message && <p style={{ color: message.includes("Error") ? "red" : "green" }}>{message}</p>}
    </>
  );
};

export default Adduser;



// try {
//   const response = await axios.post(USERS_URL, {
//     username,
//     password: passwords,
//     permissions
//   }, {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     timeout: 5000
//   });

//   console.log('Server response:', response.data);

//   if (response.data.message === "try again") {
//     setMessage("Error: Username already exists. Please try again.");
//   } else if (response.data.message === "success") {
//     setMessage("User created successfully!");
//     // Clear the form
//     setUsername('');
//     setPasswords('');
//     setPermissions({
//       viewMovies: false,
//       createMovies: false,
//       updateMovies: false,
//       deleteMovies: false,
//       viewSubscriptions: false,
//       createSubscriptions: false,
//       updateSubscriptions: false,
//       deleteSubscriptions: false
//     });
//   }
// } catch (error) {
//   console.error('Error:', error);
//   setMessage("An error occurred. Please try again later.");
// }



// const handlePermissionChange = (permission) => {
//   setPermissions(prev => {
//     const newPermissions = {
//       ...prev,
//       [permission]: !prev[permission]
//     };

//     // Check if all subscription permissions are selected
//     if (newPermissions.createSubscriptions &&
//         newPermissions.updateSubscriptions &&
//         newPermissions.deleteSubscriptions) {
//       newPermissions.viewSubscriptions = true;
//     }

//     // Check if all movie permissions are selected
//     if (newPermissions.createMovies &&
//         newPermissions.updateMovies &&
//         newPermissions.deleteMovies) {
//       newPermissions.viewMovies = true;
//     }

//     return newPermissions;
//   });
// };