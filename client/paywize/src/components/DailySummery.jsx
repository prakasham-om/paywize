import { useEffect, useState } from 'react';
import axios from 'axios';

export default function DailySummary({ userId }) {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const load = async () => {
      const today = new Date().toISOString().split('T')[0];
      try {
        const res = await axios.get(`http://localhost:5000/api/transactions/daily/${userId}?date=${today}`);
        setSummary(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [userId]);

  if (!summary) return null;

  return (
    <div className="mt-6">
      <h2 className="font-semibold text-lg">Daily Summary ({summary.date})</h2>
      <div className="space-y-1 text-sm">
        <p>Opening Balance: ₹{summary.openingBalance}</p>
        <p>Closing Balance: ₹{summary.closingBalance}</p>
        <p>Total Deposits: ₹{summary.totalDeposits}</p>
        <p>Total Withdrawals: ₹{summary.totalWithdrawals}</p>
      </div>
      <div className="mt-2">
        <p className="font-medium">Transactions:</p>
        <ul className="text-sm list-disc ml-5">
          {summary.transactions.map(tx => (
            <li key={tx._id}>{tx.type.toUpperCase()} ₹{tx.amount} at {new Date(tx.date).toLocaleTimeString()}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
