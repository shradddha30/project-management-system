"use client";
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  // Projects load karne ke liye
  useEffect(() => {
    fetch('/api/projects').then(res => res.json()).then(data => setProjects(data));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/projects', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    const newProj = await res.json();
    setProjects([...projects, newProj]);
    setShowModal(false);
    setFormData({ name: '', description: '' });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800">Project <span className="text-blue-600">Dashboard</span></h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
            <h3 className="text-xl font-bold mb-2">{p.name}</h3>
            <p className="text-gray-600 mb-4">{p.description}</p>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {p.status || 'In Progress'}
            </span>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create Project</h2>
            <form onSubmit={handleAdd}>
              <input 
                className="w-full border p-3 rounded-lg mb-4" 
                placeholder="Project Name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
              <textarea 
                className="w-full border p-3 rounded-lg mb-4" 
                placeholder="Description" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg">Save</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 py-3 rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
