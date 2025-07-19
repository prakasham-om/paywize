import { useState } from 'react';
import axios from 'axios';

export default function CreateUser() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/create', { name, email });
      alert('User created!');
      setName('');
      setEmail('');
    } catch (err) {
      alert(err.response?.data?.error || 'Error creating user');
    }
  };

  return (
    <form onSubmit={handleCreate} className="space-y-2">
      <h2 className="font-semibold text-lg">Create User</h2>
      <input className="w-full border p-2 rounded" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <input className="w-full border p-2 rounded" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <button className="bg-green-600 text-white px-4 py-2 rounded w-full">Create</button>
    </form>
  );
}
