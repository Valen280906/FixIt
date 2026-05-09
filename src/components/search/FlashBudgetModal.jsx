import { useState, useEffect } from 'react';
import { X, CheckCircle, Clock } from 'lucide-react';

const FlashBudgetModal = ({ tech, onClose }) => {
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(2); // Simulated waiting state
    
    // Simulate accepting after 3 seconds
    setTimeout(() => {
      setStep(3);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-lg">Presupuesto Flash</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">
                  Envía tu propuesta a <strong>{tech?.name}</strong>. Si acepta, el trato se cierra al instante.
                </p>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Describe el problema
                </label>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                  rows="3"
                  placeholder="Ej. La lavadora no centrifuga y hace un ruido fuerte..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tu oferta de precio ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input 
                    type="number" 
                    className="w-full border border-gray-300 rounded-lg p-3 pl-8 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-brand-blueDark transition-colors"
              >
                Enviar Propuesta
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="text-center py-8">
              <div className="animate-spin text-brand-blue mx-auto w-12 h-12 mb-4">
                <Clock size={48} />
              </div>
              <h3 className="font-bold text-lg mb-2">Esperando respuesta...</h3>
              <p className="text-gray-500 text-sm">
                {tech?.name} está revisando tu oferta de ${price}. Esto suele tomar menos de 5 minutos.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="text-green-500 mx-auto w-16 h-16 mb-4">
                <CheckCircle size={64} />
              </div>
              <h3 className="font-bold text-2xl mb-2 text-gray-900">¡Oferta Aceptada!</h3>
              <p className="text-gray-600 mb-6">
                {tech?.name} ha aceptado realizar el trabajo por ${price}. 
              </p>
              <button 
                onClick={onClose}
                className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors"
              >
                Proceder al Pago Protegido
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashBudgetModal;
