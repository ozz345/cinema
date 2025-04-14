import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Allmoviesforsubs from './Allmoviesforsubs';
import axios from 'axios';

const Allsubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [message, setMessage] = useState('');
    const [isSynced, setIsSynced] = useState(false);
    const [ismembers, setIsmembers] = useState(false);
    const navigate = useNavigate()
    const BASE_URL = 'http://127.0.0.1:5000';
    const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
    const permissions = userData.permissions || {};

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/add_members`);
            setSubscriptions(response.data);
            if (response.data && response.data.length > 0) {
                setIsSynced(true);
            }
        } catch (error) {
            setMessage('Error fetching subscriptions');
            console.error('Error:', error);
        }
    };

    const handleSync = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/add_members/sync`);
            setMessage(response.data.message);
            if (response.data.message === 'success') {
                setIsSynced(true);
                fetchSubscriptions();
            }
        } catch (error) {
            setMessage('Error syncing members');
            console.error('Error:', error);
        }
    };

    const handleEdit = (member) => {
        sessionStorage.setItem('member', JSON.stringify(member));
        navigate('/edit_member');
    };
    const next = () => {
        navigate('/add_member/');
    };
    const handleDelete = async (memberId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/delete_member/${memberId}`);
            if (response.data.message === 'deleted') {
                setMessage('Member deleted successfully');
                fetchSubscriptions();
            } else {
                setMessage('Error deleting member');
            }
        } catch (error) {
            setMessage('Error deleting member');
            console.error('Error:', error);
        }
    };

    return (
        <div className="subscriptions-container">

            {message && <div className="message">{message}</div>}

            {!isSynced && (
                <button
                    className="sync-button"
                    onClick={handleSync}
                >
                    Sync Members
                </button>
            )}

            <button
                onClick={() => setIsmembers(!ismembers)}
                className="toggle-button"
            >
                All Members
            </button>
            {permissions.createSubscriptions && (
                <button
                    onClick={next}
                    className="toggle-button"
                >
                    Add Member
                </button>
            )}
            {!ismembers && (
            <div className="subscriptions-grid">
                {subscriptions.map((subscription) => (


                    <div key={subscription._id} className="subscription-card">
                        <div className="member-details">
                            <h2>{subscription.name}</h2>
                            <p><strong>Email:</strong> {subscription.email}</p>
                            <p><strong>City:</strong> {subscription.city}</p>

                                <div className="member-actions">
                                    {permissions.updateSubscriptions && (
                                        <button
                                            className="edit-button"
                                            onClick={() => handleEdit(subscription)}
                                        >
                                            Edit
                                        </button>
                                    )}
                                    {permissions.deleteSubscriptions && (
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDelete(subscription._id)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>

                        </div>

                        <div className="watched-movies-section">
                            <h3>Watched Movies</h3>
                            <Allmoviesforsubs mem_id={subscription._id} />
                        </div>
                    </div>

                ))}
            </div>
            )}
        </div>
    );
};

export default Allsubscriptions;




