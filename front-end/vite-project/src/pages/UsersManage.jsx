import Allusers from '../comps/Allusers';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const UsersManage = () => {
  const navigate = useNavigate()


  return (

<>
<div>
<h1>Users</h1>
<nav style={{
        backgroundColor: '#6743',
        padding: '1rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center'
      }}>
<Allusers/>
    </nav>















</div>



    </>
  );
};

export default UsersManage;



