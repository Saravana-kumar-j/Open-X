import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Constants from "./Utils/config";
import { ethers } from "ethers";
import { isMobile } from "react-device-detect";
import LoadingSpinner from "./LoadingSpinner"; // Import the LoadingSpinner component

function Tweet() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [allTweets, setAllTweets] = useState([]);
  const [userTweets, setUserTweets] = useState([]);
  const [message, setMessage] = useState("");
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [tweetDesc, setTweetDesc] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const [error, setError] = useState(""); // Added error state

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedAddress = localStorage.getItem("address");

    if (storedUserName && storedAddress) {
      setUserName(storedUserName);
      setUserAddress(storedAddress);
    } else {
      console.error("User information not found.");
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const initEthers = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
          Constants.contractADDRESS,
          Constants.contractAbi,
          provider.getSigner(),
        );
        setProvider(provider);
        setContract(contract);
      } else {
        console.error("Ethereum provider not found");
      }
    };
    initEthers();
  }, []);

  const handleAddTweet = async () => {
    if (!contract || !tweetDesc) {
      setMessage("Tweet description cannot be empty.");
      return;
    }

    setLoading(true); // Start loading
    setError(""); // Clear previous error

    try {
      const tx = await contract.addTweet(tweetDesc);
      await tx.wait(); // Wait for transaction to be mined
      setMessage("Tweet added successfully!");
      setTweetDesc(""); // Clear the input field
      await fetchAllTweets(); // Refresh the tweets
      setPopupOpen(false); // Close the popup only if there is no error
    } catch (error) {
      console.error("Error adding tweet:", error);
      // Check for specific MetaMask error code
      if (error.code === 4001) {
        setError(
          "Transaction rejected by user. Please approve the transaction in MetaMask.",
        );
      } else {
        setError("Failed to add tweet. Please try again.");
      }
      // Do not close the popup if there's an error
    } finally {
      setLoading(false); // Stop loading
      // Do not close the popup in the finally block to ensure it only closes when there is no error
    }
  };

  const fetchAllTweets = async () => {
    if (!contract) return;

    try {
      const tweets = await contract.getAllTweets();
      setAllTweets(tweets);
    } catch (error) {
      console.error("Error fetching tweets:", error);
    }
  };

  const fetchUserTweets = async () => {
    if (!contract || !userAddress) return;

    try {
      const tweets = await contract.getAllUserTweets(userAddress);
      setUserTweets(tweets);
    } catch (error) {
      console.error("Error fetching user tweets:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("address");
    navigate("/login");
  };

  const handlePublish = (e) => {
    e.preventDefault();
    handleAddTweet(); // Handle tweet addition
  };

  useEffect(() => {
    fetchAllTweets();
    fetchUserTweets();
  }, [contract, userAddress]);

  return (
    <div className="container-fluid p-3" style={{ overflow: "hidden" }}>
      <nav
        className="navbar navbar-expand-lg"
        style={{
          backgroundColor: "#2D3748",
          position: "fixed",
          top: "20px",
          left: "20px",
          right: "20px",
          borderRadius: "5px",
          zIndex: "50",
        }}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center px-4">
          <p className="navbar-brand fw-bold text-white mb-0">
            Welcome to OpenX, {userName}
          </p>
          <div className="d-flex gap-2">
            <button
              className="btn"
              style={{
                background: "linear-gradient(45deg, #4f9d8d, #2c6b5e)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: "14px",
                fontWeight: "bold",
                boxShadow: "0 3px 6px rgba(0, 0, 0, 0.2)",
                transition:
                  "background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(45deg, #3f8d7d, #1d5d4e)";
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 4px 8px rgba(0, 0, 0, 0.3)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(45deg, #4f9d8d, #2c6b5e)";
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 3px 6px rgba(0, 0, 0, 0.2)";
              }}
              onClick={() => setPopupOpen(true)}
            >
              Tweet
            </button>

            <button
              className="btn"
              style={{
                background: "linear-gradient(45deg, #ff6f61, #d84315)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: "14px",
                fontWeight: "bold",
                boxShadow: "0 3px 6px rgba(0, 0, 0, 0.2)",
                transition:
                  "background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(45deg, #ff8a65, #d84a38)";
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 4px 8px rgba(0, 0, 0, 0.3)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(45deg, #ff6f61, #d84315)";
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 3px 6px rgba(0, 0, 0, 0.2)";
              }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Tweet Pop-up */}
      {isPopupOpen && (
        <div
          className="position-fixed top-0 left-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: "1000",
          }}
        >
          <div
            className="bg-white p-4 rounded"
            style={{
              width: "90%",
              maxWidth: "500px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              position: "relative", // Added to position the 'X' mark
            }}
          >
            <button
              className="btn btn-secondary position-absolute"
              style={{
                top: "10px",
                right: "10px",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                padding: "0",
                color: "#000",
                backgroundColor: "#E2E8F0",
                border: "none",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => setPopupOpen(false)}
            >
              &times;
            </button>
            <h4 className="mb-3" style={{ color: "#2D3748" }}>
              Create a Tweet
            </h4>
            <form onSubmit={handlePublish}>
              <textarea
                className="form-control mb-3"
                placeholder="What's on your mind?"
                value={tweetDesc}
                onChange={(e) => setTweetDesc(e.target.value)}
                rows="4"
                required
                style={{
                  borderRadius: "5px",
                  borderColor: "#E2E8F0",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  resize: "none",
                }}
              />
              {error && (
                <div style={{ color: "red", marginBottom: "10px" }}>
                  {error}
                </div>
              )}
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
                      transition:
                        "background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background =
                        "linear-gradient(45deg, #ff8a65, #d84a38)";
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow =
                        "0 6px 12px rgba(0, 0, 0, 0.3)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background =
                        "linear-gradient(45deg, #ff6f61, #d84315)";
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 8px rgba(0, 0, 0, 0.2)";
                    }}
                  >
                    Publish
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tweet Lists */}
      <div className="container mt-5">
        <div className="row">
          <div
            className="col-md-4"
            style={{
              fontFamily: "Poppins, sans-serif",
              position: "relative",
              marginTop: isMobile ? "700px" : "0",
            }}
          >
            <h4
              style={{
                position: "sticky",
                top: 0,
                backgroundColor: "#f1f1f1",
                zIndex: 1,
                padding: "10px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              {userName}'s Tweets
            </h4>
            <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
              <ul className="list-group">
                {userTweets.map((tweet, index) => (
                  <li key={index} className="list-group-item">
                    <small>&gt; {userName}</small>
                    <p>{tweet.desc}</p>
                    <small>
                      {new Date(tweet.timestamp * 1000).toLocaleString()}
                    </small>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-md-1 d-flex justify-content-center">
            <div style={{ borderLeft: "2px solid #ccc", height: "100%" }}></div>
          </div>

          <div
            className="col-md-7"
            style={{ fontFamily: "Poppins, sans-serif", position: "relative" }}
          >
            <h4
              style={{
                position: "sticky",
                top: 0,
                backgroundColor: "#f1f1f1",
                zIndex: 1,
                padding: "10px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              All Tweets
            </h4>
            <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
              <ul className="list-group">
                {allTweets.map((tweet, index) => (
                  <li key={index} className="list-group-item">
                    <small>Posted by: {tweet.user}</small>
                    <p>{tweet.desc}</p>
                    <small>
                      {new Date(tweet.timestamp * 1000).toLocaleString()}
                    </small>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tweet;
