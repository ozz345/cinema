import React from 'react'
import Allmovies from '../comps/Allmovies'

const Movies = () => {
  return (
    <div>
<h1>Movies</h1>
<nav style={{
        backgroundColor: '#6743',
        padding: '1rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center'
      }}>
<Allmovies/>

    </nav>




    </div>

  )
}

export default Movies