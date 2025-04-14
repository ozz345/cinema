import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const Addmember = () => {
  const [member, setMember] = useState({
    name: '',
    email: '',
    city: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!member.name || !member.email || !member.city) {
      setMessage('All fields are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/add_member/', member);
      if (response.data.message === 'success') {
        setMessage('Member added successfully!');
        setTimeout(() => {
          navigate('/main_page/subscription');
        }, 1000);
      } else if (response.data.error === 'Email already exists') {
        setMessage('Error: Email already exists. Please use a different email.');
      } else {
        setMessage('Error adding member');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while adding member');
    }
  };

  const handleCancel = () => {
    navigate('/main_page/subscription');
  };

  return (
    <div className="add-member-container">
      <h1>Add New Member</h1>

      <form onSubmit={handleSubmit} className="add-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={member.name}
            onChange={(e) => setMember({ ...member, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={member.email}
            onChange={(e) => setMember({ ...member, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>City:</label>
          <input
            type="text"
            value={member.city}
            onChange={(e) => setMember({ ...member, city: e.target.value })}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">Add Member</button>
          <button type="button" onClick={handleCancel} className="cancel-button">Cancel</button>
        </div>
      </form>

      {message && <p className={message.includes('Error') ? 'error-message' : 'success-message'}>{message}</p>}
    </div>
  );
};

export default Addmember;