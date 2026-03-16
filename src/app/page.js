"use client";
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  // Projects load karne ka logic
  useEffect(() => {
    const saved = localStorage.getItem('assignment_projs');
    if (saved) {
      setProjects(JSON.parse(saved));
    } else {
      // Default sample projects agar kuch na ho
      const defaults = [
        { id: 1, name: "Database Integration", description: "Connecting Aiven Cloud MySQL.", status: "Completed" },
        { id: 2, name: "Dashboard UI", description: "Building responsive project grid.", status: "In Progress" }
      ];
      setProjects(defaults);
      localStorage.setItem('assignment_projs', JSON.stringify(defaults));
    }
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    const newProj = { 
      id: Date.now(), 
      ...formData, 
      status: "In Progress" 
    };
    
    const updated = [newProj, ...projects];
    setProjects(updated);
    localStorage.setItem('assignment_projs', JSON.stringify(updated));
    
    setShowModal(false);
    setFormData({ name: '', description: '' });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-black text-gray-900">Project <span className="text-blue-600">Pro</span></h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95"
        >
          + Add New Project
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map(p => (
          <div key={p.id} className="bg-white p-7 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-2xl transition-all border-t-8 border-t-blue-500">
            <h3 className="text-2xl font-extrabold text-gray-800 mb-3">{p.name}</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed h-12 overflow-hidden">{p.description}</p>
            <div className="flex items-center justify-between">
              <span className="bg-blue-50 text-blue-600 px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                {p.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white p-10 rounded-[48px] w-full max-w-md shadow-2xl border border-white">
            <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">New Project</h2>
            <form onSubmit={handleAdd} className="space-y-5">
              <input 
                className="w-full bg-gray-50 border-none p-5 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-lg" 
                placeholder="Project Name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
              <textarea 
                className="w-full bg-gray-50 border-none p-5 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none h-32 text-lg" 
                placeholder="Project Description" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200">SAVE</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-500 py-5 rounded-2xl font-black text-lg hover:bg-gray-200 transition">CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
