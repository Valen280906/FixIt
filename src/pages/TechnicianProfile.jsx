import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, BadgeCheck, Clock, ShieldCheck, ChevronLeft, Calendar, Wrench } from 'lucide-react';
import FlashBudgetModal from '../components/search/FlashBudgetModal';

const MOCK_TECH_DETAILS = {
  id: '1',
  name: 'Carlos Rodríguez',
  avatar: 'https://i.pravatar.cc/150?u=carlos',
  verified: true,
  rating: 4.9,
  reviews: 124,
  distance: 'A 1.2 km',
  description: 'Especialista en línea blanca con más de 10 años de experiencia reparando lavadoras, neveras y secadoras de todas las marcas (Samsung, LG, Whirlpool, Mabe). Certificado en refrigeración industrial y doméstica. Garantizo un trabajo limpio, rápido y con repuestos originales.',
  stats: {
    jobsCompleted: 342,
    onTimeRate: '98%',
    responseTime: '< 15 min'
  },
  skills: ['Lavadoras', 'Neveras', 'Secadoras', 'Microondas', 'Aires Acondicionados'],
  recentReviews: [
    { id: 1, user: 'María Fernanda', rating: 5, date: 'Hace 2 días', text: 'Excelente servicio. Llegó puntual y arregló mi lavadora en menos de 1 hora. Muy profesional.' },
    { id: 2, user: 'José Luis', rating: 5, date: 'Hace 1 semana', text: 'Me salvó la nevera que estaba perdiendo gas. Me cobró lo justo y dejó todo limpio.' },
    { id: 3, user: 'Andrea G.', rating: 4, date: 'Hace 2 semanas', text: 'Buen técnico, aunque se retrasó un poco por el tráfico. El arreglo quedó perfecto.' }
  ],
  heatMap: [
    { day: 'Lun', active: true }, { day: 'Mar', active: true }, { day: 'Mié', active: false },
    { day: 'Jue', active: true }, { day: 'Vie', active: true }, { day: 'Sáb', active: true }, { day: 'Dom', active: false }
  ]
};

const TechnicianProfile = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  
  // En un app real, haríamos fetch con el ID
  const tech = MOCK_TECH_DETAILS;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header Back Button */}
      <Link to="/search" className="inline-flex items-center text-brand-blue hover:underline mb-6">
        <ChevronLeft size={20} />
        <span>Volver a resultados</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="w-32 h-32 mx-auto rounded-full bg-gray-200 overflow-hidden relative mb-4">
              <img src={tech.avatar} alt={tech.name} className="w-full h-full object-cover" />
              {tech.verified && (
                <div className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-sm">
                  <BadgeCheck className="text-blue-500" size={24} fill="white" />
                </div>
              )}
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900">{tech.name}</h1>
            <p className="text-gray-500 flex items-center justify-center gap-1 mt-1">
              <MapPin size={16} /> {tech.distance}
            </p>
            
            <div className="flex justify-center items-center gap-4 mt-4">
              <div className="text-center">
                <div className="flex items-center font-bold text-gray-900 text-lg">
                  <Star className="text-yellow-400 mr-1" size={18} fill="currentColor" /> {tech.rating}
                </div>
                <div className="text-xs text-gray-500">{tech.reviews} reseñas</div>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="text-center">
                <div className="font-bold text-gray-900 text-lg">{tech.stats.jobsCompleted}</div>
                <div className="text-xs text-gray-500">Trabajos</div>
              </div>
            </div>

            <button 
              onClick={() => setShowModal(true)}
              className="w-full mt-6 bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-brand-blueDark transition-colors shadow-lg shadow-blue-500/30"
            >
              Solicitar Presupuesto Flash
            </button>
          </div>

          {/* Stats & Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h3 className="font-bold text-gray-900 border-b pb-2">Estadísticas de Servicio</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 flex items-center gap-2"><Clock size={16}/> Respuesta</span>
              <span className="font-medium text-gray-900">{tech.stats.responseTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 flex items-center gap-2"><ShieldCheck size={16}/> Puntualidad</span>
              <span className="font-medium text-green-600">{tech.stats.onTimeRate}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-bold text-gray-900 mb-2">Disponibilidad Habitual</h4>
              <div className="flex justify-between gap-1">
                {tech.heatMap.map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className={`w-6 h-6 rounded-md ${day.active ? 'bg-green-100 border border-green-200' : 'bg-gray-100'} flex items-center justify-center`}>
                      {day.active && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
                    </div>
                    <span className="text-[10px] text-gray-500">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Reviews */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sobre mí</h2>
            <p className="text-gray-600 leading-relaxed">
              {tech.description}
            </p>
            
            <div className="mt-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Wrench size={18} className="text-gray-400" /> Especialidades
              </h3>
              <div className="flex flex-wrap gap-2">
                {tech.skills.map((skill, index) => (
                  <span key={index} className="bg-blue-50 text-brand-blue px-3 py-1 rounded-full text-sm font-medium border border-blue-100">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Reseñas Recientes</h2>
              <span className="text-brand-blue font-medium text-sm hover:underline cursor-pointer">Ver todas</span>
            </div>

            <div className="space-y-6">
              {tech.recentReviews.map(review => (
                <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">{review.user}</h4>
                      <div className="flex items-center text-xs text-gray-500 gap-2 mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={i < review.rating ? "#FBBF24" : "none"} className={i < review.rating ? "text-yellow-400" : "text-gray-300"} />
                          ))}
                        </div>
                        <span>•</span>
                        <span>{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">{review.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {showModal && (
        <FlashBudgetModal 
          tech={tech} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
};

export default TechnicianProfile;
