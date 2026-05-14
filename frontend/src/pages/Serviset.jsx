import React, { useEffect, useState } from 'react';
import { Plus, X, Trash2, Wrench, Download } from 'lucide-react';
import { generateInvoice } from '../utils/invoice';
import Layout from '../components/Layout';
import Toast, { useToast } from '../components/Toast';
import { useLang } from '../context/LanguageContext';

const SVC_STATUS = ['Hapur', 'Ne Proces', 'Mbyllur'];
const SVC_STYLE = {
  'Hapur':     { dot: 'bg-yellow-500',               badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  'Ne Proces': { dot: 'bg-blue-500 animate-pulse',   badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20'    },
  'Mbyllur':   { dot: 'bg-green-500',                badge: 'bg-green-500/10 text-green-400 border-green-500/20'  },
};

export default function Serviset() {
  const { t } = useLang();
  const { toast, showToast, closeToast } = useToast();
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ serviceName: '', carPlate: '', mechanic: '', price: '', description: '' });

  const fetchServices = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/services');
      setServices(await res.json());
    } catch { /* silent */ }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/services/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setShowModal(false);
        setForm({ serviceName: '', carPlate: '', mechanic: '', price: '', description: '' });
        fetchServices();
        showToast(t.serviceSaved);
      } else {
        showToast(data.message || 'Gabim', 'error');
      }
    } catch { showToast('Gabim në server', 'error'); }
  };

  const handleStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/services/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setServices(prev => prev.map(s => s._id === id ? { ...s, status } : s));
        showToast(`${t.statusChanged}: "${t[status] || status}"`);
      }
    } catch { showToast('Gabim', 'error'); }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setServices(prev => prev.filter(s => s._id !== id));
        showToast(t.serviceDeleted, 'info');
      }
    } catch { showToast('Gabim', 'error'); }
  };

  return (
    <Layout>
      <Toast toast={toast} onClose={closeToast} />
      <div className="p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">{t.serviceManagement}</h1>
            <p className="text-slate-400 mt-1">TOTAL: {services.length}</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <Plus size={20} /> {t.addService}
          </button>
        </header>

        <div className="bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900/40 text-slate-500 text-xs uppercase tracking-widest">
                <tr>
                  {[t.serviceName, t.carPlate, t.mechanic, t.price, t.date, t.status, t.actions].map(h => (
                    <th key={h} className="px-6 py-5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {services.length > 0 ? services.map(svc => {
                  const style = SVC_STYLE[svc.status] || SVC_STYLE['Hapur'];
                  return (
                    <tr key={svc._id} className="hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-200">{svc.serviceName}</td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono text-blue-400">
                          {svc.carPlate}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{svc.mechanic}</td>
                      <td className="px-6 py-4 text-slate-300 font-medium">€{svc.price}</td>
                      <td className="px-6 py-4 text-slate-500 text-sm">
                        {new Date(svc.createdAt).toLocaleDateString('sq-AL')}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-2 px-2 py-1 rounded-full border w-fit ${style.badge}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          <select
                            value={svc.status}
                            onChange={e => handleStatus(svc._id, e.target.value)}
                            className="bg-transparent text-xs font-medium outline-none cursor-pointer"
                          >
                            {SVC_STATUS.map(s => (
                              <option key={s} value={s} className="bg-slate-800 text-slate-100">{t[s] || s}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => generateInvoice(svc)}
                            className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                            title="Shkarko Faturën"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(svc._id)}
                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                            title="Fshi"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={7} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center opacity-20">
                        <Wrench size={60} className="mb-4" />
                        <p className="text-xl font-medium">{t.noData}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[110] p-4 animate-in fade-in duration-200">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">{t.addService}</h2>
                <p className="text-sm text-slate-400">{t.fillServiceData}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white p-2 hover:bg-slate-700 rounded-full transition-all">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <FI label={t.serviceName} value={form.serviceName} placeholder="psh. Ndërrimi i vajit"
                onChange={e => setForm({ ...form, serviceName: e.target.value })} />
              <FI label={t.carPlate} value={form.carPlate} placeholder="01-123-AB"
                onChange={e => setForm({ ...form, carPlate: e.target.value })} />
              <FI label={t.mechanic} value={form.mechanic} placeholder="psh. Arton Krasniqi"
                onChange={e => setForm({ ...form, mechanic: e.target.value })} />
              <FI label={t.price} value={form.price} placeholder="psh. 50" type="number"
                onChange={e => setForm({ ...form, price: e.target.value })} />
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">{t.description}</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Opsional..." rows={2}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all placeholder:text-slate-700 resize-none" />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]">
                {t.confirmService}
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

function FI({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">{label}</label>
      <input type={type} required value={value} onChange={onChange} placeholder={placeholder}
        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all placeholder:text-slate-700" />
    </div>
  );
}
