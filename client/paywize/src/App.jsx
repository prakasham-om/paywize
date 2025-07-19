import React, { useState } from 'react';
import CreateUser from './components/CreateUser';
import Login from './components/Login';
import TransactionForm from './components/TransactionForm';
import DailySummary from './components/DailySummery';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-4">
        <h1 className="text-2xl font-bold text-center">Transaction App</h1>

        {!user ? (
          <>
            <CreateUser />
            <Login onLogin={setUser} />
          </>
        ) : (
          <>
            <p className="text-center">Welcome, {user.name}</p>
            <TransactionForm userId={user._id} />
            <DailySummary userId={user._id} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
