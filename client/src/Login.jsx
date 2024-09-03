import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import './LoadingSpinner.css'

function Login() {
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const connectToMetamask = async () => {
    if (window.ethereum) {
      try {
        const [selectedAddress] = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        if (selectedAddress) {
          setAddress(selectedAddress);
        } else {
          setError('No accounts found. Please make sure MetaMask is set up properly.');
        }
      } catch (err) {
        setError(`Error connecting to MetaMask: ${err.message}`);
      }
    } else {
      setError('MetaMask is not installed. Please install MetaMask and try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Start loading

    try {
      const response = await axios.post('https://openx-api.vercel.app/login', { address });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userName', response.data.userName);
      localStorage.setItem('address', address);
      setMessage(`Welcome back, ${response.data.userName}!`);
      navigate('/Tweet');
    } catch (error) {
      const errorMessage = error.response && error.response.data && error.response.data.message 
        ? error.response.data.message 
        : 'An error occurred. Please try again.';
      setMessage(errorMessage);
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-0 shadow-lg p-4">
            <div className="card-body">
              <h3 className="card-title text-center" style={{ fontFamily: 'Poppins', color: '#2D3748' }}>Open X</h3>
              <div className="text-center">
                <p>
                  OpenX is a blockchain-based social media platform designed to 
                  ensure that every message posted is recorded permanently on an 
                  immutable blockchain. By making posts uneditable and tamper-proof, 
                  OpenX fosters a transparent and trustworthy environment where users 
                  can share their thoughts with confidence, knowing their <b>words are preserved 
                  with integrity</b>.
                </p>
                <p>Experience it more:</p>
                <button
                  onClick={connectToMetamask}
                  className="btn btn-primary"
                  style={{
                    background: "linear-gradient(45deg, #4e73df, #224abe)",
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
                    e.currentTarget.style.background = "linear-gradient(45deg, #5a8cff, #2c2f9f)";
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.3)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "linear-gradient(45deg, #4e73df, #224abe)";
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
                  }}
                >
                  Connect with MetaMask
                </button>
              </div>
              {address && (
                <p className="mt-3 text-center">Connected Account: <b>{address}</b></p>
              )}
              {error && <p className="mt-3 text-center text-danger">{error}</p>}
              <br></br>
              <p>Once your Public Address is displayed above, Press Login:</p>
              <div className="text-center mt-3">
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <button
                      onClick={handleSubmit}
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
                      Login
                    </button>
                  </>
                )}
                {message && <p className="mt-3 text-center">{message}</p>}
              </div>
              <div className="text-center mt-3">
                Don't have an account?
                <Link to="/register"> Register here</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
