import Allsubscriptions from '../comps/Allsubscriptions';
import Allmoviesforsubs from '../comps/Allmoviesforsubs';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const Subscription = () => {
  const navigate = useNavigate()


  return (

<>
<div>
<h1>Subscriptions</h1>
<nav style={{
        backgroundColor: '#6743',
        padding: '1rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center'
      }}>
<Allsubscriptions/>

    </nav>















</div>



    </>
  );
};

export default Subscription;



