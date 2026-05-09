import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Map, SlidersHorizontal, MapPin } from 'lucide-react';
import TechnicianCard from '../components/search/TechnicianCard';
import FlashBudgetModal from '../components/search/FlashBudgetModal';

// Mock Data
const MOCK_TECHNICIANS = [
  {
    id: 1,
    name: 'Carlos Rodríguez',
    avatar: 'https://i.pravatar.cc/150?u=carlos',
    verified: true,
    rating: 4.9,
    reviews: 124,
    distance: 'A 1.2 km',
    description: 'Especialista en línea blanca. 10 años de experiencia reparando lavadoras y neveras de todas las marcas.',
  },
  {
    id: 2,
    name: 'Roberto Gómez',
    avatar: 'https://i.pravatar.cc/150?u=roberto',
    verified: true,
    rating: 4.7,
    reviews: 89,
    distance: 'A 2.5 km',
    description: 'Técnico certificado en refrigeración residencial y comercial. Respuesta inmediata para emergencias.',
  },
  {
    id: 3,
    name: 'Luis Méndez',
    avatar: 'https://i.pravatar.cc/150?u=luis',
    verified: false,
    rating: 4.5,
    reviews: 32,
    distance: 'A 3.8 km',
    description: 'Reparación de electrodomésticos menores y mantenimiento preventivo.',
  }
];

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const serviceQuery = searchParams.get('service') || 'Reparaciones';
  
  const [selectedTech, setSelectedTech] = useState(null);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
      {/* Left List Pane */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col bg-white border-r border-gray-200 z-10 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Resultados para "{serviceQuery}"</h1>
          <p className="text-sm text-gray-500 mt-1">{MOCK_TECHNICIANS.length} técnicos disponibles cerca de ti</p>
          
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
          {MOCK_TECHNICIANS.map(tech => (
            <TechnicianCard 
              key={tech.id} 
              tech={tech} 
              onQuoteClick={(t) => setSelectedTech(t)} 
            />
          ))}
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
            Los técnicos mostrados están validados y se encuentran en tu misma zona para asegurar un servicio rápido y económico.
          </p>
        </div>

        {/* Mock Map Pins */}
        <div className="absolute top-1/4 left-1/4 text-brand-blue animate-bounce"><MapPin size={32} fill="currentColor" /></div>
        <div className="absolute top-1/3 right-1/3 text-brand-blue"><MapPin size={32} fill="currentColor" /></div>
        <div className="absolute bottom-1/4 right-1/4 text-brand-blue"><MapPin size={32} fill="currentColor" /></div>
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
