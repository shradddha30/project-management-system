"use client";
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Error fetching projects:", err));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const newProj = await res.json();
    setProjects([newProj, ...projects]);
    setShowModal(false);
    setFormData({ name: '', description: '' });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900">Project <span className="text-blue-600">Hub</span></h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
        >
          + Add New Project
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.length > 0 ? projects.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow border-t-4 border-t-blue-500">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{p.name}</h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">{p.description}</p>
            <div className="flex items-center justify-between">
              <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${p.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                {p.status}
              </span>
            </div>
          </div>
        )) : <p className="text-center col-span-full py-20 text-gray-400">Loading projects...</p>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Project</h2>
            <form onSubmit={handleAdd}>
              <div className="space-y-4">
                <input 
                  className="w-full border-gray-200 border p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="What is the project name?" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
                <textarea 
                  className="w-full border-gray-200 border p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-32" 
                  placeholder="Briefly describe the project goals..." 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="flex gap-4 mt-8">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition">Save Project</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-200 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
