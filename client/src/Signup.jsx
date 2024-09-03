import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner'; // Import the LoadingSpinner component

function Signup() {
  const [userName, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    axios.post('https://openx-api.vercel.app/register', { userName, address })
      .then((response) => {
        setMessage(response.data.message);
        navigate('/login'); // Redirect after successful registration
      })
      .catch((error) => {
        const errorMessage = error.response && error.response.data && error.response.data.message 
          ? error.response.data.message 
          : 'An error occurred. Please try again.';
        setMessage(errorMessage);
      })
      .finally(() => {
        setLoading(false); // Stop loading
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-0 shadow-lg p-4">
            <div className="card-body">
              <h3 className="card-title text-center mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: '#2D3748' }}>
                Sign Up
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="username" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', color: '#4A5568' }}>
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder='Username'
                    className="form-control"
                    id="username"
                    value={userName}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{ borderRadius: '5px', transition: 'all 0.3s ease', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="address" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', color: '#4A5568' }}>
                    Address
                  </label>
                  <input
                    type="text"
                    placeholder='Public Address (0x...) or Wallet Address'
                    className="form-control"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value.toLowerCase())}
                    required
                    style={{ borderRadius: '5px', transition: 'all 0.3s ease', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
                  />
                </div>
                <div className="d-flex justify-content-center align-items-center mt-3">
                  {loading ? (
                    <LoadingSpinner />
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-secondary"
                      style={{
                        background: "linear-gradient(45deg, #ff6f61, #d84315)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 20px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        transition: "background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "linear-gradient(45deg, #ff8a65, #d84a38)";
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.3)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "linear-gradient(45deg, #ff6f61, #d84315)";
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
                      }}
                    >
                      Submit
                    </button>
                  )}
                </div>
              </form>
              <div className="text-center mt-3" style={{ fontFamily: 'Poppins, sans-serif', color: '#2D3748' }}>
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
