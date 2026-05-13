import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Car, Wrench, Users, LogOut, 
  Plus, X, CheckCircle2, AlertCircle 
} from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // State për njoftimin
  const [cars, setCars] = useState([]);
  const [newCar, setNewCar] = useState({ ownerName: '', carModel: '', licensePlate: '' });
  const navigate = useNavigate();

  // 1. Merr makinat nga Databaza
  const fetchCars = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/cars');
      const data = await res.json();
      setCars(data);
    } catch (err) {
      console.log("Gabim gjatë marrjes së makinave");
    }
  };

  useEffect(() => {
    const loggedUser = localStorage.getItem('user');
    if (!loggedUser) {
      navigate('/');
    } else {
      setUser(JSON.parse(loggedUser));
      fetchCars();
    }
  }, [navigate]);

  // 2. Ruaj makinën e re me Feedback Profesional
  const handleAddCar = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/cars/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCar)
      });
      
      if (res.ok) {
        setShowModal(false);
        setNewCar({ ownerName: '', carModel: '', licensePlate: '' });
        fetchCars(); // Rifresko tabelën
        
        // Shfaq njoftimin e suksesit
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000); // Zhduket pas 3 sekondash
      } else {
        const data = await res.json();
        alert(data.message || "Gabim gjatë ruajtjes");
      }
    } catch (err) {
      console.error("Gabim në server:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-500/30">
      
      {/* NJOFTIMI I SUKSESIT (TOAST) */}
      {showSuccess && (
        <div className="fixed top-6 right-6 z-[100] animate-in fade-in slide-in-from-right-8 duration-300">
          <div className="bg-slate-800 border-l-4 border-green-500 shadow-2xl rounded-r-xl p-4 flex items-center gap-4 min-w-[300px]">
            <div className="bg-green-500/20 p-2 rounded-full">
              <CheckCircle2 className="text-green-500" size={24} />
            </div>
            <div>
              <p className="font-bold text-white">U ruajt me sukses!</p>
              <p className="text-sm text-slate-400">Të dhënat u regjistruan në sistem.</p>
            </div>
            <button onClick={() => setShowSuccess(false)} className="ml-auto text-slate-500 hover:text-white">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col shadow-xl">
        <div className="p-6 flex items-center gap-3 border-b border-slate-700">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20">
            <Wrench size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            MechanicFlow
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
          <NavItem icon={<Car size={20}/>} label="Makinat" />
          <NavItem icon={<Wrench size={20}/>} label="Serviset" />
          <NavItem icon={<Users size={20}/>} label="Stafi" />
        </nav>
        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-200 group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="font-medium">Çkyçu</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">Mirëseerdhe, {user?.name}!</h1>
            <p className="text-slate-400 mt-1 italic">Menaxhimi i garazhit në kohë reale.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <Plus size={20} /> Regjistro Makinë
          </button>
        </header>

        {/* STATS CARDS - Dinamike */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard label="Makinat" val={cars.length} icon={Car} color="text-blue-400" bgColor="bg-blue-400/10" />
          <StatCard label="Në Servis" val="0" icon={Wrench} color="text-orange-400" bgColor="bg-orange-400/10" />
          <StatCard label="Përfunduara" val="0" icon={CheckCircle2} color="text-green-400" bgColor="bg-green-400/10" />
          <StatCard label="Stafi" val="1" icon={Users} color="text-purple-400" bgColor="bg-purple-400/10" />
        </div>

        {/* TABELA E MAKINAVE */}
        <div className="bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
            <h3 className="font-bold text-lg text-white">Makinat e fundit në proces</h3>
            <span className="text-xs text-slate-500 font-mono">TOTAL: {cars.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900/30 text-slate-500 text-xs uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-5">Pronari</th>
                  <th className="px-8 py-5">Modeli</th>
                  <th className="px-8 py-5">Targa</th>
                  <th className="px-8 py-5">Statusi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {cars.length > 0 ? cars.map((car) => (
                  <tr key={car._id} className="hover:bg-slate-700/20 transition-colors group">
                    <td className="px-8 py-5 font-semibold text-slate-200">{car.ownerName}</td>
                    <td className="px-8 py-5 text-slate-400">{car.carModel}</td>
                    <td className="px-8 py-5">
                      <span className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono text-blue-400">
                        {car.licensePlate}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-orange-500/10 text-orange-500 border border-orange-500/20 w-fit font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
                        {car.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center opacity-20">
                        <Car size={60} className="mb-4" />
                        <p className="text-xl font-medium">Nuk ka të dhëna</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL I REGJISTRIMIT */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[110] p-4 animate-in fade-in duration-200">
            <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-3xl shadow-2xl p-8 transform animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white">Shto Makinë</h2>
                  <p className="text-sm text-slate-400">Plotësoni të dhënat e mjetit</p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white p-2 hover:bg-slate-700 rounded-full transition-all">
                  <X size={24}/>
                </button>
              </div>
              
              <form onSubmit={handleAddCar} className="space-y-5">
                <FormInput label="Emri i Pronarit" value={newCar.ownerName} 
                  onChange={(e) => setNewCar({...newCar, ownerName: e.target.value})} placeholder="psh. Besart Ahmeti" />
                
                <FormInput label="Modeli i Makinës" value={newCar.carModel} 
                  onChange={(e) => setNewCar({...newCar, carModel: e.target.value})} placeholder="psh. BMW M5 2023" />
                
                <FormInput label="Targa (License Plate)" value={newCar.licensePlate} 
                  onChange={(e) => setNewCar({...newCar, licensePlate: e.target.value})} placeholder="01-123-AB" />

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-bold mt-4 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]">
                  Konfirmo Regjistrimin
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Komponentë ndihmës për Pastërti Kodi
function NavItem({ icon, label, active = false }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
      active ? 'bg-blue-600/10 text-blue-400 shadow-sm' : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
    }`}>
      {icon} <span>{label}</span>
    </button>
  );
}

function StatCard({ label, val, icon: Icon, color, bgColor }) {
  return (
    <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-sm hover:border-slate-600 transition-all group">
      <div className={`${bgColor} ${color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{label}</p>
      <h3 className="text-3xl font-black mt-1 text-white tabular-nums">{val}</h3>
    </div>
  );
}

function FormInput({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">{label}</label>
      <input 
        type="text" required 
        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all placeholder:text-slate-700" 
        value={value} 
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}