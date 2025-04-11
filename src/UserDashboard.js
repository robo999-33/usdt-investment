import React, { useEffect, useState, useCallback } from 'react';
import { db, auth } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const UserDashboard = () => {
  const [investments, setInvestments] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const fetchUserInvestments = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'investments'), where('uid', '==', user.uid));
    const querySnapshot = await getDocs(q);

    let total = 0;
    const data = querySnapshot.docs.map(doc => {
      const item = doc.data();
      const investedDays = Math.floor((Date.now() - new Date(item.timestamp).getTime()) / (1000 * 60 * 60 * 24));
      const earnings = item.amount * 0.04 * investedDays;
      total += earnings;
      return { ...item, earnings };
    });

    setInvestments(data);
    setTotalEarnings(total);
  }, []);

  useEffect(() => {
    fetchUserInvestments();
  }, [fetchUserInvestments]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>User Dashboard</h2>
      <h3>Total Earnings: ${totalEarnings.toFixed(2)}</h3>
      <ul>
        {investments.map((inv, i) => (
          <li key={i}>
            Amount: ${inv.amount} | Earnings: ${inv.earnings.toFixed(2)} | Date: {new Date(inv.timestamp).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDashboard;