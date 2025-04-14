import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000';
const USER_UPDATE = `${BASE_URL}/update_user`;
const USER_PREMMISION = `${BASE_URL}/update_premission`;
const ADD_USER_URL = `${BASE_URL}/add_users/`;
const date = new Date()

const Edituser = () => {
  const [message, setMessage] = useState('');
  const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
  const navigate = useNavigate()

  const [permissions, setPermissions] = useState({
    id: userData.id || '',
    firstname: userData.firstname || '',
    lastname: userData.lastname || '',
    username: userData.username || '',
    sessiontimeout: userData.sessiontimeout ,
    createddate: date.toLocaleDateString(),
    viewMovies: userData.permissions?.viewMovies || false,
    createMovies: userData.permissions?.createMovies || false,
    updateMovies: userData.permissions?.updateMovies || false,
    deleteMovies: userData.permissions?.deleteMovies || false,
    viewSubscriptions: userData.permissions?.viewSubscriptions || false,
    createSubscriptions: userData.permissions?.createSubscriptions || false,
    updateSubscriptions: userData.permissions?.updateSubscriptions || false,
    deleteSubscriptions: userData.permissions?.deleteSubscriptions || false
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
    if (!permissions.firstname || !permissions.lastname) {
      setMessage('First name and last name are required');
      return;
    }
    const requestDatapermissions = {
      id: permissions.id,
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

    const requestDatausers = {
      id: permissions.id,
      firstname: permissions.firstname,
      lastname: permissions.lastname,
      username: permissions.username,
      createddate: permissions.createddate,
      sessiontimeout: permissions.sessiontimeout
    };

    try {
      const response = await axios.put(`${USER_UPDATE}/${permissions.id}`, requestDatausers, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000
      });


      const premissions = await axios.put(`${USER_PREMMISION}/${permissions.id}`, requestDatapermissions, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000
      });

      if (response.data.message &&  premissions.data.message === "updated") {

        setMessage("User updated successfully!");
        setTimeout(() => {
          navigate("/main_page/user-managemant");
        }, 1000)

      } else {
        setMessage("Error: Failed to update user permissions.");
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage("An error occurred while updating permissions. Please try again later.");
    }

    console.log(requestDatapermissions);
    console.log(requestDatausers);
  }

  const check =  () => {
    navigate("/main_page/user-managemant");

  }






  return (
    <>
      <h1>Edit User</h1>

      <form onSubmit={handleSubmit}>
        First Name:{' '}
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
        SessionTimeOut (Min):{' '}
        <input
          type='number'
          value={permissions.sessiontimeout}
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
        <button type='submit'>Update</button>
      </form>

      <button onClick={check}>Cancel</button>
      {message && <p style={{ color: message.includes("Error") ? "red" : "green" }}>{message}</p>}
    </>
  );
};

export default Edituser;



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