"use client";
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetch('/api/projects').then(res => res.json()).then(data => setProjects(data));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if(res.ok) {
      setShowModal(false);
      window.location.reload(); // Turant refresh taaki naya project dikhe!
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black text-blue-600">MY PROJECTS</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg">+ ADD PROJECT</button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-blue-500">
            <h2 className="text-2xl font-bold">{p.name}</h2>
            <p className="text-gray-600 my-4">{p.description}</p>
            <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-bold">{p.status}</span>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Enter Project Details</h2>
            <form onSubmit={handleAdd}>
              <input className="w-full border p-4 rounded-xl mb-4" placeholder="Project Name" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              <textarea className="w-full border p-4 rounded-xl mb-4" placeholder="Description" onChange={(e) => setFormData({...formData, description: e.target.value})} required />
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
