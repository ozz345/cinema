import { Link, useNavigate, Outlet } from 'react-router-dom';
import UserGreeting from '../comps/UserGreeting';
import { useState } from 'react';

const Mainpage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
  const permissions = userData.permissions || {};

  // Check if user has any view permissions
  const hasAnyViewPermission = permissions.viewMovies || permissions.viewSubscriptions;

  return (
    <div>
      <nav style={{
        backgroundColor: '#333',
        padding: '1rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>

        <UserGreeting/>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {hasAnyViewPermission && (
            <h1 style={{ color: 'white', margin: 0 }}>
              <Link to="/main_page/" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '4px', backgroundColor: '#444' }}>
                Movies & Subscriptions
              </Link>
            </h1>
          )}
          <div style={{ display: 'flex', gap: '1rem' }}>
            {permissions.viewMovies && (
              <Link to="movies" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '4px', backgroundColor: '#444' }}>
                Movies
              </Link>
            )}
            {permissions.viewSubscriptions && (
              <Link to="subscription" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '4px', backgroundColor: '#444' }}>
                Subscriptions
              </Link>
            )}
            <Link to="user-managemant" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '4px', backgroundColor: '#444' }}>
              User Management
            </Link>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          style={{
            color: 'white',
            backgroundColor: '#dc3545',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Log Out
        </button>
      </nav>

      <div style={{ padding: '0 2rem' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Mainpage;



