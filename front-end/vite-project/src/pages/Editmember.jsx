import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000';
const MEMBER_UPDATE = `${BASE_URL}/update_member`;


const Editmember = () => {
  const [message, setMessage] = useState('');
  const memberData = JSON.parse(sessionStorage.getItem('member') || '{}');
  const navigate = useNavigate()

  const [members, setMembers] = useState({
    id: memberData._id || '',
    name: memberData.name || '',
    email: memberData.email || '',
    city: memberData.city || '',
  });



  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!members.id) {
    //   setMessage('First name and last name are required');
    //   return;
    // }

    const requestDatamember = {
      id: members.id,
      name: members.name,
      email: members.email
    };

    console.log(requestDatamember);


    try {
      const response = await axios.put(`${MEMBER_UPDATE}/${members.id}`, requestDatamember, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000
      });



      if (response.data.message === "updated") {

        setMessage("Member updated successfully!");
        setTimeout(() => {
          navigate("/main_page/subscription");
        }, 1000)

      } else {
        setMessage("Error: Failed to update member.");
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage("An error occurred while updating member. Please try again later.");
    }

  }

  const check =  () => {
    navigate("/main_page/subscription");

  }






  return (
    <>
      <h1>Edit Member</h1>

      <form onSubmit={handleSubmit}>
       Name:{' '}
        <input
          type='text'
          value={members.name}
          onChange={(e) => setMembers({ ...members, name: e.target.value })}
        />
        <br />
        Email:{' '}
        <input
          type='text'
          value={members.email}
          onChange={(e) => setMembers({ ...members, email: e.target.value })}
        />
        <br />
        City:{' '}
        <input
          type='text'
          value={members.city}
          onChange={(e) => setMembers({ ...members, city: e.target.value })}
        />
        <br />
        <br />
        <button type='submit'>Update</button>
      </form>

      <button onClick={check}>Cancel</button>
      {message && <p style={{ color: message.includes("Error") ? "red" : "green" }}>{message}</p>}
    </>
  );
};

export default Editmember;


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
