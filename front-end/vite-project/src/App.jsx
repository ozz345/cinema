import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './App.css'
import Loginpage from './pages/Loginpage';
import Createaccount from './pages/Createaccount';
import Mainpage from './pages/Mainpage';
import Adduser from './pages/Adduser';
import UsersManage from './pages/UsersManage';
import Edituser from './pages/Edituser';
import Subscription from './pages/Subscription';
import Editmember from './pages/Editmember';
import Allmovies from './comps/Allmovies';
import Movies from './pages/Movies';
import Addmember from './pages/Addmember';
import Movie_single from './comps/Movie_single';
import Editmovie from './pages/Editmovie';
import Addmovie from './pages/Addmovie';
import Adduserfirstime from './pages/Adduserfirstime';
import Edituser_without_prem from './pages/Edituser_without_prem';

function App() {
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const fetchData = () => {
  //     const products = []

  //     dispatch({ type: 'LOAD', payload: products });

  //   };
  //   fetchData();
  // }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Loginpage />} />
        <Route path="/create_account/" element={<Createaccount />} />
        {/* <Route path="/main_page/" element={<Mainpage />} /> */}
        <Route path="/add_user/" element={<Adduser />} />
        <Route path="/edit_user/" element={<Edituser />} />
        <Route path="/add_member/" element={<Addmember />} />
        <Route path="/edit_member/" element={<Editmember />} />
        <Route path="/movie_single/" element={<Movie_single />} />
        <Route path="/edit_movie/" element={<Editmovie />} />
        <Route path="/add_movie/" element={<Addmovie />} />
        <Route path="/add_user_firstime/" element={<Adduserfirstime />} />
        <Route path="/edituser_without_prem/" element={<Edituser_without_prem />} />

        {/* Nested Routing */}
        <Route path='/main_page' element={<Mainpage />}>
          <Route path="user-managemant" element={<UsersManage />}>
            <Route path="add-user" element={<Adduser />} />
          </Route>
          <Route path="subscription" element={<Subscription />}>
            <Route path="add-member" element={<Addmember />} />
          </Route>
          <Route path="movies" element={<Movies />}>
            <Route path="add-movie" element={<Addmovie />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
