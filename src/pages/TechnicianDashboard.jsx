import { useState, useEffect } from 'react';
import { Timer, Zap, MapPin, CheckCircle } from 'lucide-react';

const MOCK_FLASH_REQUESTS = [
  {
    id: 'FLASH-099',
    client: 'Ana Pérez',
    service: 'Lavadora no centrifuga',
    distance: '1.5 km',
    expiresIn: 245, // seconds
    status: 'active' // 'active', 'won', 'lost'
  },
  {
    id: 'FLASH-098',
    client: 'Miguel Rojas',
    service: 'Instalación de Aire Acondicionado',
    distance: '3.2 km',
    expiresIn: 45, // seconds
    status: 'active'
  }
];

const TechnicianDashboard = () => {
  const [requests, setRequests] = useState(MOCK_FLASH_REQUESTS);

  // Simulate countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setRequests(prev => prev.map(req => {
        if (req.expiresIn > 0 && req.status === 'active') {
          return { ...req, expiresIn: req.expiresIn - 1 };
        } else if (req.expiresIn === 0 && req.status === 'active') {
          return { ...req, status: 'lost' };
        }
        return req;
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleBid = (id) => {
    // In a real app, send bid to backend
    alert(`Oferta enviada para la solicitud ${id}`);
    setRequests(prev => prev.filter(req => req.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel del Técnico</h1>
          <p className="text-gray-500">Tus oportunidades de trabajo en tiempo real</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full font-medium border border-green-200">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
          Activo y Recibiendo
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Flash Radar */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-brand-blue/20 p-6 relative overflow-hidden">
            {/* Background radar effect */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 border-[40px] border-blue-50 rounded-full opacity-50"></div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 relative z-10">
              <Zap className="text-yellow-400" fill="currentColor" /> Radar Flash
            </h2>
            
            <div className="space-y-4 relative z-10">
              {requests.filter(r => r.status === 'active').length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <Timer className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-gray-500 font-medium">Buscando solicitudes en tu zona...</p>
                </div>
              )}

              {requests.map(req => {
                if (req.status !== 'active') return null;
                const isUrgent = req.expiresIn <= 60;
                
                return (
                  <div key={req.id} className={`border ${isUrgent ? 'border-red-200 bg-red-50' : 'border-blue-100 bg-white'} rounded-xl p-5 shadow-sm transition-all hover:shadow-md flex flex-col sm:flex-row gap-4 items-center justify-between`}>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                          {req.id}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin size={12}/> {req.distance}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900">{req.service}</h3>
                      <p className="text-sm text-gray-600">Cliente: {req.client}</p>
                    </div>
                    
                    <div className="flex flex-col items-center sm:items-end gap-3 min-w-[140px]">
                      <div className={`text-2xl font-mono font-bold flex items-center gap-2 ${isUrgent ? 'text-red-600 animate-pulse' : 'text-brand-blue'}`}>
                        <Timer size={24} />
                        {formatTime(req.expiresIn)}
                      </div>
                      <button 
                        onClick={() => handleBid(req.id)}
                        className={`w-full py-2 rounded-lg font-bold text-sm text-white transition-colors shadow-lg ${isUrgent ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' : 'bg-brand-blue hover:bg-brand-blueDark shadow-blue-500/30'}`}
                      >
                        Ofertar Ahora
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Tu Rendimiento Hoy</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ofertas Enviadas</span>
                <span className="font-bold text-gray-900 text-lg">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Trabajos Ganados</span>
                <span className="font-bold text-green-600 text-lg">3</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-gray-600">Ganancias Estimadas</span>
                <span className="font-bold text-brand-blue text-xl">$145.00</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-bold text-green-900">Buen Trabajo</h4>
                <p className="text-sm text-green-800 mt-1">Tu tiempo de respuesta promedio hoy es de <strong>45 segundos</strong>. ¡Sigue así para ganar más subastas!</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TechnicianDashboard;
