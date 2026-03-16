"use client";
import { useState, useEffect } from 'react';

export default function PerfectDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  const fetchDB = async () => {
    const res = await fetch('/api/projects');
    const data = await res.json();
    if (Array.isArray(data)) setProjects(data);
  };

  useEffect(() => { if (isLoggedIn) fetchDB(); }, [isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.username === 'admin' && loginData.password === 'admin123') setIsLoggedIn(true);
    else alert("Invalid Login");
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/projects', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      setShowModal(false);
      setFormData({ name: '', description: '' });
      fetchDB();
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f3f4f6', fontFamily:'sans-serif'}}>
        <div style={{background:'white', padding:'40px', borderRadius:'20px', boxShadow:'0 10px 30px rgba(0,0,0,0.05)', width:'350px', textAlign:'center'}}>
          <h2 style={{fontSize:'24px', fontWeight:'bold', marginBottom:'25px'}}>Admin Login</h2>
          <form onSubmit={handleLogin} style={{display:'flex', flexDirection:'column', gap:'15px'}}>
            <input type="text" placeholder="Username" style={{padding:'12px', borderRadius:'10px', border:'1px solid #ddd'}} onChange={(e)=>setLoginData({...loginData, username:e.target.value})} />
            <input type="password" placeholder="Password" style={{padding:'12px', borderRadius:'10px', border:'1px solid #ddd'}} onChange={(e)=>setLoginData({...loginData, password:e.target.value})} />
            <button style={{padding:'12px', background:'#3b82f6', color:'white', borderRadius:'10px', border:'none', fontWeight:'bold', cursor:'pointer'}}>Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:'100vh', background:'#f9fafb', padding:'40px', fontFamily:'sans-serif'}}>
      <div style={{maxWidth:'1000px', margin:'0 auto'}}>
        <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'white', padding:'20px 40px', borderRadius:'20px', boxShadow:'0 2px 10px rgba(0,0,0,0.03)'}}>
          <h1 style={{fontSize:'28px', fontWeight:'bold'}}>Project <span style={{color:'#3b82f6'}}>Dashboard</span></h1>
          <div style={{display:'flex', gap:'15px'}}>
            <button onClick={()=>setShowModal(true)} style={{background:'#3b82f6', color:'white', padding:'10px 25px', borderRadius:'12px', border:'none', fontWeight:'bold', cursor:'pointer'}}>+ Add New Project</button>
            <button onClick={()=>setIsLoggedIn(false)} style={{color:'#ef4444', border:'none', background:'none', fontWeight:'bold', cursor:'pointer'}}>Logout</button>
          </div>
        </header>

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'30px', marginTop:'40px'}}>
          {projects.map(p => (
            <div key={p.id} style={{background:'white', padding:'30px', borderRadius:'25px', borderTop:'8px solid #3b82f6', boxShadow:'0 4px 15px rgba(0,0,0,0.05)'}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
                <span style={{color:'#9ca3af', fontSize:'12px'}}>ID: #{p.id}</span>
                <span style={{background:'#dbeafe', color:'#1e40af', padding:'4px 12px', borderRadius:'20px', fontSize:'11px', fontWeight:'bold'}}>{p.status}</span>
              </div>
              <h3 style={{fontSize:'22px', fontWeight:'bold', margin:'0 0 10px 0', color:'#111827'}}>{p.name}</h3>
              <p style={{color:'#6b7280', fontSize:'14px', lineHeight:'1.5', marginBottom:'25px'}}>{p.description}</p>
              <div style={{display:'flex', gap:'10px', borderTop:'1px solid #f3f4f6', paddingTop:'20px'}}>
                <button style={{flex:1, padding:'10px', borderRadius:'10px', border:'none', background:'#10b981', color:'white', fontWeight:'bold', cursor:'pointer'}}>✓ Done</button>
                <button style={{flex:1, padding:'10px', borderRadius:'10px', border:'1px solid #fee2e2', color:'#ef4444', background:'white', fontWeight:'bold', cursor:'pointer'}}>🗑 Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100}}>
          <div style={{background:'white', padding:'40px', borderRadius:'25px', width:'400px'}}>
            <h2 style={{marginTop:0}}>Add Project</h2>
            <form onSubmit={handleAdd} style={{display:'flex', flexDirection:'column', gap:'15px'}}>
              <input placeholder="Name" style={{padding:'12px', borderRadius:'10px', border:'1px solid #ddd'}} onChange={(e)=>setFormData({...formData, name:e.target.value})} required />
              <textarea placeholder="Description" style={{padding:'12px', borderRadius:'10px', border:'1px solid #ddd', height:'100px'}} onChange={(e)=>setFormData({...formData, description:e.target.value})} required />
              <button style={{padding:'12px', background:'#3b82f6', color:'white', borderRadius:'10px', border:'none', fontWeight:'bold'}}>Save to Database</button>
              <button type="button" onClick={()=>setShowModal(false)} style={{background:'none', border:'none', color:'#9ca3af'}}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
