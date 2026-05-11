import React, { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { X, Check } from 'lucide-react';

const AvatarCropper = ({ image, onSave, onCancel }) => {
  const editorRef = useRef(null);
  const [scale, setScale] = useState(1.2);

  const handleSave = () => {
    if (editorRef.current) {
      // Obtenemos el canvas recortado con la resolución deseada
      const canvas = editorRef.current.getImageScaledToCanvas();
      // Convertimos a base64 (jpeg para menor peso)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      onSave(dataUrl);
    }
  };

  if (!image) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Ajustar foto de perfil</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-gray-50 rounded-2xl overflow-hidden mb-6 border border-gray-100 p-2">
            <AvatarEditor
              ref={editorRef}
              image={image}
              width={250}
              height={250}
              border={20}
              color={[255, 255, 255, 0.6]} // RGBA
              scale={scale}
              rotate={0}
              borderRadius={125} // Mitad de width/height hace el recorte circular visualmente
            />
          </div>

          <div className="w-full px-4 mb-8">
            <label className="text-sm font-medium text-gray-700 mb-2 block text-center">Ajustar Zoom</label>
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex justify-center items-center gap-2 shadow-lg shadow-blue-500/25"
            >
              <Check size={20} /> Recortar y Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarCropper;
