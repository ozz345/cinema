import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import axios from 'axios';

const Allusers = () => {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    // const [users_foredit, setUsers_foredit] = useState();
    const navigate = useNavigate()
    const BASE_URL = 'http://127.0.0.1:5000';
    const currentUsername = sessionStorage.username;


    const next = (user) => {
        sessionStorage.setItem('user', JSON.stringify(user));
        navigate('/edit_user/');
    };



    const allusers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/get_all_users');
            console.log('Full data:', response.data);

            // Filter permissions for all users
            const filteredUsers = response.data.map(user => {
                const filteredPermissions = Object.entries(user.permissions || {})
                    .filter(([_, value]) => value === true)
                    .reduce((acc, [key]) => ({ ...acc, [key]: true }), {});
                    ;


                return {
                    ...user,
                    permissions: filteredPermissions
                };
            });

            setUsers(filteredUsers);

            console.log(filteredUsers);


        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };
    const deleteUser = async (userId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/delete_user/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });

            // Check the response message
            if (response.data.message === "deleted") {
                setMessage("User deleted successfully!");
                // Refresh the users list
                allusers();
            } else if (response.data.message === "user not found") {
                setMessage("User not found");
            } else {
                setMessage(response.data.message || "Error: Failed to delete user.");
            }
        } catch (error) {
            console.error('Error:', error);
            // Check if it's a specific error from the backend
            if (error.response && error.response.data && error.response.data.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage("An error occurred while deleting the user.");
            }
        }
    };
    return (
        <div style={{ textAlign: 'left' }}>
            {message && <p style={{ color: message.includes("Error") ? "red" : "green" }}>{message}</p>}
            <div>

                        <button style={{
                            padding: '8px 16px',
                            marginRight: '16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                        }} onClick={allusers}>All Users</button>
                                        {currentUsername === 'tret' && (
                    <>
                        <button style={{
                            padding: '8px 16px',
                            left: '80px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                        }} onClick={() => navigate("/add_user/")}>Add User</button>
                    </>
                )}
                {users.map((user, index) => (
                    <div key={user.id || index} style={{
                        marginBottom: '50px',
                        right: '80 px',
                        padding: '25px',
                        border: '1px solid #ccc',
                        textAlign: 'left'
                    }}>
                        <h3 style={{ marginBottom: '10px' }}>Name: {user.firstname} {user.lastname}</h3>
                        <p style={{ margin: '5px 0' }}>User Name: {user.username}</p>
                        <p style={{ margin: '5px 0' }}>Session Timeout: {user.sessiontimeout}</p>
                        <p style={{ margin: '5px 0' }}>Created Date: {user.createddate}</p>

                        <div>
                            <h4 style={{ marginBottom: '10px' }}>Active Permissions:</h4>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                flexWrap: 'wrap',
                                gap: '8px',
                                marginTop: '8px',
                                justifyContent: 'flex-end'
                            }}>
                                {Object.keys(user.permissions || {}).map(permission => (
                                    <span key={permission} style={{ backgroundColor: '#e9ecef', width: '150px', padding: '4px 12px', borderRadius: '16px', fontSize: '0.9em', color: '#495057' }}>
                                        {permission}
                                    </span>
                                ))}
                            </div> <br></br>
                            {currentUsername === 'tret' && (
                                <>
                                    <button
                                        onClick={() => next(user)}
                                        style={{
                                            padding: '8px 16px',
                                            marginRight: '16px',
                                            border: 'none',
                                            borderRadius: '4px',
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button onClick={() => deleteUser(user.id)} style={{ padding: '8px 16px', left: '80px', border: 'none', borderRadius: '4px', }}>Delete</button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Allusers;




