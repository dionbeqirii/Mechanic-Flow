import React, { useState } from 'react';
import { Settings as SettingsIcon, Globe, User, CheckCircle2 } from 'lucide-react';
import Layout from '../components/Layout';
import Toast, { useToast } from '../components/Toast';
import { useLang } from '../context/LanguageContext';

export default function Settings() {
  const { t, lang, setLang } = useLang();
  const { toast, showToast, closeToast } = useToast();
  const stored = JSON.parse(localStorage.getItem('user') || '{}');
  const [name, setName] = useState(stored.name || '');

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: stored.id, name }),
      });
      if (res.ok) {
        const updated = await res.json();
        localStorage.setItem('user', JSON.stringify({ ...stored, name: updated.name }));
        showToast(t.profileSaved);
      } else {
        showToast('Gabim gjatë ruajtjes', 'error');
      }
    } catch {
      showToast('Gabim në server', 'error');
    }
  };

  return (
    <Layout>
      <Toast toast={toast} onClose={closeToast} />
      <div className="p-8 max-w-2xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <SettingsIcon size={30} className="text-blue-400" /> {t.settings}
          </h1>
        </header>

        {/* Language */}
        <section className="bg-slate-800 border border-slate-700 rounded-3xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-purple-500/10 p-2 rounded-xl">
              <Globe size={20} className="text-purple-400" />
            </div>
            <h2 className="text-lg font-bold text-white">{t.langSettings}</h2>
          </div>
          <div className="flex gap-3">
            {[
              { code: 'sq', label: t.albanian, flag: '🇦🇱' },
              { code: 'en', label: t.english,  flag: '🇬🇧' },
            ].map(({ code, label, flag }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold border transition-all ${
                  lang === code
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                <span className="text-lg">{flag}</span> {label}
                {lang === code && <CheckCircle2 size={16} className="ml-1" />}
              </button>
            ))}
          </div>
        </section>

        {/* Profile */}
        <section className="bg-slate-800 border border-slate-700 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-blue-500/10 p-2 rounded-xl">
              <User size={20} className="text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-white">{t.profileSettings}</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                {t.fullName}
              </label>
              <input
                type="text" required value={name} onChange={e => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                {t.emailAddress}
              </label>
              <input
                type="email" value={stored.email || ''} disabled
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-slate-500 cursor-not-allowed"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
            >
              {t.saveChanges}
            </button>
          </form>
        </section>
      </div>
    </Layout>
  );
}
