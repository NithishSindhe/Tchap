import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import UserRegister from './componenets/UserRegister';
import UserLogin from './componenets/UserLogin';
import Testing from './componenets/Testing';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route exact path='/register' element={<UserRegister/>} />
        <Route exact path='/test' element={<Testing/>} />
        <Route exact path='/login' element={<UserLogin/>} />
        <Route exact path='/' element={<App/>}/>
      </Routes>

  </BrowserRouter>
    
  </React.StrictMode>
);
