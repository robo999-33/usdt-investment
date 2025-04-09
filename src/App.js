import React, { useState } from "react";
import { connectWallet } from "./walletConnect";
import "./App.css";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleConnectWallet = async () => {
    const address = await connectWallet();
    if (address) {
      setWalletAddress(address);
    }
  };

  const handleInvest = async () => {
    if (!walletAddress || !investmentAmount) {
      alert("Connect wallet and enter amount.");
      return;
    }

    // Simulate USDT investment process
    alert(`User wants to invest ${investmentAmount} USDT`);
  };

  const handleWithdraw = async () => {
    if (!walletAddress || !withdrawAmount) {
      alert("Connect wallet and enter amount.");
      return;
    }

    // Simulate withdrawal process
    alert(`User requested to withdraw ${withdrawAmount} USDT`);
  };

  return (
    <div className="App" style={{ padding: "30px", textAlign: "center" }}>
      <h1 style={{ color: "green" }}>4% Daily Return</h1>

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
        <button onClick={handleInvest} style={{ padding: "10px 20px" }}>
          Invest
        </button>
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
        <button onClick={handleWithdraw} style={{ padding: "10px 20px" }}>
          Withdraw
        </button>
      </div>
    </div>
  );
}

export default App;