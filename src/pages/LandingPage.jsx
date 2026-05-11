import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ShieldCheck, Zap, ArrowRight, Star, Settings, MapPin } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useContext(AuthContext);

  const categories = [
    { icon: <Wrench size={28} />, name: 'Lavadoras' },
    { icon: <Settings size={28} />, name: 'Neveras' },
    { icon: <Zap size={28} />, name: 'Aires Acondicionados' },
    { icon: <Zap size={28} />, name: 'Electricidad' },
    { icon: <Wrench size={28} />, name: 'Plomería' },
    { icon: <Settings size={28} />, name: 'Pintura' },
  ];

  return (
    <div className="flex flex-col w-full bg-white font-sans">
      
      {/* Hero Section */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img src="/home.png" alt="FixIt Hero" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-black/55"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8 text-white/90 text-sm font-medium">
            <Star className="text-yellow-400" size={16} fill="currentColor" />
            <span>La plataforma #1 de servicios a domicilio</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight drop-shadow-sm">
            Reparaciones de confianza <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-white">
               al instante.
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-blue-100/90 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Encuentra técnicos verificados en tu zona. Presupuestos rápidos, sin fricciones y con el pago siempre protegido por nuestra plataforma.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                to={user.role === 'technician' ? '/dashboard/technician' : '/dashboard/client'}
                className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold py-4 px-10 rounded-full hover:bg-blue-50 transition-all transform hover:scale-105 active:scale-95 shadow-xl text-lg"
              >
                Ir a mi panel <ArrowRight size={20} />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold py-4 px-10 rounded-full hover:bg-blue-50 transition-all transform hover:scale-105 active:scale-95 shadow-xl text-lg"
                >
                  Comenzar Ahora <ArrowRight size={20} />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-white/10 border border-white/30 backdrop-blur-md text-white font-bold py-4 px-10 rounded-full hover:bg-white/20 transition-all text-lg"
                >
                  Iniciar Sesión
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto text-white fill-current">
            <path d="M0,96L48,85.3C96,75,192,53,288,48C384,43,480,53,576,64C672,75,768,85,864,80C960,75,1056,53,1152,48C1248,43,1344,53,1392,58.7L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              ¿En qué te podemos ayudar hoy?
            </h2>
            <p className="mt-4 text-xl text-gray-500">Selecciona una categoría para encontrar expertos inmediatamente.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, idx) => (
              <div 
                key={idx} 
                className="group flex flex-col items-center p-8 bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(30,58,138,0.15)] cursor-pointer transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="w-16 h-16 mb-5 bg-blue-50 text-brand-blue rounded-2xl flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300">
                  {cat.icon}
                </div>
                <span className="font-bold text-gray-800 text-center group-hover:text-brand-blue transition-colors">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Prop Section (Premium Layout) */}
      <section className="py-24 px-4 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                  Una forma <span className="text-brand-blue">más inteligente</span> de reparar tu hogar.
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Olvídate de buscar en directorios telefónicos o grupos de Facebook. FixIt te conecta con los mejores en minutos.
                </p>
              </div>
              
              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center shadow-sm">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Seguridad Garantizada</h3>
                    <p className="text-gray-600">Verificamos la identidad, antecedentes y experiencia de cada técnico antes de aprobarlos en nuestra plataforma.</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-14 h-14 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center shadow-sm">
                    <Zap size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Presupuesto Flash</h3>
                    <p className="text-gray-600">Publica tu problema, y recibe ofertas en menos de 5 minutos gracias a nuestro sistema de alertas locales en tiempo real.</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-14 h-14 bg-blue-100 text-brand-blueLight rounded-2xl flex items-center justify-center shadow-sm">
                    <MapPin size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Pagos Retenidos (Escrow)</h3>
                    <p className="text-gray-600">Tu dinero está seguro. El técnico solo recibe el pago cuando tú apruebas que el trabajo fue finalizado correctamente.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mockup / Image visualization */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue to-blue-300 rounded-[3rem] transform rotate-3 opacity-20 filter blur-xl"></div>
              <div className="relative bg-white rounded-[3rem] shadow-2xl p-8 border border-gray-100">
                <div className="w-full h-64 bg-gray-50 rounded-2xl mb-6 border border-gray-100 flex items-center justify-center relative overflow-hidden">
                   {/* Abstract Map UI Mock */}
                   <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#3B82F6 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
                   <div className="relative z-10 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center animate-bounce border-4 border-brand-blueLight">
                     <div className="w-4 h-4 bg-brand-blue rounded-full"></div>
                   </div>
                   <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-white rounded-full shadow-md border-2 border-gray-300 flex items-center justify-center"><div className="w-2 h-2 bg-gray-400 rounded-full"></div></div>
                   <div className="absolute bottom-1/3 right-1/4 w-10 h-10 bg-white rounded-full shadow-md border-2 border-green-400 flex items-center justify-center"><div className="w-3 h-3 bg-green-500 rounded-full"></div></div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-100 rounded-full w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded-full w-1/2"></div>
                  <div className="h-12 bg-brand-blue/10 rounded-xl w-full mt-4 flex items-center justify-between px-4">
                     <div className="h-4 bg-brand-blue/20 rounded-full w-1/3"></div>
                     <div className="w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center"><ArrowRight size={16}/></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
