"use client";
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    // Pehle API se lo, agar fail ho toh local se lo
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        const localData = JSON.parse(localStorage.getItem('my_projs') || '[]');
        setProjects([...localData, ...data]);
      });
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const newProj = { id: Date.now(), ...formData, status: "In Progress" };
    
    // 1. Local storage mein turant save karo (taaki dikhne lage)
    const currentLocal = JSON.parse(localStorage.getItem('my_projs') || '[]');
    localStorage.setItem('my_projs', JSON.stringify([newProj, ...currentLocal]));
    
    // 2. State update karo
    setProjects([newProj, ...projects]);
    setShowModal(false);
    setFormData({ name: '', description: '' });
    
    // 3. API ko bhi bhej do (optional background work)
    fetch('/api/projects', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-gray-800 tracking-tight">PROJECT <span className="text-blue-600">DASHBOARD</span></h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all">+ Add Project</button>
      </div>

      <div className="max-w-4xl mx-auto grid gap-6">
        {projects.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{p.name}</h2>
              <p className="text-gray-500 mt-1">{p.description}</p>
            </div>
            <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-xs font-black uppercase">{p.status}</span>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-6 z-50">
          <div className="bg-white p-10 rounded-[40px] w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-black mb-6 text-center">New Project</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <input className="w-full bg-gray-100 border-none p-4 rounded-2xl" placeholder="Project Title" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              <textarea className="w-full bg-gray-100 border-none p-4 rounded-2xl h-32" placeholder="Description" onChange={(e) => setFormData({...formData, description: e.target.value})} required />
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold">CREATE</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold">CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
