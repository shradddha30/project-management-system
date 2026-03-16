"use client";
import { useState, useEffect } from 'react';

export default function FinalWorkingApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  // MySQL se data fetch karna
  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (Array.isArray(data)) setProjects(data);
    } catch (e) { console.error("Fetch error", e); }
  };

  useEffect(() => { if (isLoggedIn) fetchProjects(); }, [isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.username === 'admin' && loginData.password === 'admin123') setIsLoggedIn(true);
    else alert("Galti! Use admin / admin123");
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        await fetchProjects();
        setShowModal(false);
        setFormData({ name: '', description: '' });
      }
    } finally { setLoading(false); }
  };

  if (!isLoggedIn) {
    return (
      <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontFamily:'sans-serif'}}>
        <div style={{background:'rgba(255,255,255,0.95)', padding:'50px', borderRadius:'30px', boxShadow:'0 25px 50px rgba(0,0,0,0.2)', width:'100%', maxWidth:'380px', textAlign:'center'}}>
          <h2 style={{fontSize:'32px', fontWeight:'800', marginBottom:'10px', color:'#2d3748'}}>Admin Login</h2>
          <p style={{color:'#718096', marginBottom:'30px'}}>Enter credentials to access DB</p>
          <form onSubmit={handleLogin} style={{display:'flex', flexDirection:'column', gap:'15px'}}>
            <input type="text" placeholder="Username" style={{padding:'15px', borderRadius:'12px', border:'1px solid #e2e8f0', fontSize:'16px', outline:'none'}} onChange={(e)=>setLoginData({...loginData, username:e.target.value})} required />
            <input type="password" placeholder="Password" style={{padding:'15px', borderRadius:'12px', border:'1px solid #e2e8f0', fontSize:'16px', outline:'none'}} onChange={(e)=>setLoginData({...loginData, password:e.target.value})} required />
            <button type="submit" style={{padding:'16px', borderRadius:'12px', border:'none', background:'#4c51bf', color:'#fff', fontWeight:'bold', fontSize:'16px', cursor:'pointer', transition:'0.3s'}}>Login to Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:'100vh', background:'#f7fafc', fontFamily:'sans-serif'}}>
      <nav style={{background:'#fff', padding:'20px 60px', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 2px 15px rgba(0,0,0,0.05)', position:'sticky', top:0, zIndex:100}}>
        <h1 style={{fontSize:'24px', fontWeight:'800', color:'#2d3748'}}>PROJECT<span style={{color:'#4c51bf'}}>CLOUD</span></h1>
        <div style={{display:'flex', gap:'20px'}}>
          <button onClick={()=>setShowModal(true)} style={{background:'#4c51bf', color:'#fff', border:'none', padding:'12px 25px', borderRadius:'12px', fontWeight:'bold', cursor:'pointer', boxShadow:'0 4px 14px rgba(76, 81, 191, 0.4)'}}>+ Create Project</button>
          <button onClick={()=>setIsLoggedIn(false)} style={{background:'none', border:'none', color:'#e53e3e', fontWeight:'bold', cursor:'pointer'}}>Logout</button>
        </div>
      </nav>

      <div style={{maxWidth:'1200px', margin:'50px auto', padding:'0 20px'}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))', gap:'30px'}}>
          {projects.length > 0 ? projects.map(p => (
            <div key={p.id} style={{background:'#fff', padding:'35px', borderRadius:'25px', boxShadow:'0 10px 25px rgba(0,0,0,0.03)', border:'1px solid #edf2f7', position:'relative'}}>
              <div style={{position:'absolute', top:'20px', right:'20px', background:'#ebf4ff', color:'#4c51bf', padding:'5px 12px', borderRadius:'10px', fontSize:'12px', fontWeight:'bold'}}>{p.status}</div>
              <h3 style={{fontSize:'22px', fontWeight:'700', margin:'0 0 15px 0', color:'#1a202c'}}>{p.name}</h3>
              <p style={{color:'#4a5568', fontSize:'15px', lineHeight:'1.7', marginBottom:'25px'}}>{p.description}</p>
              <div style={{borderTop:'1px solid #edf2f7', paddingTop:'20px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span style={{fontSize:'12px', color:'#a0aec0'}}>ID: #{p.id}</span>
                <button style={{color:'#e53e3e', background:'none', border:'none', cursor:'pointer', fontWeight:'bold', fontSize:'13px'}}>Archive</button>
              </div>
            </div>
          )) : <div style={{gridColumn:'1/-1', textAlign:'center', padding:'100px', color:'#a0aec0'}}>Database is empty. Add your first project!</div>}
        </div>
      </div>

      {showModal && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000}}>
          <div style={{background:'#fff', padding:'45px', borderRadius:'35px', width:'100%', maxWidth:'450px', boxShadow:'0 30px 60px rgba(0,0,0,0.2)'}}>
            <h2 style={{fontSize:'26px', marginBottom:'25px', color:'#2d3748'}}>New MySQL Project</h2>
            <form onSubmit={handleAdd} style={{display:'flex', flexDirection:'column', gap:'20px'}}>
              <input placeholder="Project Name" style={{padding:'18px', borderRadius:'15px', border:'1px solid #e2e8f0', background:'#f8fafc', outline:'none', fontSize:'16px'}} onChange={(e)=>setFormData({...formData, name:e.target.value})} required />
              <textarea placeholder="Description" style={{padding:'18px', borderRadius:'15px', border:'1px solid #e2e8f0', background:'#f8fafc', outline:'none', height:'120px', resize:'none', fontSize:'16px'}} onChange={(e)=>setFormData({...formData, description:e.target.value})} required />
              <div style={{display:'flex', gap:'15px', marginTop:'10px'}}>
                <button type="submit" disabled={loading} style={{flex:1, padding:'18px', borderRadius:'15px', border:'none', background:'#4c51bf', color:'#fff', fontWeight:'bold', cursor:'pointer'}}>{loading ? 'Saving...' : 'Save to Cloud'}</button>
                <button type="button" onClick={()=>setShowModal(false)} style={{flex:1, padding:'18px', borderRadius:'15px', border:'none', background:'#edf2f7', color:'#4a5568', fontWeight:'bold', cursor:'pointer'}}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
