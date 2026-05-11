import { useState, useEffect } from 'react';
import { X, CheckCircle, Clock } from 'lucide-react';

const FlashBudgetModal = ({ tech, onClose }) => {
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

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
          service: 'Solicitud Flash',
          description,
          target_technician_id: tech.id,
          proposed_price: parseFloat(price)
        })
      });
      if (!res.ok) throw new Error('Error al enviar la solicitud');
      setStep(3); // Success
    } catch (err) {
      console.error(err);
      alert('Error enviando la propuesta');
      setStep(1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
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
                  Envía tu propuesta a <strong>{tech?.name}</strong>. Recibirá una notificación instantánea.
                </p>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Describe el problema
                </label>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
                    className="w-full border border-gray-300 rounded-lg p-3 pl-8 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Enviar Propuesta
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="text-center py-8">
              <div className="animate-spin text-blue-600 mx-auto w-12 h-12 mb-4">
                <Clock size={48} />
              </div>
              <h3 className="font-bold text-lg mb-2">Enviando solicitud...</h3>
              <p className="text-gray-500 text-sm">
                Conectando con el panel del técnico...
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="text-green-500 mx-auto w-16 h-16 mb-4">
                <CheckCircle size={64} />
              </div>
              <h3 className="font-bold text-2xl mb-2 text-gray-900">¡Propuesta Enviada!</h3>
              <p className="text-gray-600 mb-6">
                <strong>{tech?.name}</strong> ha recibido tu oferta de ${price} y te responderá en breve. Podrás ver el estado en la pestaña "Mis Trabajos".
              </p>
              <button 
                onClick={onClose}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Entendido
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashBudgetModal;
