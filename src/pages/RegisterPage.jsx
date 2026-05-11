import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, Eye, EyeOff, User, CheckCircle2, XCircle } from 'lucide-react';

const ValidationItem = ({ valid, text }) => (
  <div className={`flex items-center gap-2 text-xs ${valid ? 'text-green-600' : 'text-gray-400'}`}>
    {valid ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
    <span>{text}</span>
  </div>
);

const RegisterPage = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('client');
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validations = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    passwordsMatch: password === confirmPassword && confirmPassword !== '',
  };

  const allValid =
    Object.values(validations).every(Boolean) &&
    name.trim() !== '' &&
    email.trim() !== '' &&
    (role === 'client' || city.trim() !== '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allValid) {
      setError('Por favor corrige los errores antes de continuar.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      let lat = null;
      let lng = null;

      // Geocode city for technicians
      if (role === 'technician' && city.trim()) {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city + ', Venezuela')}&format=json&limit=1&countrycodes=ve`,
          { headers: { 'Accept-Language': 'es' } }
        );
        const geoData = await geoRes.json();
        if (geoData.length > 0) {
          lat = parseFloat(geoData[0].lat);
          lng = parseFloat(geoData[0].lon);
        } else {
          setError(`No se encontró "${city}" en Venezuela. Verifica el nombre de la ciudad.`);
          setLoading(false);
          return;
        }
      }

      await register(name, email, password, role, city || null, lat, lng);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] relative flex items-center justify-center py-10">
      {/* Background */}
      <div className="absolute inset-0">
        <img src="/home.png" alt="background" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-blue-950/72 backdrop-blur-sm"></div>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Avatar Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-blue-100">
              <UserPlus size={30} className="text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">Crear cuenta</h2>
          <p className="text-gray-400 text-center text-sm mb-7">Únete a FixIt y encuentra técnicos de confianza</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Tu nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Role Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Cómo quieres usar FixIt? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('client')}
                  className={`py-3 px-4 rounded-xl border-2 font-medium text-sm transition-all ${
                    role === 'client'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  🙋 Soy Cliente
                </button>
                <button
                  type="button"
                  onClick={() => setRole('technician')}
                  className={`py-3 px-4 rounded-xl border-2 font-medium text-sm transition-all ${
                    role === 'technician'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  🔧 Soy Técnico
                </button>
              </div>
            </div>

            {/* City — only for technicians */}
            {role === 'technician' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tu ciudad <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">📍</span>
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Ej: Caracas, Maracaibo, Valencia..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Usaremos tu ciudad para ubicarte en el mapa y conectarte con clientes cercanos.
                </p>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Crea una contraseña segura"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Validation hints */}
              {password && (
                <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                  <ValidationItem valid={validations.minLength} text="Al menos 8 caracteres" />
                  <ValidationItem valid={validations.hasUppercase} text="Al menos una letra mayúscula" />
                  <ValidationItem valid={validations.hasNumber} text="Al menos un número" />
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  className={`w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    confirmPassword && !validations.passwordsMatch ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmPassword && !validations.passwordsMatch && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <XCircle size={12} /> Las contraseñas no coinciden
                </p>
              )}
              {confirmPassword && validations.passwordsMatch && (
                <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Las contraseñas coinciden
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !allValid}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/30"
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
              ¿Ya tienes una cuenta? <span className="underline">Inicia sesión</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
