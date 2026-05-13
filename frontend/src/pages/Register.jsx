import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

export default function Register() {
  // Ruajmë të dhënat që shtyp përdoruesi
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [mesazhi, setMesazhi] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Na ndihmon të ndërrojmë faqe automatikisht

  // Funksioni që dërgon të dhënat në Backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ndalon faqen të bëjë refresh
    setError(''); setMesazhi('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMesazhi('Llogaria u krijua! Po kalojmë te Login...');
        // Pas 2 sekondash, e dërgojmë te faqja e Login
        setTimeout(() => navigate('/'), 2000); 
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
            <UserPlus className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-wide">Krijo Llogari</h1>
        </div>

        {/* Mesazhet e suksesit apo errorit */}
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-center">{error}</div>}
        {mesazhi && <div className="bg-green-500/10 border border-green-500 text-green-500 p-3 rounded mb-4 text-center">{mesazhi}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-300 mb-2 text-sm">Emri i Plotë</label>
            <input 
              type="text" required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 text-sm">Emaili</label>
            <input 
              type="email" required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 text-sm">Fjalëkalimi</label>
            <input 
              type="password" required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg mt-4">
            Regjistrohu
          </button>
        </form>

        <p className="mt-6 text-center text-slate-400 text-sm">
          Keni tashmë një llogari? <Link to="/" className="text-blue-400 hover:text-blue-300">Kyçu këtu</Link>
        </p>
      </div>
    </div>
  );
}