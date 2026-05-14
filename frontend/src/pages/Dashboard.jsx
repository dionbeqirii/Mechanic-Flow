import React, { useEffect, useState } from 'react';
import { Car, Wrench, CheckCircle2, Users, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import Layout from '../components/Layout';
import { useLang } from '../context/LanguageContext';

const STATUS_STYLE = {
  'Ne Pritje':  { dot: 'bg-orange-500',             badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  'Ne Servis':  { dot: 'bg-blue-500 animate-pulse', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20'   },
  'Perfunduar': { dot: 'bg-green-500',              badge: 'bg-green-500/10 text-green-400 border-green-500/20'  },
};

const MONTHS_SQ = ['Jan','Shk','Mar','Pri','Maj','Qer','Kor','Gus','Sht','Tet','Nën','Dhj'];
const MONTHS_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const PIE_COLORS = { 'Ne Pritje': '#f97316', 'Ne Servis': '#3b82f6', 'Perfunduar': '#22c55e' };

function getMonthlyRevenue(services, lang) {
  const MONTHS = lang === 'sq' ? MONTHS_SQ : MONTHS_EN;
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const revenue = services
      .filter(s => {
        const sd = new Date(s.createdAt);
        return sd.getMonth() === d.getMonth() && sd.getFullYear() === d.getFullYear();
      })
      .reduce((sum, s) => sum + Number(s.price || 0), 0);
    return { name: MONTHS[d.getMonth()], revenue };
  });
}

const CustomBar = ({ x, y, width, height }) => (
  <rect x={x} y={y} width={width} height={height} fill="url(#barGrad)" rx={6} ry={6} />
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className="text-white font-bold text-sm">€{payload[0].value}</p>
    </div>
  );
};

export default function Dashboard() {
  const { t, lang } = useLang();
  const [cars, setCars] = useState([]);
  const [services, setServices] = useState([]);
  const [staffCount, setStaffCount] = useState(0);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetch('http://localhost:5000/api/cars').then(r => r.json()).then(setCars).catch(() => {});
    fetch('http://localhost:5000/api/services').then(r => r.json()).then(setServices).catch(() => {});
    fetch('http://localhost:5000/api/auth/staff').then(r => r.json()).then(d => setStaffCount(Array.isArray(d) ? d.length : 0)).catch(() => {});
  }, []);

  const stats = {
    total:      cars.length,
    neServis:   cars.filter(c => c.status === 'Ne Servis').length,
    perfunduar: cars.filter(c => c.status === 'Perfunduar').length,
    revenue:    services.reduce((s, sv) => s + Number(sv.price || 0), 0),
  };

  const monthlyData = getMonthlyRevenue(services, lang);

  const pieData = ['Ne Pritje', 'Ne Servis', 'Perfunduar']
    .map(s => ({ name: s, value: cars.filter(c => c.status === s).length }))
    .filter(d => d.value > 0);

  return (
    <Layout>
      <div className="p-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white">{t.welcome}, {user.name}!</h1>
          <p className="text-slate-400 mt-1 italic">{t.subtitle}</p>
        </header>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard label={t.total}      val={stats.total}      icon={Car}          color="text-blue-400"   bgColor="bg-blue-400/10"   />
          <StatCard label={t.inService}  val={stats.neServis}   icon={Wrench}       color="text-orange-400" bgColor="bg-orange-400/10" />
          <StatCard label={t.completed}  val={stats.perfunduar} icon={CheckCircle2} color="text-green-400"  bgColor="bg-green-400/10"  />
          <StatCard label={t.staffCount} val={staffCount}       icon={Users}        color="text-purple-400" bgColor="bg-purple-400/10" />
        </div>

        {/* CHARTS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Bar Chart — Monthly Revenue */}
          <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-white text-lg">Të Ardhurat Mujore</h3>
                <p className="text-slate-500 text-xs mt-0.5">6 muajt e fundit</p>
              </div>
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-xl">
                <TrendingUp size={14} className="text-green-400" />
                <span className="text-green-400 font-bold text-sm">€{stats.revenue}</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} barSize={32}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `€${v}`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,130,246,0.05)', radius: 6 }} />
                <Bar dataKey="revenue" shape={<CustomBar />} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart — Status Distribution */}
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl">
            <div className="mb-6">
              <h3 className="font-bold text-white text-lg">Statuset e Makinave</h3>
              <p className="text-slate-500 text-xs mt-0.5">Distribucioni aktual</p>
            </div>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={pieData} cx="50%" cy="50%"
                      innerRadius={52} outerRadius={78}
                      paddingAngle={3} dataKey="value"
                    >
                      {pieData.map(entry => (
                        <Cell key={entry.name} fill={PIE_COLORS[entry.name]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                      itemStyle={{ color: '#e2e8f0' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {pieData.map(d => (
                    <div key={d.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[d.name] }} />
                        <span className="text-slate-400 text-xs">{d.name}</span>
                      </div>
                      <span className="text-white text-xs font-bold">{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 opacity-20">
                <Car size={40} className="mb-2" />
                <p className="text-sm">{t.noData}</p>
              </div>
            )}
          </div>
        </div>

        {/* RECENT CARS TABLE */}
        <div className="bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-700 flex justify-between items-center">
            <h3 className="font-bold text-lg text-white">{t.recentCars}</h3>
            <span className="text-xs text-slate-500 font-mono">TOTAL: {cars.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900/30 text-slate-500 text-xs uppercase tracking-widest">
                <tr>
                  {[t.owner, t.model, t.year, t.plate, t.status].map(h => (
                    <th key={h} className="px-6 py-5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {cars.slice(0, 6).map(car => {
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
                        <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs border w-fit font-medium ${style.badge}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          {car.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {cars.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center opacity-20">
                        <Car size={60} className="mb-4" />
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
    </Layout>
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
