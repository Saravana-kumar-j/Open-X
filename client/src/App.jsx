import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Signup'
import Login from './Login';
import Tweet from './Tweet';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { Buffer } from 'buffer';



function App() {
  window.Buffer = Buffer;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path='/register' element={<Signup />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/Tweet' element={<Tweet />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
