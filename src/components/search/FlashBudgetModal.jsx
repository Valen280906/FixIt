import { useState } from 'react';
import { X, CheckCircle, Clock, Star, MapPin, Phone, User, Wrench } from 'lucide-react';

const FlashBudgetModal = ({ tech, onClose }) => {
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState('');

  const tokenLocal = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStep(2); // Sending state
    
    try {
      const res = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenLocal}`
        },
        body: JSON.stringify({
          service: 'Solicitud de Evaluación',
          description,
          target_technician_id: tech.id,
          proposed_price: null // El técnico pondrá el precio
        })
      });
      if (!res.ok) throw new Error('Error al enviar la solicitud');
      setStep(3); // Success
    } catch (err) {
      console.error(err);
      alert('Error enviando la solicitud');
      setStep(1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-lg text-gray-800">Perfil del Técnico</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="flex flex-col gap-6">
              {/* Información del Técnico */}
              <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
                <img 
                  src={tech?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(tech?.name || 'Técnico')}&background=0D8ABC&color=fff`} 
                  alt={tech?.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">{tech?.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-yellow-500 mb-1">
                    <Star size={14} className="fill-current" />
                    <span className="font-medium text-gray-700">{tech?.rating || '5.0'}</span>
                    <span className="text-gray-400">({tech?.reviews || 0} reseñas)</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                    {tech?.city && (
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {tech.city}
                      </span>
                    )}
                    {tech?.phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={14} /> {tech.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {tech?.description && (
                <div className="text-sm text-gray-600">
                  <h4 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                    <User size={16}/> Sobre mí
                  </h4>
                  <p>{tech.description}</p>
                </div>
              )}

              <hr className="border-gray-100" />

              {/* Formulario de Solicitud */}
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Wrench size={16}/> Solicitar Evaluación
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Describe detalladamente el problema con tu electrodoméstico. El técnico lo evaluará y te enviará un diagnóstico y presupuesto.
                  </p>
                  <textarea 
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                    rows="4"
                    placeholder="Ej. La lavadora modelo X no centrifuga y hace un ruido fuerte al intentar drenar el agua..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex justify-center items-center gap-2"
                >
                  Enviar Problema al Técnico
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="text-center py-12">
              <div className="animate-spin text-blue-600 mx-auto w-12 h-12 mb-4">
                <Clock size={48} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">Enviando solicitud...</h3>
              <p className="text-gray-500 text-sm">
                Conectando con el panel del técnico...
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-12">
              <div className="text-green-500 mx-auto w-16 h-16 mb-4 animate-bounce">
                <CheckCircle size={64} />
              </div>
              <h3 className="font-bold text-2xl mb-2 text-gray-900">¡Solicitud Enviada!</h3>
              <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                <strong>{tech?.name}</strong> ha recibido la descripción de tu problema. Pronto te responderá con una evaluación detallada y el presupuesto del trabajo.
              </p>
              <button 
                onClick={onClose}
                className="w-full bg-gray-100 text-gray-800 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cerrar y ver en Mis Trabajos
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashBudgetModal;
