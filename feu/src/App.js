import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import Login from './Components/Login';
import Main from './Components/main/Main'
import Signup from './Components/Signup/Signup';
function App() {


  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/traffic' element={<Main />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;