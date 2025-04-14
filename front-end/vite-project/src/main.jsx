import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {legacy_createStore as createStore  } from "redux";
import {Provider } from "react-redux";
import reducer from './Roots/root-reducer.js';

const store = createStore(reducer)
createRoot(document.getElementById('root')).render(
  <Provider store={store}>

<BrowserRouter>
<App />
</BrowserRouter>


  </Provider>


)
