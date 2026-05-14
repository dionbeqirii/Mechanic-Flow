import React, { useEffect, useState } from 'react';
import { Plus, X, Trash2, Car, Search, History, Wrench, CheckCircle2, Clock } from 'lucide-react';
import Layout from '../components/Layout';
import Toast, { useToast } from '../components/Toast';
import { useLang } from '../context/LanguageContext';

const STATUS_LIST = ['Ne Pritje', 'Ne Servis', 'Perfunduar'];
const STATUS_STYLE = {
  'Ne Pritje':  { dot: 'bg-orange-500',              badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  'Ne Servis':  { dot: 'bg-blue-500 animate-pulse',  badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20'   },
  'Perfunduar': { dot: 'bg-green-500',               badge: 'bg-green-500/10 text-green-400 border-green-500/20'  },
};
const SVC_STYLE = {
  'Hapur':     'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Ne Proces': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Mbyllur':   'bg-green-500/10 text-green-400 border-green-500/20',
};

export default function Makinat() {
  const { t } = useLang();
  const { toast, showToast, closeToast } = useToast();
  const [cars, setCars] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCar, setNewCar] = useState({ ownerName: '', carModel: '', carYear: '', licensePlate: '' });

  // Search & Filter
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // History
  const [historyPlate, setHistoryPlate] = useState(null);
  const [carServices, setCarServices] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchCars = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/cars');
      setCars(await res.json());
    } catch { /* silent */ }
  };

  useEffect(() => { fetchCars(); }, []);

  const filtered = cars.filter(car => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      car.ownerName?.toLowerCase().includes(q) ||
      car.carModel?.toLowerCase().includes(q) ||
      car.licensePlate?.toLowerCase().includes(q);
    const matchStatus = !filterStatus || car.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openHistory = async (plate) => {
    setHistoryPlate(plate);
    setHistoryLoading(true);
    setCarServices([]);
    try {
      const res = await fetch(`http://localhost:5000/api/services?plate=${encodeURIComponent(plate)}`);
      setCarServices(await res.json());
    } catch { /* silent */ }
    finally { setHistoryLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/cars/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCar),
      });
      const data = await res.json();
      if (res.ok) {
        setShowModal(false);
        setNewCar({ ownerName: '', carModel: '', carYear: '', licensePlate: '' });
        fetchCars();
        showToast(t.carSaved);
      } else {
        showToast(data.message || 'Gabim', 'error');
      }
    } catch { showToast('Gabim në server', 'error'); }
  };

  const handleStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cars/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setCars(prev => prev.map(c => c._id === id ? { ...c, status } : c));
        showToast(`${t.statusChanged}: "${status}"`);
      }
    } catch { showToast('Gabim', 'error'); }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cars/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCars(prev => prev.filter(c => c._id !== id));
        showToast(t.carDeleted, 'info');
      }
    } catch { showToast('Gabim', 'error'); }
  };

  return (
    <Layout>
      <Toast toast={toast} onClose={closeToast} />
      <div className="p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">{t.carManagement}</h1>
            <p className="text-slate-400 mt-1">{t.total2}: {cars.length}</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <Plus size={20} /> {t.registerCar}
          </button>
        </header>

        {/* Search + Filter */}
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`${t.owner}, ${t.model}, ${t.plate}...`}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-300 focus:border-blue-500 outline-none transition-all cursor-pointer"
          >
            <option value="">{t.status}: Të gjitha</option>
            {STATUS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900/40 text-slate-500 text-xs uppercase tracking-widest">
                <tr>
                  {[t.owner, t.model, t.year, t.plate, t.status, t.actions].map(h => (
                    <th key={h} className="px-6 py-5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filtered.length > 0 ? filtered.map(car => {
                  const style = STATUS_STYLE[car.status] || STATUS_STYLE['Ne Pritje'];
                  return (
                    <tr key={car._id} className="hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-200">{car.ownerName}</td>
                      <td className="px-6 py-4 text-slate-400">{car.carModel}</td>
                      <td className="px-6 py-4 text-slate-400">{car.carYear}</td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono text-blue-400">
                          {car.licensePlate}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-2 px-2 py-1 rounded-full border w-fit ${style.badge}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          <select
                            value={car.status}
                            onChange={e => handleStatus(car._id, e.target.value)}
                            className="bg-transparent text-xs font-medium outline-none cursor-pointer"
                          >
                            {STATUS_LIST.map(s => (
                              <option key={s} value={s} className="bg-slate-800 text-slate-100">{s}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openHistory(car.licensePlate)}
                            className="p-2 text-slate-500 hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition-all"
                            title="Historiku"
                          >
                            <History size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(car._id)}
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
                    <td colSpan={6} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center opacity-20">
                        <Car size={60} className="mb-4" />
                        <p className="text-xl font-medium">{search || filterStatus ? 'Nuk ka rezultate' : t.noData}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ADD CAR MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[110] p-4 animate-in fade-in duration-200">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">{t.addCar}</h2>
                <p className="text-sm text-slate-400">{t.fillCarData}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white p-2 hover:bg-slate-700 rounded-full transition-all">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-5">
              <FI label={t.ownerLabel} value={newCar.ownerName} placeholder="psh. Besart Ahmeti"
                onChange={e => setNewCar({ ...newCar, ownerName: e.target.value })} />
              <FI label={t.modelLabel} value={newCar.carModel} placeholder="psh. BMW M5"
                onChange={e => setNewCar({ ...newCar, carModel: e.target.value })} />
              <FI label={t.yearLabel} value={newCar.carYear} placeholder="psh. 2023" type="number"
                onChange={e => setNewCar({ ...newCar, carYear: e.target.value })} />
              <FI label={t.plateLabel} value={newCar.licensePlate} placeholder="01-123-AB"
                onChange={e => setNewCar({ ...newCar, licensePlate: e.target.value })} />
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]">
                {t.confirmReg}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* HISTORY MODAL */}
      {historyPlate && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[110] p-4 animate-in fade-in duration-200">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 max-h-[80vh] flex flex-col">
            {/* Modal header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/10 p-2 rounded-xl">
                  <History size={20} className="text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Historiku i Makinës</h2>
                  <span className="text-xs font-mono text-blue-400 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-md">
                    {historyPlate}
                  </span>
                </div>
              </div>
              <button onClick={() => setHistoryPlate(null)} className="text-slate-500 hover:text-white p-2 hover:bg-slate-700 rounded-full transition-all">
                <X size={22} />
              </button>
            </div>

            {/* Timeline */}
            <div className="overflow-y-auto p-6 flex-1">
              {historyLoading ? (
                <div className="text-center py-12 text-slate-500">Duke ngarkuar...</div>
              ) : carServices.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center opacity-30">
                  <Wrench size={48} className="mb-3" />
                  <p className="font-medium">Nuk ka shërbime të regjistruara</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500 font-mono mb-4">{carServices.length} shërbim(e) gjithsej</p>
                  {carServices.map((svc, i) => (
                    <div key={svc._id} className="flex gap-4">
                      {/* Timeline line */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${
                          svc.status === 'Mbyllur' ? 'bg-green-500/10 border-green-500 text-green-400' :
                          svc.status === 'Ne Proces' ? 'bg-blue-500/10 border-blue-500 text-blue-400' :
                          'bg-yellow-500/10 border-yellow-500 text-yellow-400'
                        }`}>
                          {svc.status === 'Mbyllur' ? <CheckCircle2 size={14} /> :
                           svc.status === 'Ne Proces' ? <Wrench size={14} /> :
                           <Clock size={14} />}
                        </div>
                        {i < carServices.length - 1 && (
                          <div className="w-0.5 flex-1 bg-slate-700 mt-2 mb-0 min-h-[16px]" />
                        )}
                      </div>
                      {/* Card */}
                      <div className="flex-1 bg-slate-900/60 border border-slate-700 rounded-2xl p-4 mb-2">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-semibold text-white">{svc.serviceName}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${SVC_STYLE[svc.status] || ''}`}>
                            {svc.status}
                          </span>
                        </div>
                        <div className="flex gap-4 text-xs text-slate-500">
                          <span>Mekanik: <span className="text-slate-300">{svc.mechanic}</span></span>
                          <span className="text-green-400 font-bold">€{svc.price}</span>
                        </div>
                        {svc.description && (
                          <p className="text-xs text-slate-500 mt-2 italic">"{svc.description}"</p>
                        )}
                        <p className="text-xs text-slate-600 mt-2">
                          {new Date(svc.createdAt).toLocaleDateString('sq-AL', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Total footer */}
            {carServices.length > 0 && (
              <div className="border-t border-slate-700 p-4 flex justify-between items-center">
                <span className="text-slate-500 text-sm">Total i shërbimeve</span>
                <span className="text-green-400 font-bold text-lg">
                  €{carServices.reduce((s, sv) => s + Number(sv.price || 0), 0)}
                </span>
              </div>
            )}
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
