import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Map, SlidersHorizontal, MapPin } from 'lucide-react';
import TechnicianCard from '../components/search/TechnicianCard';
import FlashBudgetModal from '../components/search/FlashBudgetModal';

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const serviceQuery = searchParams.get('service') || 'Reparaciones';
  
  const [selectedTech, setSelectedTech] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/technicians');
        const data = await res.json();
        if (res.ok) {
          setTechnicians(data);
        }
      } catch (err) {
        console.error("Error al obtener técnicos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
      {/* Left List Pane */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col bg-white border-r border-gray-200 z-10 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Resultados para "{serviceQuery}"</h1>
          <p className="text-sm text-gray-500 mt-1">{technicians.length} técnicos disponibles cerca de ti</p>
          
          <div className="flex gap-2 mt-4">
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
              <SlidersHorizontal size={16} /> Filtros
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 md:hidden">
              <Map size={16} /> Ver Mapa
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Cargando técnicos...</div>
          ) : technicians.length > 0 ? (
            technicians.map(tech => (
              <TechnicianCard 
                key={tech.id} 
                tech={tech} 
                onQuoteClick={(t) => setSelectedTech(t)} 
              />
            ))
          ) : (
            <div className="text-center py-10 bg-white border border-gray-200 rounded-xl shadow-sm">
              <h3 className="font-bold text-gray-900 mb-1">No hay técnicos disponibles</h3>
              <p className="text-sm text-gray-500">Aún no se han registrado técnicos en la plataforma.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Map Pane (Mock) */}
      <div className="hidden md:flex w-full md:w-1/2 lg:w-3/5 bg-blue-50 relative items-center justify-center">
        {/* Placeholder for actual Map component */}
        <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: 'radial-gradient(#1E3A8A 1px, transparent 1px)', 
          backgroundSize: '20px 20px' 
        }}></div>
        
        <div className="z-10 text-center bg-white p-6 rounded-2xl shadow-lg border border-blue-100 max-w-sm">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="text-brand-blue" size={32} />
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Mapa de Confianza</h3>
          <p className="text-gray-600 text-sm">
            {technicians.length > 0 
              ? `Se muestran ${technicians.length} técnicos en tu zona listos para ayudarte.`
              : 'No hay técnicos en tu zona en este momento.'}
          </p>
        </div>

        {/* Dynamic Map Pins based on technicians count */}
        {technicians.map((tech, index) => {
          // Generate somewhat scattered positions for the mock map based on index
          const positions = [
            { top: '25%', left: '25%' },
            { top: '33%', right: '33%' },
            { bottom: '25%', right: '25%' },
            { top: '15%', left: '50%' },
            { bottom: '15%', left: '20%' },
          ];
          const pos = positions[index % positions.length];
          return (
            <div 
              key={tech.id} 
              className={`absolute text-brand-blue ${index === 0 ? 'animate-bounce' : ''} cursor-pointer hover:text-brand-blueDark hover:scale-110 transition-transform`} 
              style={pos}
              title={tech.name}
              onClick={() => setSelectedTech(tech)}
            >
              <MapPin size={32} fill="currentColor" />
            </div>
          );
        })}
      </div>

      {selectedTech && (
        <FlashBudgetModal 
          tech={selectedTech} 
          onClose={() => setSelectedTech(null)} 
        />
      )}
    </div>
  );
};

export default SearchResults;
