"use client";
import { useState, useEffect } from 'react';

export default function ProjectApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  // Load Data
  useEffect(() => {
    const saved = localStorage.getItem('my_final_projs');
    if (saved) setProjects(JSON.parse(saved));
    else setProjects([{ id: 1, name: "Sample Project", description: "Default task", status: "In Progress" }]);
  }, []);

  // Login Handle
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.username === 'admin' && loginData.password === 'admin123') {
      setIsLoggedIn(true);
    } else { alert("Wrong! Use admin / admin123"); }
  };

  // Add Project
  const handleAdd = (e) => {
    e.preventDefault();
    const newP = { id: Date.now(), ...formData, status: "In Progress" };
    const updated = [newP, ...projects];
    setProjects(updated);
    localStorage.setItem('my_final_projs', JSON.stringify(updated));
    setShowModal(false);
    setFormData({ name: '', description: '' });
  };

  // Delete Project
  const handleDelete = (id) => {
    const filtered = projects.filter(p => p.id !== id);
    setProjects(filtered);
    localStorage.setItem('my_final_projs', JSON.stringify(filtered));
  };

  if (!isLoggedIn) {
    return (
      <div style={{minHeight:'100-vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f3f4f6', padding:'20px'}}>
        <div style={{background:'white', padding:'40px', borderRadius:'20px', boxShadow:'0 10px 25px rgba(0,0,0,0.1)', width:'100%', maxWidth:'400px'}}>
          <h2 style={{textAlign:'center', fontWeight:'800', fontSize:'24px', marginBottom:'20px'}}>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="Username" style={{width:'100%', padding:'12px', marginBottom:'15px', borderRadius:'8px', border:'1px solid #ddd'}} onChange={(e)=>setLoginData({...loginData, username:e.target.value})} required />
            <input type="password" placeholder="Password" style={{width:'100%', padding:'12px', marginBottom:'20px', borderRadius:'8px', border:'1px solid #ddd'}} onChange={(e)=>setLoginData({...loginData, password:e.target.value})} required />
            <button type="submit" style={{width:'100%', padding:'12px', background:'#2563eb', color:'white', border:'none', borderRadius:'8px', fontWeight:'bold', cursor:'pointer'}}>Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{padding:'40px', background:'#f9fafb', minHeight:'100vh'}}>
      <div style={{maxWidth:'1000px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', background:'white', padding:'20px', borderRadius:'15px', boxShadow:'0 2px 10px rgba(0,0,0,0.05)'}}>
        <h1 style={{fontSize:'24px', fontWeight:'bold'}}>Project <span style={{color:'#2563eb'}}>Dashboard</span></h1>
        <div>
          <button onClick={()=>setShowModal(true)} style={{background:'#2563eb', color:'white', padding:'10px 20px', borderRadius:'8px', border:'none', fontWeight:'bold', marginRight:'10px', cursor:'pointer'}}>+ Add Project</button>
          <button onClick={()=>setIsLoggedIn(false)} style={{color:'#ef4444', border:'none', background:'none', cursor:'pointer', fontWeight:'bold'}}>Logout</button>
        </div>
      </div>

      <div style={{maxWidth:'1000px', margin:'30px auto', display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'20px'}}>
        {projects.map(p => (
          <div key={p.id} style={{background:'white', padding:'20px', borderRadius:'15px', borderLeft:'6px solid #2563eb', boxShadow:'0 4px 6px rgba(0,0,0,0.05)'}}>
            <h3 style={{margin:'0 0 10px 0', fontSize:'20px'}}>{p.name}</h3>
            <p style={{color:'#666', fontSize:'14px', marginBottom:'20px'}}>{p.description}</p>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <span style={{background:'#dbeafe', color:'#1e40af', padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'bold'}}>{p.status}</span>
              <button onClick={()=>handleDelete(p.id)} style={{color:'#ef4444', background:'none', border:'none', cursor:'pointer', fontSize:'12px'}}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px'}}>
          <div style={{background:'white', padding:'30px', borderRadius:'20px', width:'100%', maxWidth:'400px'}}>
            <h2 style={{marginTop:0}}>New Project</h2>
            <form onSubmit={handleAdd}>
              <input placeholder="Project Name" style={{width:'100%', padding:'12px', marginBottom:'10px', borderRadius:'8px', border:'1px solid #ddd'}} onChange={(e)=>setFormData({...formData, name:e.target.value})} required />
              <textarea placeholder="Description" style={{width:'100%', padding:'12px', marginBottom:'15px', borderRadius:'8px', border:'1px solid #ddd', height:'100px'}} onChange={(e)=>setFormData({...formData, description:e.target.value})} required />
              <div style={{display:'flex', gap:'10px'}}>
                <button type="submit" style={{flex:1, padding:'12px', background:'#2563eb', color:'white', borderRadius:'8px', border:'none', fontWeight:'bold'}}>Save</button>
                <button type="button" onClick={()=>setShowModal(false)} style={{flex:1, padding:'12px', background:'#eee', borderRadius:'8px', border:'none'}}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
