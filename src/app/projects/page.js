"use client";
import { useEffect, useState } from 'react';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Data fetch karne ka function
  const fetchProjects = () => {
    fetch('/api/projects') 
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Naya Project Add karne ka function
  const addProject = async () => {
    const name = prompt("Project ka naam likho:");
    if (!name) return;

    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, status: 'In Progress' })
    });

    if (res.ok) {
      alert("Project Save Ho Gaya!");
      fetchProjects(); // List refresh karne ke liye
    } else {
      alert("Error: Save nahi hua");
    }
  };

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', backgroundColor: 'white', padding: '20px 30px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h1 style={{ fontSize: '26px', margin: 0, color: '#1a202c' }}>Project Dashboard</h1>
          {/* Button par onClick function add kar diya */}
          <button 
            onClick={addProject}
            style={{ backgroundColor: '#3182ce', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            + Add New Project
          </button>
        </header>

        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
            {projects.map((p) => (
              <div key={p.id} style={{ backgroundColor: 'white', borderRadius: '18px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', borderLeft: `6px solid ${p.status === 'Completed' ? '#48bb78' : '#ed8936'}` }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>{p.name}</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#a0aec0' }}>Status: {p.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}