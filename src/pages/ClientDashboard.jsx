import { useState, useEffect, useContext, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Home, PlusCircle, Briefcase, User, LogOut, MapPin,
  Phone, Mail, FileText, Save, CheckCircle2, AlertCircle,
  Clock, ShieldCheck, Star, BadgeCheck, Search
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import FlashBudgetModal from '../components/search/FlashBudgetModal';
import AvatarCropper from '../components/profile/AvatarCropper';

// ─── Map utilities ────────────────────────────────────────────────────────
const haversine = (la1, lo1, la2, lo2) => {
  const R = 6371, dLat = (la2 - la1) * Math.PI / 180, dLon = (lo2 - lo1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(la1 * Math.PI / 180) * Math.cos(la2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
const techIcon = (hi) => L.divIcon({
  className: '',
  html: `<div style="width:${hi ? 38 : 30}px;height:${hi ? 38 : 30}px;background:${hi ? '#1d4ed8' : '#3b82f6'};border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 3px 10px rgba(0,0,0,.3)"></div>`,
  iconSize: [hi ? 38 : 30, hi ? 38 : 30], iconAnchor: [hi ? 19 : 15, hi ? 38 : 30], popupAnchor: [0, -34]
});
const myIcon = L.divIcon({
  className: '',
  html: `<div style="width:18px;height:18px;background:#22c55e;border-radius:50%;border:3px solid white;box-shadow:0 0 0 5px rgba(34,197,94,.25)"></div>`,
  iconSize: [18, 18], iconAnchor: [9, 9]
});
const MapFly = ({ c, z }) => { const map = useMap(); useEffect(() => { if (c) map.flyTo(c, z, { duration: 1.3 }); }, [c, z, map]); return null; };

// ─── Location Autocomplete ────────────────────────────────────────────────
const LocationSearch = ({ onSelect }) => {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (q.length < 3) { setResults([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=10&countrycodes=ve&addressdetails=1`,
          { headers: { 'Accept-Language': 'es' } }
        );
        const data = await res.json();
        setResults(data);
        setOpen(true);
      } catch { /* ignore */ }
    }, 400);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const pick = (item) => {
    setQ(item.display_name.split(',')[0]);
    setOpen(false);
    onSelect({ lat: parseFloat(item.lat), lng: parseFloat(item.lon), label: item.display_name });
  };

  return (
    <div ref={ref} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Busca tu dirección en Venezuela..."
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>
      {open && results.length > 0 && (
        <ul className="absolute z-[9999] top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          {results.map((r, i) => (
            <li key={i} onClick={() => pick(r)}
              className="px-4 py-3 text-sm cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-0">
              <span className="font-medium text-gray-800">{r.display_name.split(',').slice(0, 2).join(',')}</span>
              <span className="block text-xs text-gray-400 truncate">{r.display_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ─── INICIO TAB ───────────────────────────────────────────────────────────
const InicioTab = ({ user, setTab, token }) => {
  const [stats, setStats] = useState({ activos: 0, completados: 0, enRevision: 0 });

  useEffect(() => {
    fetch('http://localhost:5000/api/jobs', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        if (!Array.isArray(d)) return;
        const activos = d.filter(j => j.status === 'assigned' || j.status === 'active').length;
        const completados = d.filter(j => j.status === 'completed').length;
        const enRevision = d.filter(j => j.status === 'pending_review').length; // Assuming this status might exist later
        setStats({ activos, completados, enRevision });
      })
      .catch(e => console.error(e));
  }, [token]);

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">¡Hola, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-gray-500 mt-1">Bienvenido a tu panel de control en FixIt.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Trabajos Activos', val: stats.activos.toString(), color: 'blue', icon: <Briefcase size={22} /> },
          { label: 'Completados', val: stats.completados.toString(), color: 'green', icon: <CheckCircle2 size={22} /> },
          { label: 'En Revisión', val: stats.enRevision.toString(), color: 'yellow', icon: <Clock size={22} /> },
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
        <button onClick={() => setTab('solicitud')}
          className="group bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-6 text-left transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5">
          <PlusCircle size={28} className="mb-3" />
          <div className="font-bold text-lg">Nueva Solicitud</div>
          <div className="text-blue-200 text-sm mt-1">Encuentra técnicos cerca de ti en el mapa</div>
        </button>
        <button onClick={() => setTab('trabajos')}
          className="group bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 rounded-2xl p-6 text-left transition-all hover:shadow-md hover:-translate-y-0.5">
          <Briefcase size={28} className="mb-3 text-blue-600" />
          <div className="font-bold text-lg">Mis Trabajos</div>
          <div className="text-gray-500 text-sm mt-1">Revisa el estado de tus solicitudes activas</div>
        </button>
      </div>
    </div>
  );
};

// ─── NUEVA SOLICITUD TAB (with real map) ──────────────────────────────────
const SolicitudTab = ({ token }) => {
  const [allTechs, setAllTechs] = useState([]);
  const [visibleTechs, setVisibleTechs] = useState([]);
  const [userLoc, setUserLoc] = useState(null);
  const [mapCenter, setMapCenter] = useState([8.0, -66.0]);
  const [mapZoom, setMapZoom] = useState(6);
  const [selectedTech, setSelectedTech] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/technicians')
      .then(r => r.json())
      .then(d => { setAllTechs(d); setVisibleTechs(d.filter(t => t.lat && t.lng)); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLocationSelect = ({ lat, lng }) => {
    setUserLoc({ lat, lng });
    setMapCenter([lat, lng]);
    setMapZoom(12);
    const nearby = allTechs
      .filter(t => t.lat && t.lng)
      .map(t => ({ ...t, distKm: haversine(lat, lng, t.lat, t.lng) }))
      .filter(t => t.distKm <= 50)
      .sort((a, b) => a.distKm - b.distKm)
      .map(t => ({ ...t, distance: `A ${t.distKm.toFixed(1)} km` }));
    setVisibleTechs(nearby);
  };

  return (
    <div className="flex h-full">
      {/* Left panel */}
      <div className="w-80 flex-shrink-0 flex flex-col border-r border-gray-100 bg-gray-50 overflow-hidden">
        <div className="p-4 bg-white border-b border-gray-100">
          <h2 className="font-bold text-gray-900 mb-3">Busca tu ubicación</h2>
          <LocationSearch onSelect={handleLocationSelect} />
          <p className="text-xs text-gray-400 mt-2">{visibleTechs.length} técnico(s) disponibles cerca</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {loading ? (
            <div className="text-center py-8 text-gray-400 text-sm animate-pulse">Cargando técnicos...</div>
          ) : visibleTechs.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <MapPin size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm font-medium text-gray-600">No hay técnicos en esta zona</p>
              <p className="text-xs mt-1">Prueba ampliando el área de búsqueda</p>
            </div>
          ) : (
            visibleTechs.map(t => (
              <div key={t.id}
                onClick={() => setSelectedTech(t)}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${selectedTech?.id === t.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 text-sm flex items-center gap-1 truncate">
                      {t.name} {t.verified && <BadgeCheck size={14} className="text-blue-500 flex-shrink-0" />}
                    </div>
                    <div className="text-xs text-gray-500">{t.city || 'Técnico'}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Star size={11} className="text-yellow-400" fill="currentColor" />
                    <span>{t.rating}</span>
                  </div>
                  {t.distance && <span className="text-xs text-blue-600 font-medium">{t.distance}</span>}
                </div>
                <button onClick={() => setSelectedTech(t)}
                  className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 rounded-lg font-semibold transition-colors">
                  Solicitar ⚡
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer center={[8.0, -66.0]} zoom={6} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapFly c={mapCenter} z={mapZoom} />
          {userLoc && (
            <Marker position={[userLoc.lat, userLoc.lng]} icon={myIcon}>
              <Popup><div className="text-sm font-semibold">📍 Tu ubicación</div></Popup>
            </Marker>
          )}
          {visibleTechs.map(t => t.lat && t.lng ? (
            <Marker key={t.id} position={[t.lat, t.lng]}
              icon={techIcon(selectedTech?.id === t.id)}
              eventHandlers={{ click: () => setSelectedTech(t) }}>
              <Popup>
                <div className="text-sm min-w-[160px]">
                  <div className="font-bold text-gray-900">{t.name}</div>
                  <div className="text-gray-500 text-xs">{t.city}</div>
                  {t.distance && <div className="text-blue-600 text-xs font-semibold mt-1">{t.distance}</div>}
                  <button onClick={() => setSelectedTech(t)}
                    className="mt-2 w-full bg-blue-600 text-white text-xs py-1.5 rounded-lg hover:bg-blue-700">
                    Solicitar ⚡
                  </button>
                </div>
              </Popup>
            </Marker>
          ) : null)}
        </MapContainer>
      </div>

      {selectedTech && <FlashBudgetModal tech={selectedTech} onClose={() => setSelectedTech(null)} />}
    </div>
  );
};

// ─── TRABAJOS TAB ─────────────────────────────────────────────────────────
const TrabajosTab = ({ token }) => {
  const [JOBS, setJOBS] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/jobs', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setJOBS(Array.isArray(d) ? d : []))
      .catch(() => setJOBS([]))
      .finally(() => setLoading(false));
  }, [token]);
  const badge = { active: 'bg-blue-50 text-blue-700', in_progress: 'bg-yellow-50 text-yellow-700', completed: 'bg-green-50 text-green-700' };

  return (
    <div className="p-8 w-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mis Trabajos</h1>

      {/* Escrow wallet */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center gap-2 mb-1 opacity-80">
          <ShieldCheck size={18} className="text-green-400" />
          <span className="text-sm font-medium">Fondo de Seguridad (Escrow)</span>
        </div>
        <p className="text-xs opacity-60 mb-4">Tu dinero está protegido hasta que confirmes el trabajo.</p>
        <div className="text-4xl font-bold font-mono mb-4">$120.00</div>
        <div className="flex gap-2">
          <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-bold transition-colors">
            Liberar Pago
          </button>
          <button className="px-4 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 rounded-lg text-sm transition-colors" title="Reportar problema">
            <AlertCircle size={18} />
          </button>
        </div>
      </div>

      {/* Jobs list */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Cargando trabajos...</div>
        ) : JOBS.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
            <Briefcase size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="font-medium text-gray-600">Aún no tienes trabajos activos.</p>
            <p className="text-sm text-gray-400 mt-1">Cuando solicites un servicio, aparecerá aquí.</p>
          </div>
        ) : (
          JOBS.map(job => (
            <div key={job.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs bg-gray-100 text-gray-500 font-bold px-2 py-1 rounded mb-2 inline-block">#{job.id}</span>
                  <h3 className="font-bold text-lg text-gray-900">{job.service} - ${job.proposed_price || 0}</h3>
                  <p className="text-sm text-gray-500">Técnico: {job.tech_name || 'Sin asignar'} • {new Date(job.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                  job.status === 'completed' ? 'bg-green-50 text-green-700' : 
                  job.status === 'assigned' ? 'bg-blue-50 text-blue-700' : 
                  'bg-yellow-50 text-yellow-700'
                }`}>
                  {job.status === 'completed' ? 'Finalizado' : 
                   job.status === 'assigned' ? 'Asignado' : 'Buscando Técnico'}
                </span>
              </div>
              <div className="flex items-center gap-0 relative">
                <div className="absolute left-0 top-3 w-full h-1 bg-gray-200 rounded-full"></div>
                <div className={`absolute left-0 top-3 h-1 bg-blue-500 rounded-full transition-all duration-500 ${
                  job.status === 'completed' ? 'w-full' : 
                  job.status === 'assigned' ? 'w-1/2' : 'w-0'
                }`}></div>
                {['Solicitado', 'Asignado', 'Finalizado'].map((step, i) => {
                  let isCompleted = false;
                  if (i === 0) isCompleted = true; // Always requested
                  if (i === 1 && (job.status === 'assigned' || job.status === 'completed')) isCompleted = true;
                  if (i === 2 && job.status === 'completed') isCompleted = true;

                  return (
                    <div key={step} className="flex-1 flex flex-col items-center relative z-10">
                      <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-500 ${isCompleted ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-white border-gray-300 text-gray-400'}`}>
                        {isCompleted ? '✓' : i + 1}
                      </div>
                      <span className={`text-xs mt-1.5 font-bold transition-colors ${isCompleted ? 'text-blue-700' : 'text-gray-400'}`}>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
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
    } finally {
      setLoading(false);
    }
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
      <p className="text-gray-500 text-sm mb-8">Actualiza tu información personal para que los técnicos puedan contactarte.</p>

      {/* Avatar area */}
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
          <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
            {user?.role === 'technician' ? '🔧 Técnico' : '🙋 Cliente'}
          </span>
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
          {field('Ciudad', 'city', 'text', 'Caracas, Maracaibo...')}
          {field('Dirección completa', 'address', 'text', 'Av. Principal, Urb...')}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción personal</label>
          <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            rows={3} placeholder="Cuéntanos un poco sobre ti..."
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
              <CheckCircle2 size={16} /> ¡Guardado correctamente!
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

// ─── MAIN CLIENT DASHBOARD ────────────────────────────────────────────────
const ClientDashboard = () => {
  const { user, token, logout, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tab, setTab] = useState('inicio');

  const handleLogout = () => { logout(); navigate('/'); };

  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: <Home size={20} /> },
    { id: 'solicitud', label: 'Nueva Solicitud', icon: <PlusCircle size={20} /> },
    { id: 'trabajos', label: 'Mis Trabajos', icon: <Briefcase size={20} /> },
    { id: 'perfil', label: 'Mi Perfil', icon: <User size={20} /> },
  ];

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col flex-shrink-0 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-gray-900 text-sm truncate">{user?.name}</div>
              <div className="text-xs text-gray-400 truncate">{user?.email}</div>
            </div>
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
        {tab === 'solicitud' && <SolicitudTab token={token} />}
        {tab === 'trabajos' && <TrabajosTab token={token} />}
        {tab === 'perfil' && <PerfilTab user={user} token={token} updateUser={updateUser} />}
      </main>
    </div>
  );
};

export default ClientDashboard;
