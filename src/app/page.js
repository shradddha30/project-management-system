"use client";
import { useEffect, useState } from 'react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState({ username: '', password: '' });

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) { console.error("Fetch error"); }
  };

  const handleAddProject = async () => {
    const name = prompt("Enter Project Name:");
    if (!name) return;
    const description = prompt("Enter Description:");
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    });
    if (res.ok) fetchProjects();
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
      fetchProjects();
    }
  };

  // --- YAHAN NAYA FUNCTION ADD KIYA HAI ---
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'In Progress' ? 'Completed' : 'In Progress';
    const res = await fetch('/api/projects', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus })
    });
    if (res.ok) fetchProjects();
  };
  // ---------------------------------------

  const handleLogin = (e) => {
    e.preventDefault();
    if (user.username === 'admin' && user.password === 'admin123') {
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
      fetchProjects();
    } else {
      alert("Invalid Credentials");
    }
  };

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      setIsLoggedIn(true);
      fetchProjects();
    }
  }, []);

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f1f5f9' }}>
        <form onSubmit={handleLogin} style={{ background: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
          <h2 style={{textAlign:'center'}}>Admin Login</h2>
          <input type="text" placeholder="Username" onChange={e => setUser({...user, username: e.target.value})} style={{display:'block', width:'100%', padding:'10px', margin:'10px 0', borderRadius:'5px', border:'1px solid #ddd'}} required />
          <input type="password" placeholder="Password" onChange={e => setUser({...user, password: e.target.value})} style={{display:'block', width:'100%', padding:'10px', margin:'10px 0', borderRadius:'5px', border:'1px solid #ddd'}} required />
          <button type="submit" style={{width:'100%', padding:'10px', background:'#3b82f6', color:'white', border:'none', borderRadius:'5px', cursor:'pointer'}}>Sign In</button>
        </form>
      </div>
    );
  }

  const filtered = projects.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{ padding: '30px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '25px', borderRadius: '20px', marginBottom: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <h1 style={{margin:0, fontSize: '28px'}}>Project <span style={{color:'#3b82f6'}}>Dashboard</span></h1>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={handleAddProject} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>+ Add New Project</button>
            <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
          </div>
        </header>

        <input type="text" placeholder="Search projects..." onChange={e => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '15px', marginBottom: '30px', borderRadius: '15px', border: '1px solid #e2e8f0', fontSize: '16px', outline: 'none' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
          {filtered.length > 0 ? filtered.map(p => (
            <div key={p.id} style={{ background: 'white', padding: '25px', borderRadius: '25px', boxShadow: '0 10px 15px rgba(0,0,0,0.03)', borderTop: `8px solid ${p.status === 'Completed' ? '#10b981' : '#3b82f6'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                 <span style={{ fontSize: '12px', color: '#94a3b8' }}>ID: #{p.id}</span>
                 <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '5px 12px', borderRadius: '20px', backgroundColor: p.status === 'Completed' ? '#dcfce7' : '#dbeafe', color: p.status === 'Completed' ? '#166534' : '#1e40af' }}>{p.status}</span>
              </div>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#1e293b' }}>{p.name}</h3>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px', minHeight: '40px' }}>{p.description || "No description provided."}</p>
              
              <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                {/* --- NAYA BUTTON YAHAN HAI --- */}
                <button 
                  onClick={() => toggleStatus(p.id, p.status)} 
                  style={{ flex: 1, padding: '8px', borderRadius: '10px', cursor: 'pointer', background: p.status === 'Completed' ? '#f1f5f9' : '#10b981', color: p.status === 'Completed' ? '#64748b' : 'white', border: 'none', fontWeight: 'bold' }}
                >
                  {p.status === 'Completed' ? 'Undo Complete' : '✓ Done'}
                </button>
                {/* --------------------------- */}

                <button onClick={() => handleDelete(p.id)} style={{ color: '#ef4444', border: '1px solid #fee2e2', background: 'white', padding: '8px', borderRadius: '10px', cursor: 'pointer', flex: 1, fontWeight: 'bold' }}>🗑 Delete</button>
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '50px' }}>
              <p style={{ color: '#94a3b8', fontSize: '18px' }}>No projects found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}