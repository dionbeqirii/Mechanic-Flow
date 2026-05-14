import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import Layout from '../components/Layout';
import { useLang } from '../context/LanguageContext';

export default function Stafi() {
  const { t } = useLang();
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/auth/staff')
      .then(r => r.json())
      .then(setStaff)
      .catch(() => {});
  }, []);

  return (
    <Layout>
      <div className="p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">{t.staffManagement}</h1>
          <p className="text-slate-400 mt-1">TOTAL: {staff.length}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.length > 0 ? staff.map(member => (
            <div key={member._id} className="bg-slate-800 border border-slate-700 rounded-3xl p-6 hover:border-slate-600 transition-all shadow-sm">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-xl font-bold shrink-0">
                  {member.name?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white text-lg leading-tight truncate">{member.name}</p>
                  <p className="text-slate-400 text-sm truncate">{member.email}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.role}</span>
                  <span className="text-blue-400 font-medium">{t.mechRole}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.joinDate}</span>
                  <span className="text-slate-300">
                    {new Date(member.createdAt).toLocaleDateString('sq-AL')}
                  </span>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-3 py-24 text-center">
              <div className="flex flex-col items-center opacity-20">
                <Users size={60} className="mb-4" />
                <p className="text-xl font-medium">{t.noData}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
