"use client";
import { useState, useEffect } from 'react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  // 1. Data load karne ke liye
  useEffect(() => {
    const saved = localStorage.getItem('assignment_projs');
    if (saved) setProjects(JSON.parse(saved));
  }, []);

  // 2. Login Logic
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.username === 'admin' && loginData.password === 'admin123') {
      setIsLoggedIn(true);
    } else {
      alert("Invalid Credentials! Use admin / admin123");
    }
  };

  // 3. Add Project Logic
  const handleAdd = (e) => {
    e.preventDefault();
    const newProj = { id: Date.now(), ...formData, status: "In Progress" };
    const updated = [newProj, ...projects];
    setProjects(updated);
    localStorage.setItem('assignment_projs', JSON.stringify(updated));
    setShowModal(false);
    setFormData({ name: '', description: '' });
  };

  // --- LOGIN PAGE ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-black text-center mb-8 text-gray-800">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="text" placeholder="Username" 
              className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setLoginData({...loginData, username: e.target.value})}
              required 
            />
            <input 
              type="password" placeholder="Password" 
              className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              required 
            />
            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  // --- DASHBOARD PAGE ---
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10 bg-white p-6 rounded-3xl shadow-sm">
        <h1 className="text-3xl font-black text-gray-800">Project <span className="text-blue-600">Pro</span></h1>
        <div className="flex gap-4">
          <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold">+ Add Project</button>
          <button onClick={() => setIsLoggedIn(false)} className="text-red-500 font-bold">Logout</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map(p => (
          <div key={p.id} className="bg-white p-7 rounded-[32px] shadow-sm border-t-8 border-blue-500">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{p.name}</h3>
            <p className="text-gray-500 text-sm mb-6">{p.description}</p>
            <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-xs font-black uppercase">{p.status}</span>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-10 rounded-[40px] w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-center">New Project</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <input className="w-full bg-gray-50 p-4 rounded-xl" placeholder="Title" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              <textarea className="w-full bg-gray-100 p-4 rounded-xl h-32" placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold">SAVE</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 py-4 rounded-xl font-bold">CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
