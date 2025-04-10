import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { connectWallet } from "./walletConnect";

const InvestmentDashboard = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [userInvestments, setUserInvestments] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const fetchInvestments = async (userId) => {
    const q = query(collection(db, "investments"), where("userId", "==", userId));
    onSnapshot(q, (snapshot) => {
      const investments = snapshot.docs.map(doc => doc.data());
      setUserInvestments(investments);
    });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchInvestments(user.uid);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    let total = 0;
    userInvestments.forEach((inv) => {
      const days = Math.floor((Date.now() - inv.timestamp.toDate()) / (1000 * 60 * 60 * 24));
      total += inv.amount * 0.04 * days;
    });
    setTotalEarnings(total);
  }, [userInvestments]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleConnectWallet = async () => {
    const address = await connectWallet();
    setWalletAddress(address);
  };

  return (
    <div style={{ display: "flex", padding: "2rem" }}>
      <div style={{ flex: 1, background: "#f9f9f9", padding: "2rem", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
        <h2 style={{ color: "green" }}>Your Investments</h2>
        {userInvestments.length === 0 ? (
          <p>No investments yet.</p>
        ) : (
          <ul>
            {userInvestments.map((inv, i) => (
              <li key={i}>
                Amount: ${inv.amount} - Date: {inv.timestamp.toDate().toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
        <h3 style={{ marginTop: "2rem", color: "#444" }}>Total Earnings: ${totalEarnings.toFixed(2)}</h3>
      </div>

      <div style={{ marginLeft: "3rem", textAlign: "center" }}>
        <button onClick={handleConnectWallet} style={{ padding: "10px 20px", marginBottom: "1rem" }}>
          {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect Wallet"}
        </button>
        <br />
        <button onClick={handleLogout} style={{ padding: "10px 20px", backgroundColor: "red", color: "#fff" }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default InvestmentDashboard;