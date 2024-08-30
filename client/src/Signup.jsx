import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'

function Signup() {
  const [userName, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    axios.post('https://openx-api.vercel.app/register', { userName, address })
      .then((response) => {
        setMessage(response.data.message);
        navigate('/login') // Set success message from server response
      })
      .catch((error) => {
        // If the error response exists, set the message; otherwise, set a generic error message
        const errorMessage = error.response && error.response.data && error.response.data.message 
          ? error.response.data.message 
          : 'An error occurred. Please try again.';
        setMessage(errorMessage);
      });
  };

  return (
<div className="container mt-5">
  <div className="row justify-content-center">
    <div className="col-md-6">
      <div 
        className="card border-0 shadow-lg" 
        style={{ backgroundColor: 'transparent' }}
      >
        <div className="card-body">
          <h3 
            className="card-title text-center mb-4"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '600',
              color: '#2D3748',
            }}
          >
            Sign Up
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label 
                htmlFor="username" 
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: '500',
                  color: '#4A5568',
                }}
              >
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={userName}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  borderRadius: '5px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
              />
            </div>
            <div className="form-group mb-3">
              <label 
                htmlFor="address" 
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: '500',
                  color: '#4A5568',
                }}
              >
                Address
              </label>
              <input
                type="text"
                className="form-control"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value.toLowerCase())}
                required
                style={{
                  borderRadius: '5px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary btn-block mt-3"
              style={{
                background: 'linear-gradient(45deg, #4f9d8d, #2c6b5e)',
                border: 'none',
                borderRadius: '5px',
                fontWeight: '600',
                fontSize: '16px',
                transition: 'background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'linear-gradient(45deg, #3f8d7d, #1d5d4e)';
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'linear-gradient(45deg, #4f9d8d, #2c6b5e)';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.2)';
              }}
            >
              Submit
            </button>
          </form>
          <div 
            className="text-center mt-3"
            style={{
              fontFamily: "'Poppins', sans-serif",
              color: '#2D3748',
            }}
          >
            Already have an account?
            <Link to="/login" style={{ color: '#2B6CB0', fontWeight: '500' }}> Log in here</Link>
          </div>
          {message && <p className="mt-3 text-center text-info">{message}</p>}
        </div>
      </div>
    </div>
  </div>
</div>

  );
}

export default Signup;
