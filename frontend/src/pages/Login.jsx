import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wrench, X, KeyRound, CheckCircle2 } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

const UI = {
  sq: {
    title: 'MechanicFlow',
    email: 'Emaili', password: 'Fjalëkalimi', login: 'Kyçu',
    noAccount: 'Nuk keni llogari?', register: 'Regjistrohuni këtu',
    forgot: 'Keni harruar fjalëkalimin?',
    forgotTitle: 'Rivendos Fjalëkalimin',
    forgotSub: 'Shkruani emailin tuaj dhe ne do të gjenerojmë një fjalëkalim të ri.',
    emailLabel: 'Adresa Email',
    send: 'Dërgo', cancel: 'Anulo',
    serverErr: 'Gabim në lidhje me serverin!',
    newPassMsg: 'Fjalëkalimi juaj i ri:',
    copyHint: 'Kopjojeni dhe kyçuni me të.',
  },
  en: {
    title: 'MechanicFlow',
    email: 'Email', password: 'Password', login: 'Login',
    noAccount: "Don't have an account?", register: 'Register here',
    forgot: 'Forgot your password?',
    forgotTitle: 'Reset Password',
    forgotSub: 'Enter your email and we will generate a new password for you.',
    emailLabel: 'Email Address',
    send: 'Send', cancel: 'Cancel',
    serverErr: 'Server connection error!',
    newPassMsg: 'Your new password:',
    copyHint: 'Copy it and login with it.',
  },
};

export default function Login() {
  const { lang, setLang } = useLang();
  const L = UI[lang];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotResult, setForgotResult] = useState(null);
  const [forgotLoading, setForgotLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.message);
      }
    } catch {
      setError(L.serverErr);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      setForgotResult(data);
    } catch {
      setForgotResult({ message: L.serverErr });
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgot = () => {
    setShowForgot(false);
    setForgotEmail('');
    setForgotResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">

      {/* LANGUAGE TOGGLE — top right */}
      <div className="fixed top-5 right-5 flex gap-2">
        {[
          { code: 'sq', flag: '🇦🇱', label: 'SQ' },
          { code: 'en', flag: '🇬🇧', label: 'EN' },
        ].map(({ code, flag, label }) => (
          <button
            key={code}
            onClick={() => setLang(code)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              lang === code
                ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            <span>{flag}</span> {label}
          </button>
        ))}
      </div>

      {/* LOGIN CARD */}
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-600 p-3 rounded-full mb-3 shadow-lg shadow-blue-600/30">
            <Wrench className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-wide">{L.title}</h1>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-xl mb-4 text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-400 mb-2 text-sm font-medium">{L.email}</label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-slate-400 text-sm font-medium">{L.password}</label>
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                {L.forgot}
              </button>
            </div>
            <input
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {L.login}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-500 text-sm">
          {L.noAccount}{' '}
          <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">{L.register}</Link>
        </p>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgot && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-sm rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 rounded-xl">
                  <KeyRound size={20} className="text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{L.forgotTitle}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{L.forgotSub}</p>
                </div>
              </div>
              <button onClick={closeForgot} className="text-slate-500 hover:text-white p-1.5 hover:bg-slate-700 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>

            {!forgotResult ? (
              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                    {L.emailLabel}
                  </label>
                  <input
                    type="email" required value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all placeholder:text-slate-700"
                  />
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={closeForgot}
                    className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-400 hover:bg-slate-700 font-medium transition-all">
                    {L.cancel}
                  </button>
                  <button type="submit" disabled={forgotLoading}
                    className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold transition-all disabled:opacity-60">
                    {forgotLoading ? '...' : L.send}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5">
                  <CheckCircle2 className="text-green-400 mx-auto mb-3" size={32} />
                  <p className="text-slate-300 text-sm mb-3">{L.newPassMsg}</p>
                  {forgotResult.tempPassword && (
                    <div className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 font-mono text-blue-400 text-lg font-bold tracking-widest select-all">
                      {forgotResult.tempPassword}
                    </div>
                  )}
                  <p className="text-slate-500 text-xs mt-3">{L.copyHint}</p>
                </div>
                <button onClick={closeForgot}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold transition-all">
                  OK
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
