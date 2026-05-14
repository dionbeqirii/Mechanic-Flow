import React, { createContext, useContext, useState } from 'react';

const T = {
  sq: {
    dashboard: 'Dashboard', cars: 'Makinat', services: 'Serviset',
    staff: 'Stafi', settings: 'Cilësimet', logout: 'Çkyçu',
    welcome: 'Mirëseerdhe', subtitle: 'Menaxhimi i garazhit në kohë reale.',
    total: 'Gjithsej', inService: 'Në Servis', completed: 'Përfunduara', staffCount: 'Stafi',
    recentCars: 'Makinat e fundit në proces', registerCar: 'Regjistro Makinë',
    owner: 'Pronari', model: 'Modeli', year: 'Viti', plate: 'Targa',
    status: 'Statusi', actions: 'Veprime', noData: 'Nuk ka të dhëna',
    addCar: 'Shto Makinë', fillCarData: 'Plotësoni të dhënat e mjetit',
    ownerLabel: 'Emri i Pronarit', modelLabel: 'Modeli i Makinës',
    yearLabel: 'Viti i Prodhimit', plateLabel: 'Targa (License Plate)',
    confirmReg: 'Konfirmo Regjistrimin',
    carSaved: 'Makina u regjistrua me sukses!', carDeleted: 'Makina u fshi nga sistemi',
    statusChanged: 'Statusi u ndryshua',
    serviceManagement: 'Menaxhimi i Shërbimeve', addService: 'Shto Shërbim',
    serviceName: 'Emri i Shërbimit', carPlate: 'Targa e Makinës',
    price: 'Çmimi (€)', mechanic: 'Mekanik', description: 'Përshkrim', date: 'Data',
    serviceStatus: 'Statusi', Hapur: 'Hapur', 'Ne Proces': 'Në Proces', Mbyllur: 'Mbyllur',
    serviceSaved: 'Shërbimi u shtua me sukses!', serviceDeleted: 'Shërbimi u fshi',
    staffManagement: 'Menaxhimi i Stafit', name: 'Emri', email: 'Email',
    role: 'Roli', joinDate: 'Data e Regjistrimit', mechRole: 'Mekanik',
    profileSettings: 'Cilësimet e Profilit', saveChanges: 'Ruaj Ndryshimet',
    langSettings: 'Gjuha e Aplikacionit', albanian: 'Shqip', english: 'English',
    fullName: 'Emri i Plotë', emailAddress: 'Adresa Email', profileSaved: 'Profili u ruajt!',
    carManagement: 'Menaxhimi i Makinave', fillServiceData: 'Plotësoni të dhënat e shërbimit',
    confirmService: 'Konfirmo Shërbimin', total2: 'TOTAL',
  },
  en: {
    dashboard: 'Dashboard', cars: 'Cars', services: 'Services',
    staff: 'Staff', settings: 'Settings', logout: 'Logout',
    welcome: 'Welcome', subtitle: 'Real-time garage management.',
    total: 'Total', inService: 'In Service', completed: 'Completed', staffCount: 'Staff',
    recentCars: 'Recently active cars', registerCar: 'Register Car',
    owner: 'Owner', model: 'Model', year: 'Year', plate: 'Plate',
    status: 'Status', actions: 'Actions', noData: 'No data available',
    addCar: 'Add Car', fillCarData: 'Fill in the vehicle details',
    ownerLabel: 'Owner Name', modelLabel: 'Car Model',
    yearLabel: 'Year of Manufacture', plateLabel: 'License Plate',
    confirmReg: 'Confirm Registration',
    carSaved: 'Car registered successfully!', carDeleted: 'Car removed from system',
    statusChanged: 'Status updated',
    serviceManagement: 'Service Management', addService: 'Add Service',
    serviceName: 'Service Name', carPlate: 'Car Plate',
    price: 'Price (€)', mechanic: 'Mechanic', description: 'Description', date: 'Date',
    serviceStatus: 'Status', Hapur: 'Open', 'Ne Proces': 'In Progress', Mbyllur: 'Closed',
    serviceSaved: 'Service added successfully!', serviceDeleted: 'Service deleted',
    staffManagement: 'Staff Management', name: 'Name', email: 'Email',
    role: 'Role', joinDate: 'Registration Date', mechRole: 'Mechanic',
    profileSettings: 'Profile Settings', saveChanges: 'Save Changes',
    langSettings: 'Application Language', albanian: 'Albanian', english: 'English',
    fullName: 'Full Name', emailAddress: 'Email Address', profileSaved: 'Profile saved!',
    carManagement: 'Car Management', fillServiceData: 'Fill in the service details',
    confirmService: 'Confirm Service', total2: 'TOTAL',
  }
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('lang') || 'sq');

  const setLang = (l) => {
    setLangState(l);
    localStorage.setItem('lang', l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: T[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
