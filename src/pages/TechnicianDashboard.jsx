import { useState, useEffect, useContext } from 'react';
import {
  Home, Zap, Briefcase, User, LogOut, Timer,
  MapPin, CheckCircle, BarChart2, Save, CheckCircle2,
  Mail, TrendingUp, Star, X
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AvatarCropper from '../components/profile/AvatarCropper';

// ─── MOCK requests (to be replaced with real-time later) ─────────────────
const MOCK_REQUESTS = [];

// ─── INICIO TAB ───────────────────────────────────────────────────────────
const InicioTab = ({ user, setTab, token }) => {
  const [stats, setStats] = useState({ radar: 0, ganados: 0, ganancias: 0 });

  useEffect(() => {
    fetch('http://localhost:5000/api/jobs', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        if (!Array.isArray(d)) return;
        const radar = d.filter(j => j.status === 'active').length;
        const ganados = d.filter(j => j.status !== 'active' && j.status !== 'cancelled').length;
        const ganancias = d.filter(j => j.status === 'completed' || j.status === 'assigned')
                           .reduce((acc, j) => acc + (parseFloat(j.proposed_price) || 0), 0);
        setStats({ radar, ganados, ganancias });
      })
      .catch(e => console.error(e));
  }, [token]);

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">¡Hola, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-gray-500 mt-1">Aquí tienes un resumen de tu actividad.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Ofertas en Radar', val: stats.radar.toString(), color: 'blue', icon: <Zap size={22} /> },
          { label: 'Trabajos Ganados', val: stats.ganados.toString(), color: 'green', icon: <CheckCircle size={22} /> },
          { label: 'Ganancias Potenciales', val: `$${stats.ganancias.toFixed(2)}`, color: 'purple', icon: <TrendingUp size={22} /> },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${s.color}-50 text-${s.color}-600`}>{s.icon}</div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{s.val}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <button onClick={() => setTab('radar')}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-6 text-left transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5">
          <Zap size={28} className="mb-3" fill="currentColor" />
          <div className="font-bold text-lg">Radar Flash</div>
          <div className="text-blue-200 text-sm mt-1">Ver solicitudes activas en tiempo real</div>
        </button>
        <button onClick={() => setTab('trabajos')}
          className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 rounded-2xl p-6 text-left transition-all hover:shadow-md hover:-translate-y-0.5">
          <Briefcase size={28} className="mb-3 text-blue-600" />
          <div className="font-bold text-lg">Mis Trabajos</div>
          <div className="text-gray-500 text-sm mt-1">Revisa y gestiona tus servicios activos</div>
        </button>
      </div>
    </div>
  );
};

// ─── RADAR FLASH TAB ──────────────────────────────────────────────────────
const RadarTab = ({ token }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState(null); // id del request
  const [techMessage, setTechMessage] = useState('');
  const [proposedPrice, setProposedPrice] = useState('');

  const fetchRequests = () => {
    fetch('http://localhost:5000/api/jobs', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setRequests(Array.isArray(d) ? d : []))
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, [token]);

  const sendBudget = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${id}/budget`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          proposed_price: parseFloat(proposedPrice),
          tech_message: techMessage
        })
      });
      if (!res.ok) throw new Error('Error al enviar el presupuesto');
      
      setRespondingTo(null);
      setTechMessage('');
      setProposedPrice('');
      fetchRequests();

      // Show toast
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl font-bold flex items-center gap-2 z-[9999] transform translate-y-0 opacity-100 transition-all';
      toast.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> ¡Presupuesto enviado al cliente!';
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
      }, 4000);
    } catch (e) {
      alert('Error enviando el presupuesto.');
    }
  };

  // Filtrar activos (y que no tengan precio propuesto nuestro todavía, o si la logica es que se le asigna a 'esperando_cliente')
  // Por ahora, solo mostramos los que no tienen precio (el técnico aún no ha respondido)
  const active = requests.filter(r => r.status === 'active' && r.proposed_price === null);

  const selectedReq = active.find(r => r.id === respondingTo);

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      {/* Modal Overlay */}
      {selectedReq && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-lg text-gray-800">Evaluación del Servicio</h2>
              <button onClick={() => setRespondingTo(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-bold text-gray-900">{selectedReq.service}</h3>
                <p className="text-sm text-gray-500 mb-2">Cliente: {selectedReq.client_name}</p>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 relative">
                  <div className="absolute -top-3 left-4 bg-gray-200 text-xs font-bold text-gray-600 px-2 py-0.5 rounded-full">Problema reportado</div>
                  <p className="text-sm text-gray-800 italic">"{selectedReq.description}"</p>
                </div>
              </div>
              
              <div className="space-y-4 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Análisis Detallado</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                    rows="3"
                    placeholder="Ej. Según lo que describes, parece que la bomba de agua está obstruida. El servicio incluye la limpieza y revisión..."
                    value={techMessage}
                    onChange={(e) => setTechMessage(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Costo Total del Trabajo ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500 font-medium">$</span>
                    <input 
                      type="number"
                      className="w-full border border-gray-300 rounded-xl p-3 pl-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                      placeholder="0.00"
                      value={proposedPrice}
                      onChange={(e) => setProposedPrice(e.target.value)}
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <button onClick={() => sendBudget(selectedReq.id)}
                    disabled={!techMessage || !proposedPrice}
                    className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg disabled:bg-blue-300 flex justify-center items-center gap-2">
                    Enviar Presupuesto al Cliente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="text-yellow-400" fill="currentColor" size={24} /> Radar Flash
          </h1>
          <p className="text-gray-500 text-sm mt-1">Solicitudes esperando tu evaluación</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full font-medium border border-green-200 text-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Activo
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Buscando radar...</div>
      ) : active.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <Timer size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="font-medium text-gray-600">No hay nuevas solicitudes directas.</p>
          <p className="text-sm text-gray-400 mt-1">Te notificaremos cuando un cliente envíe un problema.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {active.map(req => {
            return (
              <div key={req.id} className="rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md border-blue-100 bg-white">
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-500">#{req.id}</span>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Evaluación Pendiente</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">{req.service}</h3>
                    <p className="text-sm text-gray-500 mb-3">Cliente: {req.client_name} • {req.client_city || 'Sin ubicación'}</p>
                    
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 relative">
                      <div className="absolute -top-3 left-4 bg-gray-200 text-xs font-bold text-gray-600 px-2 py-0.5 rounded-full">Descripción del Problema</div>
                      <p className="text-sm text-gray-800 italic">"{req.description}"</p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-2">
                    <button onClick={() => setRespondingTo(req.id)}
                      className="py-2.5 rounded-xl font-bold text-sm text-white transition-colors shadow-lg bg-blue-600 hover:bg-blue-700 shadow-blue-500/25 px-8">
                      Evaluar y Enviar Presupuesto
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── TRABAJOS TAB ─────────────────────────────────────────────────────────
const TrabajosTab = ({ token }) => {
  const [jobs, setJobs] = useState([]);
  const [confirmFinish, setConfirmFinish] = useState(null);

  const fetchJobs = () => {
    fetch('http://localhost:5000/api/jobs', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setJobs(Array.isArray(d) ? d.filter(j => j.status !== 'active') : []));
  };

  useEffect(() => {
    fetchJobs();
  }, [token]);

  const finishJob = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: 'completed' })
      });
      if (res.ok) {
        fetchJobs(); // refresh
        setConfirmFinish(null);
      }
    } catch (e) {
      alert('Error al finalizar el trabajo');
    }
  };

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      {confirmFinish && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center transform animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-white shadow-sm">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="font-bold text-2xl text-gray-900 mb-2">¿Trabajo Terminado?</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Al confirmar, notificaremos al cliente que has completado el servicio y el trabajo pasará a tu historial.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmFinish(null)}
                className="flex-1 py-3.5 font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                Aún no
              </button>
              <button 
                onClick={() => finishJob(confirmFinish)}
                className="flex-1 py-3.5 font-bold text-white bg-green-500 hover:bg-green-600 rounded-xl transition-all shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-0.5">
                ¡Sí, finalizado!
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mis Trabajos Activos</h1>
      
      {jobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
          <Briefcase size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="font-medium text-gray-600">No tienes trabajos en curso.</p>
          <p className="text-sm text-gray-400 mt-1">Los trabajos que aceptes en Radar Flash aparecerán aquí.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => {
            const isCompleted = job.status === 'completed';
            return (
            <div key={job.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{job.service} - ${job.proposed_price || 0}</h3>
                  <p className="text-sm text-gray-500 mb-2">Cliente: {job.client_name}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold h-fit ${isCompleted ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                    {isCompleted ? 'Finalizado' : 'En Progreso'}
                  </span>
                  {!isCompleted && (
                    <button 
                      onClick={() => setConfirmFinish(job.id)}
                      className="text-xs font-bold bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                      <CheckCircle2 size={14} /> Terminar
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-700 text-sm mt-2">{job.description}</p>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── PERFIL TAB ───────────────────────────────────────────────────────────
const PerfilTab = ({ user, token, updateUser }) => {
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', bio: '', avatar: '', birth_date: '', gender: '', id_number: '' });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [cropImage, setCropImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/auth/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setForm({ 
        name: d.name || '', phone: d.phone || '', address: d.address || '', city: d.city || '', bio: d.bio || '',
        avatar: d.avatar || '', birth_date: d.birth_date ? d.birth_date.split('T')[0] : '', gender: d.gender || '', id_number: d.id_number || ''
      }))
      .catch(() => setForm(f => ({ ...f, name: user?.name || '' })))
      .finally(() => setFetching(false));
  }, [token, user]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Error al guardar');
      
      updateUser({ name: form.name, email: user?.email, avatar: form.avatar });
      setSaved(true);
      setIsEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Hubo un problema guardando tu perfil. Verifica los datos.');
    } finally { setLoading(false); }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCropImage(file);
      e.target.value = ''; // reset
    }
  };

  const handleSaveCrop = (base64) => {
    setForm(f => ({ ...f, avatar: base64 }));
    setCropImage(null);
  };

  const field = (label, key, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        disabled={!isEditing}
        className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-100 text-gray-500 border-transparent cursor-not-allowed' : 'bg-gray-50 border-gray-200'}`} />
    </div>
  );

  if (fetching) return <div className="p-8 text-gray-400 animate-pulse">Cargando perfil...</div>;

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      {cropImage && (
        <AvatarCropper
          image={cropImage}
          onSave={handleSaveCrop}
          onCancel={() => setCropImage(null)}
        />
      )}
      
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
      <p className="text-gray-500 text-sm mb-8">Tu perfil visible para los clientes en la plataforma.</p>

      <div className="flex items-center gap-5 mb-8 p-5 bg-blue-50 rounded-2xl border border-blue-100">
        <div 
          onClick={isEditing ? () => document.getElementById('avatar-upload').click() : undefined}
          className={`relative w-20 h-20 rounded-full flex-shrink-0 ${isEditing ? 'cursor-pointer group' : ''}`}
        >
          {form.avatar ? (
            <img src={form.avatar} alt="Avatar" className={`w-full h-full rounded-full object-cover shadow-sm border-4 border-white transition-all ${isEditing ? 'group-hover:brightness-75' : ''}`} />
          ) : (
            <div className={`w-full h-full rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-sm border-4 border-white transition-all ${isEditing ? 'group-hover:brightness-75' : ''}`}>
              {form.name ? form.name[0].toUpperCase() : '?'}
            </div>
          )}
          {isEditing && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-bold drop-shadow-md">Editar</span>
            </div>
          )}
          <input 
            type="file" 
            id="avatar-upload" 
            accept="image/*" 
            className="hidden" 
            onChange={handleAvatarChange} 
          />
        </div>
        <div className="flex-1">
          <div className="font-bold text-gray-900 text-lg">{form.name || 'Tu nombre'}</div>
          <div className="text-sm text-gray-500 flex items-center gap-1"><Mail size={13} /> {user?.email}</div>
          <div className="flex items-center gap-1 mt-1">
            {[1,2,3,4,5].map(i => <Star key={i} size={13} className="text-yellow-400" fill="currentColor" />)}
            <span className="text-xs text-gray-500 ml-1">5.0 (0 reseñas)</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {field('Nombre completo', 'name', 'text', 'Tu nombre completo')}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <div className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-400 text-sm">
              <Mail size={16} /> {user?.email}
            </div>
          </div>
          {field('Cédula / ID', 'id_number', 'text', 'V-12345678')}
          {field('Teléfono', 'phone', 'tel', '+58 412 000 0000')}
          {field('Fecha de Nacimiento', 'birth_date', 'date', '')}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
            <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-100 text-gray-500 border-transparent cursor-not-allowed' : 'bg-gray-50 border-gray-200'}`}>
              <option value="">Selecciona...</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
              <option value="other">Otro</option>
            </select>
          </div>
          {field('Ciudad donde trabajas', 'city', 'text', 'Caracas, Maracaibo...')}
          {field('Dirección completa', 'address', 'text', 'Av. Principal...')}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción / Especialidad</label>
          <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            rows={3} placeholder="Ej: Técnico especialista en lavadoras y neveras con 10 años de experiencia..."
            disabled={!isEditing}
            className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${!isEditing ? 'bg-gray-100 text-gray-500 border-transparent cursor-not-allowed' : 'bg-gray-50 border-gray-200'}`} />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading}
            className={`flex items-center gap-2 text-white font-bold py-3 px-6 rounded-xl transition-all ${isEditing ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-400' : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400'}`}>
            <Save size={18} /> {loading ? 'Procesando...' : isEditing ? 'Guardar cambios' : 'Editar Perfil'}
          </button>
          {isEditing && (
            <button type="button" onClick={() => setIsEditing(false)}
              className="py-3 px-6 font-bold text-gray-500 hover:text-gray-700 transition-colors">
              Cancelar
            </button>
          )}
          {saved && (
            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <CheckCircle2 size={16} /> ¡Guardado!
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

// ─── MAIN TECHNICIAN DASHBOARD ────────────────────────────────────────────
const TechnicianDashboard = () => {
  const { user, token, logout, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tab, setTab] = useState('inicio');

  const handleLogout = () => { logout(); navigate('/'); };

  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: <Home size={20} /> },
    { id: 'radar', label: 'Radar Flash', icon: <Zap size={20} /> },
    { id: 'trabajos', label: 'Mis Trabajos', icon: <Briefcase size={20} /> },
    { id: 'perfil', label: 'Mi Perfil', icon: <User size={20} /> },
  ];

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col flex-shrink-0 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.name?.[0]?.toUpperCase() || '?'
              )}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-gray-900 text-sm truncate">{user?.name}</div>
              <div className="text-xs text-gray-400 truncate">{user?.email}</div>
            </div>
          </div>
          {/* Active status badge */}
          <div className="mt-3 flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-medium border border-green-200 w-fit">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            Activo y recibiendo
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                tab === item.id ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={20} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        {tab === 'inicio' && <InicioTab user={user} setTab={setTab} token={token} />}
        {tab === 'radar' && <RadarTab token={token} />}
        {tab === 'trabajos' && <TrabajosTab token={token} />}
        {tab === 'perfil' && <PerfilTab user={user} token={token} updateUser={updateUser} />}
      </main>
    </div>
  );
};

export default TechnicianDashboard;
