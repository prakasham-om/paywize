import { useState } from 'react';
import axios from 'axios';

export default function TransactionForm({ userId }) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('deposit');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/transactions', {
        userId,
        type,
        amount: parseFloat(amount),
      });
      alert('Transaction successful');
      setAmount('');
    } catch (err) {
      alert(err.response?.data?.error || 'Transaction failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-4">
      <h2 className="font-semibold text-lg">Make Transaction</h2>
      <select className="w-full p-2 border rounded" value={type} onChange={e => setType(e.target.value)}>
        <option value="deposit">Deposit</option>
        <option value="withdrawal">Withdrawal</option>
      </select>
      <input className="w-full border p-2 rounded" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" />
      <button className="bg-purple-600 text-white px-4 py-2 rounded w-full">Submit</button>
    </form>
  );
}
