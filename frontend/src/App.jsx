import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Login     from './pages/Login';
import Register  from './pages/Register';
import Dashboard from './pages/Dashboard';
import Makinat   from './pages/Makinat';
import Serviset  from './pages/Serviset';
import Stafi     from './pages/Stafi';
import Settings  from './pages/Settings';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/"          element={<Login />}     />
          <Route path="/register"  element={<Register />}  />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/makinat"   element={<Makinat />}   />
          <Route path="/serviset"  element={<Serviset />}  />
          <Route path="/stafi"     element={<Stafi />}     />
          <Route path="/settings"  element={<Settings />}  />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
