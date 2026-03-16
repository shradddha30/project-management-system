"use client";
import { useState, useEffect } from 'react';

export default function AssignmentProject() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  useEffect(() => {
    const saved = localStorage.getItem('final_v3_data');
    if (saved) setProjects(JSON.parse(saved));
    else setProjects([{ id: 1, name: "Sample Dashboard", description: "Project Management System build for assignment.", status: "Completed" }]);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.username === 'admin' && loginData.password === 'admin123') setIsLoggedIn(true);
    else alert("Invalid Credentials!");
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const newP = { id: Date.now(), ...formData, status: "In Progress" };
    const updated = [newP, ...projects];
    setProjects(updated);
    localStorage.setItem('final_v3_data', JSON.stringify(updated));
    setShowModal(false);
    setFormData({ name: '', description: '' });
  };

  if (!isLoggedIn) {
    return (
      <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f0f2f5', fontFamily:'sans-serif'}}>
        <div style={{background:'white', padding:'40px', borderRadius:'15px', boxShadow:'0 8px 24px rgba(0,0,0,0.1)', width:'350px'}}>
          <h2 style={{textAlign:'center', marginBottom:'30px', color:'#1a73e8'}}>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="Username" style={{width:'100%', padding:'12px', marginBottom:'15px', borderRadius:'8px', border:'1px solid #ddd', boxSizing:'border-box'}} onChange={(e)=>setLoginData({...loginData, username:e.target.value})} required />
            <input type="password" placeholder="Password" style={{width:'100%', padding:'12px', marginBottom:'20px', borderRadius:'8px', border:'1px solid #ddd', boxSizing:'border-box'}} onChange={(e)=>setLoginData({...loginData, password:e.target.value})} required />
            <button type="submit" style={{width:'100%', padding:'12px', background:'#1a73e8', color:'white', border:'none', borderRadius:'8px', fontWeight:'bold', cursor:'pointer'}}>Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:'100vh', background:'#f8f9fa', padding:'30px', fontFamily:'sans-serif'}}>
      <div style={{maxWidth:'1100px', margin:'0 auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'white', padding:'20px 30px', borderRadius:'12px', boxShadow:'0 2px 4px rgba(0,0,0,0.05)'}}>
          <h1 style={{fontSize:'24px', margin:0}}>Project <span style={{color:'#1a73e8'}}>Dashboard</span></h1>
          <div style={{display:'flex', gap:'15px'}}>
            <button onClick={()=>setShowModal(true)} style={{background:'#1a73e8', color:'white', padding:'10px 20px', borderRadius:'8px', border:'none', fontWeight:'bold', cursor:'pointer'}}>+ Add Project</button>
            <button onClick={()=>setIsLoggedIn(false)} style={{background:'#dc3545', color:'white', padding:'10px 15px', borderRadius:'8px', border:'none', cursor:'pointer'}}>Logout</button>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'25px', marginTop:'40px'}}>
          {projects.map(p => (
            <div key={p.id} style={{background:'white', padding:'25px', borderRadius:'15px', borderLeft:'6px solid #1a73e8', boxShadow:'0 4px 12px rgba(0,0,0,0.05)'}}>
              <h3 style={{marginTop:0, fontSize:'20px', color:'#333'}}>{p.name}</h3>
              <p style={{color:'#666', fontSize:'14px', lineHeight:'1.5'}}>{p.description}</p>
              <span style={{background:'#e8f0fe', color:'#1a73e8', padding:'5px 12px', borderRadius:'15px', fontSize:'12px', fontWeight:'bold'}}>{p.status}</span>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', zIndex:1000}}>
          <div style={{background:'white', padding:'30px', borderRadius:'15px', width:'100%', maxWidth:'450px'}}>
            <h2 style={{marginTop:0, marginBottom:'20px'}}>Create New Project</h2>
            <form onSubmit={handleAdd}>
              <input placeholder="Project Name" style={{width:'100%', padding:'12px', marginBottom:'15px', borderRadius:'8px', border:'1px solid #ddd', boxSizing:'border-box'}} onChange={(e)=>setFormData({...formData, name:e.target.value})} required />
              <textarea placeholder="Description" style={{width:'100%', padding:'12px', marginBottom:'20px', borderRadius:'8px', border:'1px solid #ddd', height:'100px', boxSizing:'border-box'}} onChange={(e)=>setFormData({...formData, description:e.target.value})} required />
              <div style={{display:'flex', gap:'10px'}}>
                <button type="submit" style={{flex:1, padding:'12px', background:'#1a73e8', color:'white', borderRadius:'8px', border:'none', fontWeight:'bold'}}>Save</button>
                <button type="button" onClick={()=>setShowModal(false)} style={{flex:1, padding:'12px', background:'#eee', borderRadius:'8px', border:'none'}}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
