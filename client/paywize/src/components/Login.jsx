import { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', { email });
      onLogin(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-2 mt-4">
      <h2 className="font-semibold text-lg">Login</h2>
      <input className="w-full border p-2 rounded" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Login</button>
    </form>
  );
}
