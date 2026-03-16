"use client";
import { useState, useEffect } from 'react';

export default function MySQLDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [projects, setProjects] = useState([]);
  const [dbStatus, setDbStatus] = useState("Checking...");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const fetchFromMySQL = async () => {
    try {
      setDbStatus("Syncing...");
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (res.ok) {
        setProjects(data);
        setDbStatus("Connected to Aiven MySQL ✅");
      } else {
        setDbStatus("DB Error: " + data.error);
      }
    } catch (e) {
      setDbStatus("Connection Failed ❌");
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchFromMySQL();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f0f2f5'}}>
        <div style={{background:'white', padding:'40px', borderRadius:'20px', boxShadow:'0 10px 25px rgba(0,0,0,0.1)', textAlign:'center', width:'350px'}}>
          <h2 style={{marginBottom:'20px'}}>Admin Login</h2>
          <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }}>
            <input type="text" placeholder="Username" style={{width:'100%', padding:'12px', marginBottom:'10px', borderRadius:'8px', border:'1px solid #ddd'}} required />
            <input type="password" placeholder="Password" style={{width:'100%', padding:'12px', marginBottom:'20px', borderRadius:'8px', border:'1px solid #ddd'}} required />
            <button type="submit" style={{width:'100%', padding:'12px', background:'#3b82f6', color:'white', border:'none', borderRadius:'8px', fontWeight:'bold', cursor:'pointer'}}>Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:'100vh', background:'#f9fafb', padding:'30px', fontFamily:'sans-serif'}}>
      <div style={{maxWidth:'1100px', margin:'0 auto'}}>
        <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'white', padding:'20px 30px', borderRadius:'15px', boxShadow:'0 2px 5px rgba(0,0,0,0.05)'}}>
          <div>
            <h1 style={{margin:0, fontSize:'24px'}}>Project <span style={{color:'#3b82f6'}}>Database</span></h1>
            <span style={{fontSize:'12px', color: dbStatus.includes('✅') ? 'green' : 'red'}}>{dbStatus}</span>
          </div>
          <button onClick={() => setShowModal(true)} style={{background:'#3b82f6', color:'white', padding:'10px 20px', borderRadius:'10px', border:'none', cursor:'pointer', fontWeight:'bold'}}>+ Add to MySQL</button>
        </header>

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'25px', marginTop:'40px'}}>
          {projects.map(p => (
            <div key={p.id} style={{background:'white', padding:'25px', borderRadius:'20px', boxShadow:'0 4px 10px rgba(0,0,0,0.03)', borderLeft:'5px solid #3b82f6'}}>
              <div style={{fontSize:'11px', color:'#9ca3af', marginBottom:'5px'}}>PROJECT ID: {p.id}</div>
              <h3 style={{margin:'0 0 10px 0', fontSize:'20px'}}>{p.name}</h3>
              <p style={{color:'#6b7280', fontSize:'14px', lineHeight:'1.5'}}>{p.description}</p>
              <div style={{marginTop:'15px', padding:'5px 10px', background:'#eff6ff', color:'#3b82f6', borderRadius:'5px', fontSize:'12px', display:'inline-block', fontWeight:'bold'}}>{p.status}</div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100}}>
          <div style={{background:'white', padding:'35px', borderRadius:'20px', width:'400px'}}>
            <h3>New Database Entry</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setDbStatus("Saving...");
              await fetch('/api/projects', { method: 'POST', body: JSON.stringify(formData) });
              setShowModal(false);
              fetchFromMySQL();
            }}>
              <input placeholder="Project Name" style={{width:'100%', padding:'12px', marginBottom:'15px', borderRadius:'8px', border:'1px solid #ddd'}} onChange={(e)=>setFormData({...formData, name:e.target.value})} required />
              <textarea placeholder="Description" style={{width:'100%', padding:'12px', marginBottom:'20px', borderRadius:'8px', border:'1px solid #ddd', height:'100px'}} onChange={(e)=>setFormData({...formData, description:e.target.value})} required />
              <button type="submit" style={{width:'100%', padding:'12px', background:'#3b82f6', color:'white', border:'none', borderRadius:'8px', fontWeight:'bold'}}>Save to Aiven Cloud</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
