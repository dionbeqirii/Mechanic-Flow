import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wrench } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // RUHET TOKENI DHE TË DHËNAT NË SHFLETUES (LOKAL)
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Dërgoje në Dashboard pas kyçjes
        navigate('/dashboard'); 
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Gabim në lidhje me serverin!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
        
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-600 p-3 rounded-full mb-3">
            <Wrench className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-wide">MechanicFlow</h1>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-300 mb-2 text-sm">Emaili</label>
            <input 
              type="email" required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 text-sm">Fjalëkalimi</label>
            <input 
              type="password" required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg">
            Kyçu
          </button>
        </form>

        <p className="mt-6 text-center text-slate-400 text-sm">
          Nuk keni llogari? <Link to="/register" className="text-blue-400 hover:text-blue-300">Regjistrohuni këtu</Link>
        </p>
      </div>
    </div>
  );
}