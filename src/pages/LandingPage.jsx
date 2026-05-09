import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Wrench, ShieldCheck, Zap } from 'lucide-react';

const LandingPage = () => {
  const [service, setService] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (service) {
      navigate(`/search?service=${encodeURIComponent(service)}&location=${encodeURIComponent(location)}`);
    }
  };

  const categories = [
    { icon: <Wrench size={24} />, name: 'Lavadoras' },
    { icon: <Wrench size={24} />, name: 'Neveras' },
    { icon: <Wrench size={24} />, name: 'Aires Acondicionados' },
    { icon: <Wrench size={24} />, name: 'Electricidad' },
    { icon: <Wrench size={24} />, name: 'Plomería' },
    { icon: <Wrench size={24} />, name: 'Pintura' },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="bg-brand-blue text-white py-20 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Reparaciones de confianza al instante.
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Encuentra técnicos verificados cerca de ti. Presupuestos rápidos, garantía de satisfacción y pago protegido.
          </p>
          
          <form onSubmit={handleSearch} className="bg-white rounded-lg md:rounded-full p-2 flex flex-col md:flex-row gap-2 max-w-3xl mx-auto shadow-xl">
            <div className="flex-1 flex items-center bg-gray-50 rounded-full px-4 py-3 md:bg-transparent md:p-0">
              <Search className="text-gray-400 mr-2" size={20} />
              <input 
                type="text" 
                placeholder="¿Qué necesitas reparar? (ej. Lavadora)" 
                className="w-full bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
                value={service}
                onChange={(e) => setService(e.target.value)}
                required
              />
            </div>
            <div className="hidden md:block w-px bg-gray-300 mx-2"></div>
            <div className="flex-1 flex items-center bg-gray-50 rounded-full px-4 py-3 md:bg-transparent md:p-0">
              <MapPin className="text-gray-400 mr-2" size={20} />
              <input 
                type="text" 
                placeholder="Tu ubicación" 
                className="w-full bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="bg-brand-blueLight hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full transition-colors w-full md:w-auto"
            >
              Buscar
            </button>
          </form>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Servicios más solicitados</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, idx) => (
              <div key={idx} className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors border border-gray-100 hover:border-gray-300">
                <div className="text-brand-blue mb-3">
                  {cat.icon}
                </div>
                <span className="font-medium text-gray-800 text-center">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Prop Section */}
      <section className="py-20 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">¿Por qué elegir FixIt?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-blue">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Check Azul de Confianza</h3>
              <p className="text-gray-600">Todos nuestros técnicos pasan por una rigurosa validación de identidad y antecedentes. Tu seguridad es primero.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-blue">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Presupuesto Flash</h3>
              <p className="text-gray-600">Propón tu precio y recibe confirmación en menos de 5 minutos. Sin esperas interminables por cotizaciones.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-blue">
                <MapPin size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Técnicos de tu Zona</h3>
              <p className="text-gray-600">Priorizamos a los profesionales más cercanos para reducir costos de transporte y asegurar una respuesta rápida.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
